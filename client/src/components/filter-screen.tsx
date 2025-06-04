import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Sliders } from "lucide-react";
import { FilterOption } from "@/types";

interface FilterScreenProps {
  selectedImage: File;
  onBack: () => void;
  onApplyFilter: (filterType: string) => void;
}

const filterOptions: FilterOption[] = [
  {
    id: "cartoon",
    name: "Cartoon",
    description: "Fun animated style",
    icon: "😄",
    gradient: "from-pink-400 to-purple-500"
  },
  {
    id: "anime",
    name: "Anime",
    description: "Japanese animation style",
    icon: "⭐",
    gradient: "from-blue-400 to-cyan-500"
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    description: "Futuristic neon aesthetic",
    icon: "🤖",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    id: "watercolor",
    name: "Watercolor",
    description: "Artistic paint effect",
    icon: "🎨",
    gradient: "from-green-400 to-blue-400"
  },
  {
    id: "old-photo",
    name: "Old Photo",
    description: "Vintage sepia tone",
    icon: "📷",
    gradient: "from-yellow-600 to-orange-600"
  }
];

export function FilterScreen({ selectedImage, onBack, onApplyFilter }: FilterScreenProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const imageUrl = selectedImage ? URL.createObjectURL(selectedImage) : "";

  const handleFilterSelect = (filterId: string) => {
    setSelectedFilter(filterId);
  };

  const handleApplyFilter = () => {
    if (selectedFilter) {
      onApplyFilter(selectedFilter);
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
        <h2 className="text-lg font-semibold">Choose Filter</h2>
        <Button 
          size="icon" 
          variant="secondary" 
          className="w-10 h-10 bg-zinc-800 hover:bg-zinc-700 border-0"
        >
          <Sliders className="w-4 h-4" />
        </Button>
      </div>

      {/* Original Photo Preview */}
      <div className="p-6">
        <div className="bg-zinc-800 rounded-2xl overflow-hidden mb-6 aspect-[4/3]">
          {imageUrl && (
            <img 
              src={imageUrl} 
              alt="Selected photo" 
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Filter Categories */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-4">Filter Styles</h3>
          
          <div className="space-y-3">
            {filterOptions.map((filter) => (
              <Card
                key={filter.id}
                className={`bg-zinc-800 border-zinc-700 p-4 cursor-pointer transition-all hover:scale-105 active:scale-95 ${
                  selectedFilter === filter.id ? 'ring-2 ring-red-500' : ''
                }`}
                onClick={() => handleFilterSelect(filter.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${filter.gradient} rounded-xl flex items-center justify-center text-2xl`}>
                    {filter.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{filter.name}</h4>
                    <p className="text-gray-400 text-sm">{filter.description}</p>
                  </div>
                  <div className="w-6 h-6 border-2 border-gray-600 rounded-full flex items-center justify-center">
                    {selectedFilter === filter.id && (
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Apply Filter Button */}
        <Button 
          className={`w-full py-4 font-semibold text-white transition-all ${
            selectedFilter 
              ? 'bg-red-500 hover:bg-red-600 cursor-pointer' 
              : 'bg-gray-600 cursor-not-allowed'
          }`}
          onClick={handleApplyFilter}
          disabled={!selectedFilter}
        >
          {selectedFilter 
            ? `Apply ${filterOptions.find(f => f.id === selectedFilter)?.name} Filter`
            : 'Select a Filter to Continue'
          }
        </Button>
      </div>
    </div>
  );
}
