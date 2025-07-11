
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Image, Check, Upload, X } from "lucide-react";

interface ImageSelectorProps {
  selectedImage: string | null;
  onImageSelect: (imageUrl: string) => void;
  disabled?: boolean;
}

const PLACEHOLDER_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=500&h=300&fit=crop&crop=faces",
    alt: "Woman sitting on a bed using a laptop",
    category: "Technology"
  },
  {
    url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=300&fit=crop&crop=center",
    alt: "Turned on gray laptop computer",
    category: "Technology"
  },
  {
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&h=300&fit=crop&crop=center",
    alt: "Macro photography of black circuit board",
    category: "Technology"
  },
  {
    url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&h=300&fit=crop&crop=center",
    alt: "Monitor showing Java programming",
    category: "Programming"
  },
  {
    url: "https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=500&h=300&fit=crop&crop=center",
    alt: "Person using MacBook Pro",
    category: "Technology"
  },
  {
    url: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=500&h=300&fit=crop&crop=faces",
    alt: "Woman in white long sleeve shirt using black laptop computer",
    category: "Technology"
  },
  {
    url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&h=300&fit=crop&crop=center",
    alt: "White robot near brown wall",
    category: "AI/Robotics"
  },
  {
    url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&h=300&fit=crop&crop=center",
    alt: "Matrix movie still",
    category: "Technology"
  },
  {
    url: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=500&h=300&fit=crop&crop=center",
    alt: "Gray and black laptop computer on surface",
    category: "Technology"
  },
  {
    url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&h=300&fit=crop&crop=center",
    alt: "Colorful software or web code on a computer monitor",
    category: "Programming"
  },
  {
    url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=300&fit=crop&crop=center",
    alt: "A group of people standing around a display of video screens",
    category: "Technology"
  }
];

export const ImageSelector = ({ selectedImage, onImageSelect, disabled = false }: ImageSelectorProps) => {
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [localImage, setLocalImage] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be smaller than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setLocalImage(imageUrl);
        onImageSelect(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearLocalImage = () => {
    setLocalImage(null);
    onImageSelect('');
  };

  return (
    <div className="space-y-4">
      <Label className="text-slate-300 text-sm font-medium flex items-center gap-2">
        <Image className="h-4 w-4" />
        Select Image
      </Label>
      
      {/* Local Image Upload */}
      <div className="space-y-2">
        <Label className="text-slate-400 text-xs">Upload from your device</Label>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={() => document.getElementById('file-upload')?.click()}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload Image
          </Button>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={disabled}
          />
          {localImage && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearLocalImage}
              disabled={disabled}
              className="text-red-400 hover:text-red-300"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Show uploaded image */}
      {localImage && (
        <Card className="border-2 border-blue-500 bg-blue-500/10">
          <CardContent className="p-2">
            <div className="relative aspect-video max-w-xs">
              <img
                src={localImage}
                alt="Uploaded image"
                className="w-full h-full object-cover rounded"
              />
              <div className="absolute inset-0 bg-blue-500/20 rounded flex items-center justify-center">
                <Check className="h-6 w-6 text-blue-500" />
              </div>
              <Badge className="absolute top-1 right-1 bg-blue-600">
                Uploaded
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Divider */}
      <div className="flex items-center gap-2">
        <div className="flex-1 border-t border-slate-600"></div>
        <span className="text-slate-400 text-xs">or choose from gallery</span>
        <div className="flex-1 border-t border-slate-600"></div>
      </div>
      
      {/* Gallery Images */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {PLACEHOLDER_IMAGES.map((image, index) => (
          <Card
            key={index}
            className={`cursor-pointer transition-all duration-200 border-2 ${
              selectedImage === image.url && !localImage
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-slate-600 hover:border-slate-500'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => !disabled && !localImage && onImageSelect(image.url)}
            onMouseEnter={() => setHoveredImage(image.url)}
            onMouseLeave={() => setHoveredImage(null)}
          >
            <CardContent className="p-2">
              <div className="relative aspect-video">
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover rounded"
                />
                {selectedImage === image.url && !localImage && (
                  <div className="absolute inset-0 bg-blue-500/20 rounded flex items-center justify-center">
                    <Check className="h-6 w-6 text-blue-500" />
                  </div>
                )}
                {hoveredImage === image.url && selectedImage !== image.url && !localImage && (
                  <div className="absolute inset-0 bg-slate-900/50 rounded flex items-center justify-center">
                    <span className="text-white text-xs">Select</span>
                  </div>
                )}
                <Badge
                  variant="secondary"
                  className="absolute top-1 right-1 text-xs"
                >
                  {image.category}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {selectedImage && !localImage && (
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Check className="h-4 w-4 text-green-500" />
          Gallery image selected
        </div>
      )}
    </div>
  );
};
