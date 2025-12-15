import { useState, useEffect } from "react";

// Importing all hero-home images
import HeroHome from "../assets/hero-home.svg";
import HeroHome1 from "../assets/hero-home-1.svg";
import HeroHome2 from "../assets/hero-home-2.svg";
import HeroHome3 from "../assets/hero-home-3.svg";
import HeroHome4 from "../assets/hero-home-4.svg";
import HeroHome5 from "../assets/hero-home-5.svg";
import HeroHome6 from "../assets/hero-home-6.svg";
import HeroHome7 from "../assets/hero-home-7.svg";
import HeroHome8 from "../assets/hero-home-8.svg";
import HeroHome9 from "../assets/hero-home-9.svg";
import HeroHome10 from "../assets/hero-home-10.svg";

const allImages = [
  // HeroHome,
  HeroHome1,
  HeroHome2,
  HeroHome3,
  HeroHome4,
  HeroHome5,
  HeroHome6,
  HeroHome7,
  HeroHome8,
  HeroHome9,
  HeroHome10,
];

export const HeroGrid = () => {
  // Initialize grid with first 9 images (or random selection)
  const [gridImages, setGridImages] = useState<string[]>([]);
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);

  useEffect(() => {
    // Initial random shuffle to fill 3x3 grid (9 items)
    const shuffled = [...allImages].sort(() => 0.5 - Math.random());
    setGridImages(shuffled.slice(0, 9));
  }, []);

  useEffect(() => {
    if (gridImages.length === 0) return;

    const intervalId = setInterval(() => {
      // Pick a random grid slot index (0-8)
      const indexToChange = Math.floor(Math.random() * 9);
      
      // Pick a random image from the pool that isn't currently displayed (optional optimization, but simple random is fine for now)
      // Actually let's try to pick one that is NOT in the current grid if possible, or just random from allImages
      const currentImage = gridImages[indexToChange];
      let newImage = allImages[Math.floor(Math.random() * allImages.length)];
      
      // Simple loop to avoid immediate duplicate if possible (not strictly necessary but nicer)
      while (newImage === currentImage) {
        newImage = allImages[Math.floor(Math.random() * allImages.length)];
      }

      // Trigger animation state
      setAnimatingIndex(indexToChange);

      // Wait for fade out, then swap image, then fade in?
      // Or just swap and let CSS transition opacity
      
      // Let's rely on a key change or CSS class
      setTimeout(() => {
        setGridImages((prev) => {
          const newGrid = [...prev];
          newGrid[indexToChange] = newImage;
          return newGrid;
        });
        // Reset animation index shortly after to allow fade in
        // setTimeout(() => setAnimatingIndex(null), 500); 
      }, 300); // Wait 300ms (fade out time) before changing source

       // Reset animation state after full transition
       setTimeout(() => {
        setAnimatingIndex(null);
       }, 700); // 300ms fadeOut + slight delay + 300ms fadeIn

    }, 2500); // Change every 2.5 seconds

    return () => clearInterval(intervalId);
  }, [gridImages]);

  if (gridImages.length === 0) return null;

  return (
    <div className="grid grid-cols-3 gap-4 w-full h-full max-w-[500px] max-h-[500px]">
      {gridImages.map((src, idx) => (
        <div 
          key={idx} 
          className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-sm border border-black/5"
        >
          <img
            src={src}
            alt={`Hero Grid ${idx}`}
            className={`w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
              animatingIndex === idx ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
          />
        </div>
      ))}
    </div>
  );
};
