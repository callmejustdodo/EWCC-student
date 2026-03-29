"use client";

import { useState } from "react";

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="aspect-square overflow-hidden rounded-lg bg-muted">
        <div className="flex h-full items-center justify-center text-muted-foreground">
          <span className="text-7xl">👓</span>
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`aspect-square w-16 overflow-hidden rounded-md bg-muted transition-all ${
                selectedIndex === index
                  ? "ring-2 ring-foreground"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                {index + 1}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
