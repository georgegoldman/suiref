import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Search, Upload, Image as ImageIcon } from "lucide-react";

// Types
interface StockImage {
  id: number;
  url: string;
  label: string;
}
interface StockImagesCategory {
  [category: string]: StockImage[];
}
interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect: (imageUrl: string) => void;
}
interface ImageUploadCardProps {
  selectedImage: string | null;
  onImageChange: (imageUrl: string) => void;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode; // Support custom preview rendering
}

// Sample stock images organized by category
const stockImages: StockImagesCategory = {
  Featured: [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
      label: "Conference",
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1511578314322-379afb476865",
      label: "Meetup",
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678",
      label: "Workshop",
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
      label: "Party",
    },
  ],
  Thanksgiving: [
    {
      id: 7,
      url: "https://images.unsplash.com/photo-1574672280600-4accfa5b6f98",
      label: "Autumn",
    },
    {
      id: 8,
      url: "https://images.unsplash.com/photo-1606503153255-59d3a14d8f8d",
      label: "Harvest",
    },
    {
      id: 9,
      url: "https://images.unsplash.com/photo-1541876176131-c401e9c0d724",
      label: "Fall",
    },
    {
      id: 10,
      url: "https://images.unsplash.com/photo-1601000938365-f182c6d3a88e",
      label: "Pumpkin",
    },
  ],
  "Indian Fest": [
    {
      id: 11,
      url: "https://images.unsplash.com/photo-1604608672516-f1b9b1a0b51d",
      label: "Holi",
    },
    {
      id: 12,
      url: "https://images.unsplash.com/photo-1609783661807-5103f88a3f71",
      label: "Diwali",
    },
    {
      id: 13,
      url: "https://images.unsplash.com/photo-1524338198850-8a2ff63aaceb",
      label: "Festival",
    },
  ],
  Christmas: [
    {
      id: 16,
      url: "https://images.unsplash.com/photo-1512389142860-9c449e58a543",
      label: "Christmas",
    },
    {
      id: 17,
      url: "https://images.unsplash.com/photo-1482517967863-00e15c9b44be",
      label: "Winter",
    },
    {
      id: 18,
      url: "https://images.unsplash.com/photo-1512909006721-3d6018887383",
      label: "Ornaments",
    },
  ],
  "New Year": [
    {
      id: 19,
      url: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9",
      label: "Fireworks",
    },
    {
      id: 20,
      url: "https://images.unsplash.com/photo-1514362453360-8f94243c9996",
      label: "Celebration",
    },
    {
      id: 21,
      url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b",
      label: "Champagne",
    },
  ],
  Tech: [
    {
      id: 22,
      url: "https://images.unsplash.com/photo-1518770660439-4636190af475",
      label: "Technology",
    },
    {
      id: 23,
      url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
      label: "Code",
    },
    {
      id: 24,
      url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
      label: "Innovation",
    },
    {
      id: 25,
      url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
      label: "AI",
    },
  ],
  Business: [
    {
      id: 26,
      url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
      label: "Business",
    },
    {
      id: 27,
      url: "https://images.unsplash.com/photo-1497366216548-37526070297c",
      label: "Office",
    },
    {
      id: 28,
      url: "https://images.unsplash.com/photo-1557804506-669a67965ba0",
      label: "Team",
    },
  ],
  Party: [
    {
      id: 29,
      url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d",
      label: "Celebration",
    },
    {
      id: 30,
      url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3",
      label: "Birthday",
    },
    {
      id: 31,
      url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
      label: "Event",
    },
  ],
  Crypto: [
    {
      id: 32,
      url: "https://images.unsplash.com/photo-1621761191319-c6fb62004040",
      label: "Bitcoin",
    },
    {
      id: 33,
      url: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0",
      label: "Blockchain",
    },
    {
      id: 34,
      url: "https://images.unsplash.com/photo-1605792657660-596af9009e82",
      label: "Crypto",
    },
  ],
  Abstract: [
    {
      id: 35,
      url: "https://images.unsplash.com/photo-1557672172-298e090bd0f1",
      label: "Abstract 1",
    },
    {
      id: 36,
      url: "https://images.unsplash.com/photo-1557264337-e8a93017fe92",
      label: "Abstract 2",
    },
    {
      id: 37,
      url: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d",
      label: "Colorful",
    },
  ],
  Food: [
    {
      id: 38,
      url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
      label: "Cuisine",
    },
    {
      id: 39,
      url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
      label: "Burger",
    },
    {
      id: 40,
      url: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327",
      label: "Salad",
    },
  ],
  Drinks: [
    {
      id: 41,
      url: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b",
      label: "Cocktail",
    },
    {
      id: 42,
      url: "https://images.unsplash.com/photo-1544145945-f90425340c7e",
      label: "Coffee",
    },
    {
      id: 43,
      url: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04",
      label: "Smoothie",
    },
  ],
  Wedding: [
    {
      id: 44,
      url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed",
      label: "Ceremony",
    },
    {
      id: 45,
      url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc",
      label: "Reception",
    },
    {
      id: 46,
      url: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8",
      label: "Flowers",
    },
  ],
  Outdoors: [
    {
      id: 47,
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
      label: "Mountains",
    },
    {
      id: 48,
      url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
      label: "Forest",
    },
    {
      id: 49,
      url: "https://images.unsplash.com/photo-1502082553048-f009c37129b9",
      label: "Beach",
    },
  ],
  Pride: [
    {
      id: 50,
      url: "https://images.unsplash.com/photo-1560859251-d3b8c4f4e0b5",
      label: "Rainbow",
    },
    {
      id: 51,
      url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
      label: "Pride Flag",
    },
    {
      id: 52,
      url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36",
      label: "Celebration",
    },
  ],
};

