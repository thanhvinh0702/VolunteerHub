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
      className="fixed inset-0 flex justify-center items-center bg-black/50 z-50 w-full h-full"
      aria-modal="true"
      role="dialog"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-lg shadow-lg w-[95vw] h-[95vh] transform transition-all duration-200 ${className} flex justify-start`}
      >
        {children}
      </div>
    </div>
  );
}
