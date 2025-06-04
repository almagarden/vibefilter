import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Download, Share, Edit, Camera, Wand2, MoreVertical } from "lucide-react";

interface ResultScreenProps {
  originalImage: string;
  filteredImage: string;
  filterName: string;
  onBack: () => void;
  onTryAnother: () => void;
  onStartOver: () => void;
}

export function ResultScreen({ 
  originalImage, 
  filteredImage, 
  filterName, 
  onBack, 
  onTryAnother, 
  onStartOver 
}: ResultScreenProps) {
  const [showingAfter, setShowingAfter] = useState(true);

  const handleSave = () => {
    const link = document.createElement('a');
    link.href = filteredImage;
    link.download = `vibefilter-${filterName}-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        const response = await fetch(filteredImage);
        const blob = await response.blob();
        const file = new File([blob], `vibefilter-${filterName}.jpg`, { type: 'image/jpeg' });
        
        await navigator.share({
          title: 'Check out my VibeFilter creation!',
          text: `I just created this amazing ${filterName} style photo with VibeFilter`,
          files: [file]
        });
      } catch (error) {
        console.error('Error sharing:', error);
        handleSave(); // Fallback to download
      }
    } else {
      handleSave(); // Fallback to download
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-800">
        <Button 
          size="icon" 
          variant="secondary" 
          className="w-10 h-10 bg-zinc-800 hover:bg-zinc-700 border-0"
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-lg font-semibold">Filtered Result</h2>
        <Button 
          size="icon" 
          variant="secondary" 
          className="w-10 h-10 bg-zinc-800 hover:bg-zinc-700 border-0"
        >
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>

      {/* Before/After Comparison */}
      <div className="p-6">
        <div className="mb-6">
          {/* Result Image */}
          <div className="bg-zinc-800 rounded-2xl overflow-hidden mb-4 aspect-[4/3]">
            <img 
              src={showingAfter ? filteredImage : originalImage}
              alt={showingAfter ? "Filtered result" : "Original image"}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Filter Applied Badge */}
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="bg-red-500 px-4 py-2 rounded-full">
              <span className="text-white font-medium text-sm">{filterName} Filter Applied</span>
            </div>
          </div>

          {/* Before/After Toggle */}
          <div className="flex bg-zinc-800 rounded-xl p-1 mb-6">
            <Button
              variant={showingAfter ? "default" : "ghost"}
              className={`flex-1 py-3 text-center font-medium transition-all ${
                showingAfter ? 'bg-red-500 text-white' : 'text-gray-400 hover:bg-zinc-700'
              }`}
              onClick={() => setShowingAfter(true)}
            >
              After
            </Button>
            <Button
              variant={!showingAfter ? "default" : "ghost"}
              className={`flex-1 py-3 text-center font-medium transition-all ${
                !showingAfter ? 'bg-red-500 text-white' : 'text-gray-400 hover:bg-zinc-700'
              }`}
              onClick={() => setShowingAfter(false)}
            >
              Before
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {/* Primary Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Button 
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-4 flex items-center justify-center space-x-2"
              onClick={handleSave}
            >
              <Download className="w-4 h-4" />
              <span>Save</span>
            </Button>
            <Button 
              variant="secondary"
              className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-4 flex items-center justify-center space-x-2 border-0"
              onClick={handleShare}
            >
              <Share className="w-4 h-4" />
              <span>Share</span>
            </Button>
          </div>

          {/* Secondary Actions */}
          <div className="grid grid-cols-3 gap-3">
            <Button 
              variant="secondary"
              className="bg-zinc-800 hover:bg-zinc-700 text-white py-3 flex flex-col items-center space-y-1 border-0"
            >
              <Edit className="w-4 h-4" />
              <span className="text-xs">Edit More</span>
            </Button>
            <Button 
              variant="secondary"
              className="bg-zinc-800 hover:bg-zinc-700 text-white py-3 flex flex-col items-center space-y-1 border-0"
              onClick={onTryAnother}
            >
              <Wand2 className="w-4 h-4" />
              <span className="text-xs">Try Another</span>
            </Button>
            <Button 
              variant="secondary"
              className="bg-zinc-800 hover:bg-zinc-700 text-white py-3 flex flex-col items-center space-y-1 border-0"
              onClick={onStartOver}
            >
              <Camera className="w-4 h-4" />
              <span className="text-xs">New Photo</span>
            </Button>
          </div>

          {/* Social Sharing */}
          <div className="border-t border-gray-800 pt-6">
            <p className="text-gray-400 text-sm text-center mb-4">Share to social media</p>
            <div className="flex justify-center space-x-6">
              <Button 
                size="icon"
                className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full"
              >
                <span className="text-white font-bold">f</span>
              </Button>
              <Button 
                size="icon"
                className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full"
              >
                <span className="text-white font-bold">📷</span>
              </Button>
              <Button 
                size="icon"
                className="w-12 h-12 bg-blue-400 hover:bg-blue-500 rounded-full"
              >
                <span className="text-white font-bold">🐦</span>
              </Button>
              <Button 
                size="icon"
                className="w-12 h-12 bg-green-500 hover:bg-green-600 rounded-full"
              >
                <span className="text-white font-bold">💬</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