// Image Upload Modal Component
const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  isOpen,
  onClose,
  onImageSelect,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Featured");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const categories = Object.keys(stockImages);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // 🚀 Use a blob URL for preview. This avoids giant base64 strings and odd overlay issues.
  const handleFile = (file: File) => {
    try {
      const objectUrl = URL.createObjectURL(file);
      onImageSelect(objectUrl);
      onClose();
    } catch (err) {
      console.error("Failed to create preview URL", err);
    }
  };

  const handleStockImageSelect = (imageUrl: string) => {
    onImageSelect(imageUrl);
    onClose();
  };

  const filteredCategories = searchQuery
    ? categories.filter(
        (cat) =>
          cat.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stockImages[cat].some((img) =>
            img.label.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    : categories;

  return createPortal(
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-[#1a1d29] rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">Choose Image</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
            aria-label="Close image picker"
          >
            <X size={24} />
          </button>
        </div>

        {/* Upload Area */}
        <div className="p-6 border-b border-white/10">
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
              dragActive
                ? "border-blue-500 bg-blue-500/10"
                : "border-white/20 hover:border-white/30 bg-white/5"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
            <Upload className="mx-auto mb-3 text-white/60" size={32} />
            <p className="text-white font-medium mb-1">
              Drag & drop or click here to upload.
            </p>
            <p className="text-sm text-white/60">
              Or choose an image below. The ideal aspect ratio is 1:1.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-4 border-b border-white/10">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
              size={20}
            />
            <input
              type="text"
              placeholder="Search for more photos"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder:text-white/40"
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-48 border-r border-white/10 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            <div className="p-4">
              {filteredCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors mb-1 ${
                    selectedCategory === category
                      ? "bg-white/10 text-white font-medium"
                      : "text-white/60 hover:bg-white/5 hover:text-white/80"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Image Grid */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-1">
                {selectedCategory}
              </h3>
              <p className="text-sm text-white/60">
                {stockImages[selectedCategory]?.length || 0} Images
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {stockImages[selectedCategory]?.map((image) => (
                <button
                  key={image.id}
                  onClick={() => handleStockImageSelect(image.url)}
                  className="group relative aspect-square rounded-xl overflow-hidden bg-white/5 hover:ring-2 hover:ring-blue-500 transition-all"
                >
                  <img
                    src={image.url}
                    alt={image.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-end p-3">
                    <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      {image.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

// Main Image Card Component
export const ImageUploadCard: React.FC<ImageUploadCardProps> = ({
  selectedImage,
  onImageChange,
  className = "",
  onClick,
  children,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Keep track of any blob: URL we created so we can revoke it later
  const lastBlobUrlRef = useRef<string | null>(null);

  const handleImageSelect = (imageUrl: string) => {
    // Revoke previous blob URL if any
    if (lastBlobUrlRef.current && lastBlobUrlRef.current.startsWith("blob:")) {
      URL.revokeObjectURL(lastBlobUrlRef.current);
    }
    if (imageUrl.startsWith("blob:")) {
      lastBlobUrlRef.current = imageUrl;
    } else {
      lastBlobUrlRef.current = null;
    }

    onImageChange(imageUrl);
    setIsModalOpen(false);
  };

  // Revoke on unmount
  useEffect(() => {
    return () => {
      if (
        lastBlobUrlRef.current &&
        lastBlobUrlRef.current.startsWith("blob:")
      ) {
        URL.revokeObjectURL(lastBlobUrlRef.current);
      }
    };
  }, []);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setIsModalOpen(true);
    }
  };

  // If children provided, render custom preview
  if (children) {
    return (
      <>
        <div onClick={handleClick} className="cursor-pointer">
          {children}
        </div>

        {/* Modal */}
        <ImageUploadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onImageSelect={handleImageSelect}
        />
      </>
    );
  }

  // Default rendering
  return (
    <>
      <div
        className={`rounded-2xl bg-white h-[340px] w-full shadow-sm relative cursor-pointer overflow-hidden group ${className}`}
        onClick={handleClick}
        aria-label="Open image picker"
      >
        {selectedImage ? (
          <>
            <img
              src={selectedImage}
              alt="Event cover"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              onLoad={() =>
                console.log("Image loaded successfully:", selectedImage)
              }
              onError={(e) =>
                console.error("Image failed to load:", selectedImage, e)
              }
            />
            {/* Hover overlay - only visible on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center pointer-events-none">
              <div className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-2">
                <ImageIcon size={20} />
                <span>Click to change image</span>
              </div>
            </div>
          </>
        ) : (
          /* Empty state when no image is selected */
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 group-hover:text-gray-500 transition-colors">
            <Upload size={48} className="mb-3" />
            <p className="text-lg font-medium">Add event image</p>
            <p className="text-sm mt-1">Click to choose or upload</p>
          </div>
        )}

        {/* Settings button - always visible */}
        <span className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-sm rounded-full p-2 ring-1 ring-white/20 z-10">
          <ImageIcon size={20} color="white" strokeWidth={2.5} />
        </span>
      </div>

      {/* Modal */}
      <ImageUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onImageSelect={handleImageSelect}
      />
    </>
  );
};

// Demo/Example Usage
export default function App() {
  const [eventImage, setEventImage] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Event Image</h1>

        {/* Use the ImageUploadCard component */}
        <ImageUploadCard
          selectedImage={eventImage}
          onImageChange={setEventImage}
        />

        {/* You can add multiple cards */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Another Event
          </h2>
          <ImageUploadCard
            selectedImage={null}
            onImageChange={(img) => console.log("Second card image:", img)}
          />
        </div>
      </div>
    </div>
  );
}
