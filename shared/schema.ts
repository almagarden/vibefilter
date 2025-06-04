import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const images = pgTable("images", {
  id: serial("id").primaryKey(),
  originalUrl: text("original_url").notNull(),
  filteredUrl: text("filtered_url"),
  filterType: text("filter_type").notNull(),
  status: text("status").notNull().default("processing"), // processing, completed, failed
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertImageSchema = createInsertSchema(images).omit({
  id: true,
  createdAt: true,
});

export type InsertImage = z.infer<typeof insertImageSchema>;
export type Image = typeof images.$inferSelect;

export const filterTypes = ["cartoon", "anime", "cyberpunk", "watercolor", "old-photo"] as const;
export type FilterType = typeof filterTypes[number];
