import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Search, Upload } from 'lucide-react';

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
}

// Sample stock images organized by category
const stockImages: StockImagesCategory = {
  Featured: [
    { id: 1, url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30', label: 'Conference' },
    { id: 2, url: 'https://images.unsplash.com/photo-1511578314322-379afb476865', label: 'Meetup' },
    { id: 3, url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678', label: 'Workshop' },
    { id: 4, url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87', label: 'Party' },
  ],
  'Previous Events': [
    { id: 5, url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2', label: 'Growth' },
    { id: 6, url: 'https://images.unsplash.com/photo-1559223607-48c720c67e0b', label: 'Success' },
  ],
  Thanksgiving: [
    { id: 7, url: 'https://images.unsplash.com/photo-1574672280600-4accfa5b6f98', label: 'Autumn' },
    { id: 8, url: 'https://images.unsplash.com/photo-1606503153255-59d3a14d8f8d', label: 'Harvest' },
  ],
  Tech: [
    { id: 9, url: 'https://images.unsplash.com/photo-1518770660439-4636190af475', label: 'Technology' },
    { id: 10, url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b', label: 'Code' },
    { id: 11, url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c', label: 'Innovation' },
  ],
  Business: [
    { id: 12, url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40', label: 'Business' },
    { id: 13, url: 'https://images.unsplash.com/photo-1497366216548-37526070297c', label: 'Office' },
  ],
  Party: [
    { id: 14, url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d', label: 'Celebration' },
    { id: 15, url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3', label: 'Birthday' },
  ],
  Christmas: [
    { id: 16, url: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543', label: 'Christmas' },
    { id: 17, url: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be', label: 'Winter' },
  ],
};

// Image Upload Modal Component
const ImageUploadModal: React.FC<ImageUploadModalProps> = ({ isOpen, onClose, onImageSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Featured');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const categories = Object.keys(stockImages);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
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
      console.error('Failed to create preview URL', err);
    }
  };

  const handleStockImageSelect = (imageUrl: string) => {
    onImageSelect(imageUrl);
    onClose();
  };

  const filteredCategories = searchQuery
    ? categories.filter(cat =>
        cat.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stockImages[cat].some(img =>
          img.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : categories;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Choose Image</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close image picker"
          >
            <X size={24} />
          </button>
        </div>

        {/* Upload Area */}
        <div className="p-6 border-b border-gray-200">
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
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
            <Upload className="mx-auto mb-3 text-gray-400" size={32} />
            <p className="text-gray-700 font-medium mb-1">
              Drag & drop or click here to upload.
            </p>
            <p className="text-sm text-gray-500">
              Or choose an image below. The ideal aspect ratio is 1:1.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for more photos"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-48 border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              {filteredCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors mb-1 ${
                    selectedCategory === category
                      ? 'bg-gray-100 text-gray-900 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Image Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {selectedCategory}
              </h3>
              <p className="text-sm text-gray-500">
                {stockImages[selectedCategory]?.length || 0} Images
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {stockImages[selectedCategory]?.map((image) => (
                <button
                  key={image.id}
                  onClick={() => handleStockImageSelect(image.url)}
                  className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 hover:ring-2 hover:ring-blue-500 transition-all"
                >
                  <img
                    src={image.url}
                    alt={image.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-end p-3">
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
  className = ''
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Keep track of any blob: URL we created so we can revoke it later
  const lastBlobUrlRef = useRef<string | null>(null);

  const handleImageSelect = (imageUrl: string) => {
    // Revoke previous blob URL if any
    if (lastBlobUrlRef.current && lastBlobUrlRef.current.startsWith('blob:')) {
      URL.revokeObjectURL(lastBlobUrlRef.current);
    }
    if (imageUrl.startsWith('blob:')) {
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
      if (lastBlobUrlRef.current && lastBlobUrlRef.current.startsWith('blob:')) {
        URL.revokeObjectURL(lastBlobUrlRef.current);
      }
    };
  }, []);

  return (
    <>
      <div
        className={`rounded-2xl bg-white h-[340px] w-full shadow-sm relative cursor-pointer overflow-hidden group ${className}`}
        onClick={() => setIsModalOpen(true)}
        aria-label="Open image picker"
      >
        {selectedImage ? (
          <>
            <img
              src={selectedImage}
              alt="Event cover"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              onLoad={() => console.log('Image loaded successfully:', selectedImage)}
              onError={(e) => console.error('Image failed to load:', selectedImage, e)}
            />
            {/* Hover overlay - only visible on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center pointer-events-none">
              <div className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-2">
                <Upload size={20} />
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
        <span className="absolute bottom-4 right-4 bg-[#0A143A] rounded-full p-2 ring-1 ring-white/10 z-10">
          ⚙️
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">Another Event</h2>
          <ImageUploadCard
            selectedImage={null}
            onImageChange={(img) => console.log('Second card image:', img)}
          />
        </div>
      </div>
    </div>
  );
}
