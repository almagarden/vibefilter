import { images, type Image, type InsertImage } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createImage(image: InsertImage): Promise<Image>;
  getImage(id: number): Promise<Image | undefined>;
  updateImage(id: number, updates: Partial<Image>): Promise<Image | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getImage(id: number): Promise<Image | undefined> {
    const [image] = await db.select().from(images).where(eq(images.id, id));
    return image || undefined;
  }

  async createImage(insertImage: InsertImage): Promise<Image> {
    const [image] = await db
      .insert(images)
      .values({
        originalUrl: insertImage.originalUrl,
        filteredUrl: insertImage.filteredUrl ?? null,
        filterType: insertImage.filterType,
        status: insertImage.status ?? "processing"
      })
      .returning();
    return image;
  }

  async updateImage(id: number, updates: Partial<Image>): Promise<Image | undefined> {
    const [updated] = await db
      .update(images)
      .set(updates)
      .where(eq(images.id, id))
      .returning();
    return updated || undefined;
  }
}

export const storage = new DatabaseStorage();
