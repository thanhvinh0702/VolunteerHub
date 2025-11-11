import React, { useEffect } from "react";

export default function Modal({ open, onClose, children, className = "" }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 flex justify-center items-center bg-black/50 z-50 p-4"
      aria-modal="true"
      role="dialog"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 transform transition-all duration-200 ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
