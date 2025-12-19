import React, { useState } from "react";
import { FiChevronDown, FiCheck } from "react-icons/fi";
import useClickOutside from "../../hook/ClickOutside";

export default function DropdownSelect({
  value,
  onChange,
  options = [],
  className = "",
  placeholder = "Select...",
}) {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));

  const selected = options.find((opt) => opt.value === value);

  return (
    <div
      ref={ref}
      className={`relative inline-block ${className} max-sm:text-sm min-w-[160px] max-sm:min-w-[90px]`}
    >
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center w-full rounded-2xl border border-gray-300 bg-gray-100 px-3 py-2 max-sm:py-1 text-gray-800 hover:bg-gray-200 focus:outline-none"
      >
        <span>{selected ? selected.label : placeholder}</span>
        <FiChevronDown
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul className="absolute left-0 mt-2 w-full bg-white rounded-2xl shadow-lg ring-1 ring-black/5 overflow-hidden z-50">
          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`flex justify-between items-center px-4 py-2  text-gray-800 hover:bg-gray-100 cursor-pointer ${
                opt.value === value ? "bg-gray-100 text-blue-600" : ""
              }`}
            >
              <span>{opt.label}</span>
              {opt.value === value && <FiCheck className="w-4 h-4" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
