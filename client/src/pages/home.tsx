import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { CameraScreen } from "@/components/camera-screen";
import { FilterScreen } from "@/components/filter-screen";
import { ProcessingScreen } from "@/components/processing-screen";
import { ResultScreen } from "@/components/result-screen";
import { uploadImage, getImageResult } from "@/lib/api";
import { AppScreen } from "@/types";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("camera");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const [imageId, setImageId] = useState<number | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string>("");
  
  const { toast } = useToast();

  // Poll for image result when processing
  const { data: imageResult } = useQuery({
    queryKey: ["/api/images", imageId],
    enabled: !!imageId && currentScreen === "processing",
    refetchInterval: 2000, // Poll every 2 seconds
  });

  // Handle image result updates
  useEffect(() => {
    if (imageResult) {
      if (imageResult.status === "completed" && imageResult.filteredUrl) {
        setCurrentScreen("result");
      } else if (imageResult.status === "failed") {
        toast({
          title: "Processing Failed",
          description: "The image was flagged by content filters or processing failed. Please try a different photo.",
          variant: "destructive",
        });
        setCurrentScreen("filter");
      }
    }
  }, [imageResult, toast]);

  const handleImageSelect = (file: File) => {
    setSelectedFile(file);
    setOriginalImageUrl(URL.createObjectURL(file));
    setCurrentScreen("filter");
  };

  const handleApplyFilter = async (filterType: string) => {
    if (!selectedFile) return;

    setSelectedFilter(filterType);
    setCurrentScreen("processing");

    try {
      const result = await uploadImage(selectedFile, filterType);
      setImageId(result.imageId);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      setCurrentScreen("filter");
    }
  };

  const handleBack = () => {
    switch (currentScreen) {
      case "filter":
        setCurrentScreen("camera");
        setSelectedFile(null);
        setOriginalImageUrl("");
        break;
      case "result":
        setCurrentScreen("filter");
        break;
      default:
        break;
    }
  };

  const handleCancel = () => {
    setCurrentScreen("filter");
    setImageId(null);
  };

  const handleTryAnother = () => {
    setCurrentScreen("filter");
    setImageId(null);
  };

  const handleStartOver = () => {
    setCurrentScreen("camera");
    setSelectedFile(null);
    setOriginalImageUrl("");
    setSelectedFilter("");
    setImageId(null);
  };

  const getFilterName = () => {
    const filterNames: Record<string, string> = {
      cartoon: "Cartoon",
      anime: "Anime",
      cyberpunk: "Cyberpunk",
      watercolor: "Watercolor",
      "old-photo": "Old Photo"
    };
    return filterNames[selectedFilter] || selectedFilter;
  };

  return (
    <div className="max-w-sm mx-auto bg-black min-h-screen relative">
      {currentScreen === "camera" && (
        <CameraScreen onImageSelect={handleImageSelect} />
      )}
      
      {currentScreen === "filter" && selectedFile && (
        <FilterScreen 
          selectedImage={selectedFile}
          onBack={handleBack}
          onApplyFilter={handleApplyFilter}
        />
      )}
      
      {currentScreen === "processing" && (
        <ProcessingScreen onCancel={handleCancel} />
      )}
      
      {currentScreen === "result" && imageResult && (
        <ResultScreen 
          originalImage={originalImageUrl}
          filteredImage={imageResult.filteredUrl || ""}
          filterName={getFilterName()}
          onBack={handleBack}
          onTryAnother={handleTryAnother}
          onStartOver={handleStartOver}
        />
      )}
    </div>
  );
}
