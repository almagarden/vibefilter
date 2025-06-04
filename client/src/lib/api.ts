import { apiRequest } from "./queryClient";

export interface UploadResponse {
  imageId: number;
  status: string;
}

export interface ImageResult {
  id: number;
  originalUrl: string;
  filteredUrl: string | null;
  filterType: string;
  status: string;
  createdAt: string;
}

export async function uploadImage(file: File, filterType: string): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("filterType", filterType);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Upload failed");
  }

  return response.json();
}

export async function getImageResult(imageId: number): Promise<ImageResult> {
  const response = await fetch(`/api/images/${imageId}`, {
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to get image result");
  }

  return response.json();
}
