import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertImageSchema, filterTypes } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

// Setup multer for file uploads
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Upload image and start processing
  app.post("/api/upload", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const { filterType } = req.body;
      if (!filterType || !filterTypes.includes(filterType)) {
        return res.status(400).json({ message: "Invalid filter type" });
      }

      // Create image record
      const image = await storage.createImage({
        originalUrl: `/uploads/${req.file.filename}`,
        filteredUrl: null,
        filterType,
        status: "processing",
      });

      // Start processing with Replicate API
      processImageWithReplicate(image.id, req.file.path, filterType);

      res.json({ imageId: image.id, status: "processing" });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Failed to upload image" });
    }
  });

  // Get image status and result
  app.get("/api/images/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const image = await storage.getImage(id);
      
      if (!image) {
        return res.status(404).json({ message: "Image not found" });
      }

      res.json(image);
    } catch (error) {
      console.error("Get image error:", error);
      res.status(500).json({ message: "Failed to get image" });
    }
  });

  // Serve uploaded files
  app.use("/uploads", express.static(uploadDir));

  const httpServer = createServer(app);
  return httpServer;
}

async function processImageWithReplicate(imageId: number, imagePath: string, filterType: string) {
  try {
    const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
    if (!REPLICATE_API_TOKEN) {
      throw new Error("REPLICATE_API_TOKEN not found in environment variables");
    }

    // Read image file and convert to base64
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = `data:image/jpeg;base64,${imageBuffer.toString("base64")}`;

    // Prepare prompt based on filter type
    const prompts: Record<string, string> = {
      cartoon: "A person in cartoon style, animated, colorful, 3d CGI, art by Pixar",
      anime: "A person in anime style, manga, japanese animation style",
      cyberpunk: "A person in cyberpunk style, neon lights, futuristic, digital art",
      watercolor: "A person in watercolor painting style, artistic, soft brushstrokes",
      "old-photo": "A person in vintage photograph style, sepia tone, aged, historical"
    };

    const prompt = `${prompts[filterType]}, high quality, detailed`;

    // Call Replicate API with PhotoMaker model
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
        "Prefer": "wait"
      },
      body: JSON.stringify({
        version: "tencentarc/photomaker-style:467d062309da518648ba89d226490e02b8ed09b5abc15026e54e31c5a8cd0769",
        input: {
          prompt: prompt,
          input_image: base64Image,
          num_steps: 50,
          style_name: "(No style)",
          num_outputs: 1,
          guidance_scale: 5,
          negative_prompt: "realistic, photo-realistic, worst quality, greyscale, bad anatomy, bad hands, error, text",
          style_strength_ratio: 35
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Replicate API error: ${response.statusText}`);
    }

    const prediction = await response.json();
    
    // Poll for completion
    await pollForCompletion(imageId, prediction.id, REPLICATE_API_TOKEN);
    
  } catch (error) {
    console.error("Replicate processing error:", error);
    await storage.updateImage(imageId, { status: "failed" });
  }
}

async function pollForCompletion(imageId: number, predictionId: string, apiToken: string) {
  const maxAttempts = 60; // 5 minutes max
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
        headers: {
          "Authorization": `Token ${apiToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to check prediction status: ${response.statusText}`);
      }

      const prediction = await response.json();

      if (prediction.status === "succeeded" && prediction.output) {
        // Handle both array and single URL formats
        const outputUrl = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
        await storage.updateImage(imageId, {
          filteredUrl: outputUrl,
          status: "completed",
        });
        return;
      } else if (prediction.status === "failed") {
        await storage.updateImage(imageId, { status: "failed" });
        return;
      }

      // Wait 5 seconds before next poll
      await new Promise(resolve => setTimeout(resolve, 5000));
      attempts++;
    } catch (error) {
      console.error("Polling error:", error);
      await storage.updateImage(imageId, { status: "failed" });
      return;
    }
  }

  // Timeout
  await storage.updateImage(imageId, { status: "failed" });
}
