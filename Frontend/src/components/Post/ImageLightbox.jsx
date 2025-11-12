import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageLightbox({ images = [], startIndex = 0 }) {
  const [index, setIndex] = useState(startIndex);

  useEffect(() => setIndex(startIndex), [startIndex]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowLeft")
        setIndex((i) => (i - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-white">
        Không có ảnh
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center rounded-md">
      {images.length > 1 && (
        <button
          onClick={() =>
            setIndex((i) => (i - 1 + images.length) % images.length)
          }
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-1.5 md:p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors z-10"
          aria-label="Ảnh trước"
        >
          <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
        </button>
      )}

      <img
        src={images[index]}
        alt={`Ảnh ${index + 1} / ${images.length}`}
        className="max-h-[50vh] md:max-h-[85vh] max-w-full w-auto h-auto object-contain select-none"
        draggable={false}
      />

      {images.length > 1 && (
        <button
          onClick={() => setIndex((i) => (i + 1) % images.length)}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-1.5 md:p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors z-10"
          aria-label="Ảnh kế tiếp"
        >
          <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
        </button>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/60 text-white text-xs md:text-sm font-medium">
          {index + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
