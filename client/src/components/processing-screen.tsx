import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ProcessingStage } from "@/types";

interface ProcessingScreenProps {
  onCancel: () => void;
}

const processingStages: ProcessingStage[] = [
  { progress: 10, text: "Uploading image..." },
  { progress: 30, text: "Analyzing photo..." },
  { progress: 60, text: "Applying AI filter..." },
  { progress: 85, text: "Finalizing result..." },
  { progress: 100, text: "Complete!" }
];

export function ProcessingScreen({ onCancel }: ProcessingScreenProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Initializing...");

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentStage < processingStages.length) {
        const stage = processingStages[currentStage];
        setProgress(stage.progress);
        setStatusText(stage.text);
        setCurrentStage(prev => prev + 1);
      } else {
        clearInterval(interval);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [currentStage]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      {/* Processing Animation */}
      <div className="w-32 h-32 mb-8 relative">
        <div className="absolute inset-0 border-4 border-red-500/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-4 bg-zinc-800 rounded-full flex items-center justify-center">
          <span className="text-red-500 text-2xl">✨</span>
        </div>
      </div>

      {/* Processing Text */}
      <h2 className="text-2xl font-bold text-white mb-2">Creating Magic</h2>
      <p className="text-gray-400 text-center mb-6">AI is transforming your photo with the selected filter</p>

      {/* Progress Bar */}
      <div className="w-full max-w-xs bg-zinc-800 rounded-full h-2 mb-4">
        <div 
          className="bg-red-500 h-2 rounded-full transition-all duration-1000" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-gray-400 text-sm">{statusText}</p>

      {/* Cancel Button */}
      <Button 
        variant="secondary" 
        className="mt-8 bg-zinc-800 hover:bg-zinc-700 border-0"
        onClick={onCancel}
      >
        Cancel Processing
      </Button>
    </div>
  );
}
