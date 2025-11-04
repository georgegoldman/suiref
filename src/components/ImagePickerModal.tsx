import React, { useState, useRef } from "react";
import {
  PRESET_IMAGES,
  CATEGORIES,
  type PresetImage,
  type PresetCategory,
} from "../lib/eventThemes";

interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (image: PresetImage | File) => void;
}

export default function ImagePickerModal({
  isOpen,
  onClose,
  onSelectImage,
}: ImagePickerModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<
    PresetCategory | "featured"
  >("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Filter images based on category and search
  const filteredImages = PRESET_IMAGES.filter((img) => {
    const matchesCategory = img.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      img.keywords.some((k) =>
        k.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith("image/")) {
      onSelectImage(file);
      onClose();
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#1a1a1a] rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-white/10 p-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Choose Image</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-2xl leading-none w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex h-[calc(85vh-80px)]">
          {/* Sidebar - Categories */}
          <div className="w-48 border-r border-white/10 p-4 overflow-y-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`
                  w-full text-left px-3 py-2 rounded-lg text-sm mb-1
                  transition-colors
                  ${
                    selectedCategory === cat.id
                      ? "bg-white/10 text-white"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col">
            {/* Upload area */}
            <div className="p-6 border-b border-white/10">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
                  transition-colors
                  ${
                    dragOver
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-white/20 hover:border-white/40 hover:bg-white/5"
                  }
                `}
              >
                <p className="text-white/80 font-medium">
                  Drag & drop or click here to upload
                </p>
                <p className="text-white/50 text-sm mt-1">
                  Or choose an image below. The ideal aspect ratio is 1:1.
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
              />
            </div>

            {/* Search */}
            <div className="p-4 border-b border-white/10">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for more photos"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 pl-10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Image grid */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-3 gap-3">
                {filteredImages.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => {
                      onSelectImage(img);
                      onClose();
                    }}
                    className="aspect-square rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all"
                  >
                    <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-4xl">
                      {/* Placeholder - in real app, use <img src={img.url} /> */}
                      🖼️
                    </div>
                  </button>
                ))}
              </div>

              {filteredImages.length === 0 && (
                <div className="text-center py-12 text-white/40">
                  No images found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
