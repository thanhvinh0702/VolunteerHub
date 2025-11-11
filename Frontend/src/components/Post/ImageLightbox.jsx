import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Modal from "./Modal";
export default function ImageLightbox({
  images = [],
  open,
  startIndex = 0,
  onClose,
}) {
  const [index, setIndex] = useState(startIndex);

  useEffect(() => setIndex(startIndex), [startIndex, open]);

  useEffect(() => {
    const handler = (e) => {
      if (!open) return;
      if (e.key === "ArrowLeft")
        setIndex((i) => (i - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, images.length]);

  if (!open || images.length === 0) return null;

  return (
    <Modal open={open} onClose={onClose} className="bg-transparent p-0">
      <div className="relative bg-black/90 rounded-md flex items-center justify-center max-h-[90vh]">
        <button
          onClick={() =>
            setIndex((i) => (i - 1 + images.length) % images.length)
          }
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <img
          src={images[index]}
          alt=""
          className="max-h-[85vh] object-contain"
        />

        <button
          onClick={() => setIndex((i) => (i + 1) % images.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white text-sm">
          {index + 1} / {images.length}
        </div>
      </div>
    </Modal>
  );
}
