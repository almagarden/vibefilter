export interface FilterOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  gradient: string;
}

export interface ProcessingStage {
  progress: number;
  text: string;
}

export type AppScreen = "camera" | "filter" | "processing" | "result";

export interface AppState {
  currentScreen: AppScreen;
  selectedFile: File | null;
  selectedFilter: string;
  imageId: number | null;
  processingProgress: number;
  resultImage: string | null;
  originalImage: string | null;
}
