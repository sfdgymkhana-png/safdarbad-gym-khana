"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { GalleryMedia } from "@/lib/types";

interface LightboxModalProps {
  image: GalleryMedia | null;
  allImages: GalleryMedia[];
  onClose: () => void;
  onSelect: (img: GalleryMedia) => void;
}

export default function LightboxModal({ image, allImages, onClose, onSelect }: LightboxModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (!image) return;
      const currentIndex = allImages.findIndex((img) => img.imageId === image.imageId);
      if (e.key === "ArrowRight") {
        const nextIndex = (currentIndex + 1) % allImages.length;
        onSelect(allImages[nextIndex]);
      }
      if (e.key === "ArrowLeft") {
        const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
        onSelect(allImages[prevIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [image, allImages, onClose, onSelect]);

  if (!image) return null;

  const currentIndex = allImages.findIndex((img) => img.imageId === image.imageId);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
    onSelect(allImages[prevIndex]);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIndex = (currentIndex + 1) % allImages.length;
    onSelect(allImages[nextIndex]);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-5 p-2.5 text-zinc-400 hover:text-white bg-[#1A1A1A] hover:bg-zinc-800 border border-zinc-700 rounded-full transition-colors z-50"
        aria-label="Close lightbox"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev button */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white bg-black/60 hover:bg-[#FF6B00] rounded-full transition-all border border-zinc-700/60 hidden sm:block z-50"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Next button */}
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white bg-black/60 hover:bg-[#FF6B00] rounded-full transition-all border border-zinc-700/60 hidden sm:block z-50"
        aria-label="Next image"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center"
      >
        <div className="relative w-full h-[60vh] sm:h-[70vh] rounded-lg overflow-hidden border border-zinc-800 shadow-2xl">
          <Image
            src={image.imageUrl}
            alt={image.caption}
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="w-full mt-4 flex items-center justify-between text-sm px-2">
          <div>
            <span className="inline-block px-2.5 py-0.5 text-xs font-semibold bg-[#FF6B00]/20 text-[#FF6B00] border border-[#FF6B00]/40 rounded mr-2">
              {image.category}
            </span>
            <span className="text-zinc-200">{image.caption}</span>
          </div>
          <span className="text-xs text-zinc-500">
            {currentIndex + 1} of {allImages.length}
          </span>
        </div>
      </div>
    </div>
  );
}
