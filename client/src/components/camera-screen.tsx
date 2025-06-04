import { useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Image, Settings, Zap, RotateCcw } from "lucide-react";

interface CameraScreenProps {
  onImageSelect: (file: File) => void;
}

export function CameraScreen({ onImageSelect }: CameraScreenProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Status Bar */}
      <div className="flex justify-between items-center p-4 text-sm text-gray-300">
        <span>9:41</span>
        <div className="flex gap-2 text-xs">
          <span>📶</span>
          <span>📶</span>
          <span>🔋</span>
        </div>
      </div>

      {/* App Header */}
      <div className="px-6 pb-4">
        <h1 className="text-2xl font-bold text-white">VibeFilter</h1>
        <p className="text-gray-400 text-sm">Transform your photos with AI</p>
      </div>

      {/* Camera Viewfinder Area */}
      <div className="relative mx-4 mb-6 bg-zinc-800 rounded-2xl overflow-hidden aspect-[3/4]">
        <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center">
          <div className="text-center">
            <Camera className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-500">Camera preview would appear here</p>
          </div>
        </div>
        
        {/* Camera Overlay Controls */}
        <div className="absolute inset-0 bg-black bg-opacity-20">
          {/* Top Controls */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
            <Button size="icon" variant="secondary" className="w-10 h-10 bg-black/50 hover:bg-black/70 border-0">
              <Zap className="w-4 h-4 text-white" />
            </Button>
            <Button size="icon" variant="secondary" className="w-10 h-10 bg-black/50 hover:bg-black/70 border-0">
              <RotateCcw className="w-4 h-4 text-white" />
            </Button>
          </div>

          {/* Grid Lines */}
          <div className="absolute inset-4 border border-white/20 pointer-events-none border-dashed">
            <div className="w-full h-1/3 border-b border-white/20 border-dashed"></div>
            <div className="w-full h-1/3 border-b border-white/20 border-dashed"></div>
          </div>

          {/* Focus Ring */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 border-white/50 rounded-full pointer-events-none animate-pulse"></div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-6">
        <div className="flex items-center justify-between mb-6">
          {/* Gallery Button */}
          <Button 
            size="icon" 
            variant="secondary" 
            className="w-12 h-12 bg-zinc-800 hover:bg-zinc-700 border-0"
            onClick={triggerFileInput}
          >
            <Image className="w-6 h-6" />
          </Button>

          {/* Capture Button */}
          <Button 
            size="icon" 
            className="w-20 h-20 bg-white hover:bg-gray-100 text-black rounded-full"
            onClick={triggerFileInput}
          >
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
              <Camera className="w-8 h-8 text-white" />
            </div>
          </Button>

          {/* Settings Button */}
          <Button 
            size="icon" 
            variant="secondary" 
            className="w-12 h-12 bg-zinc-800 hover:bg-zinc-700 border-0"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-2">Or choose existing photo</p>
          <Button 
            variant="secondary" 
            className="bg-zinc-800 hover:bg-zinc-700 border-0"
            onClick={triggerFileInput}
          >
            <Image className="w-4 h-4 mr-2" />
            Choose from Gallery
          </Button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
