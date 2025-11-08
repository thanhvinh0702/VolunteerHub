import React from "react";
import { formatDateTime } from "../../utils/date";
function ProjectCard({
  title,
  date,
  location,
  capacity,
  registered,
  availableSlots,
  category,
  imageUrl,
  ctaText,
  status,
}) {
  const getPercentage = (registered, capacity) => {
    return (registered / capacity) * 100;
  };

  return (
    <div className="bg-white text-black flex flex-col font-roboto rounded-2xl font-bold hover:shadow-slate-300 duration-300 ease-in-out border border-gray-600/20 overflow-hidden">
      <div className="block w-full aspect-[16/9] overflow-hidden rounded-t-2xl relative pt-0">
        <img
          src={imageUrl}
          className={`${
            registered === capacity ? "grayscale" : ""
          } object-cover w-full h-full hover:scale-105 transition-all duration-300 ease-in-out`}
        />
        {category && (
          <p className="absolute top-3 right-3 text-white rounded-xl px-3 py-1 text-xs bg-blue-500/80">
            {category}
          </p>
        )}
      </div>
      <div className="p-4 flex flex-col gap-2 flex-grow justify-between">
        <div className="text-xl max-sm:text-lg font-bold line-clamp-2">
          {title}
        </div>
        <div className="flex flex-row gap-2 items-center text-slate-500 ">
          <i className="ri-calendar-line"></i>
          <p className="font-normal text-sm">{formatDateTime(date)}</p>
        </div>
        <div className="flex flex-row gap-2 items-center text-slate-500">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              location
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex flex-row gap-2 items-center text-slate-500 hover:text-red-400 transition-colors"
          >
            <i class="ri-map-pin-fill"></i>
            <p className="font-normal text-sm">{location}</p>
          </a>
        </div>
        <div className="flex flex-row gap-2 items-center justify-between mb-2 text-slate-400 font-medium text-sm">
          <div className="flex flex-row gap-2 items-center justify-center">
            <i class="ri-user-3-line"></i>
            {registered}/{capacity}
          </div>
          <p>Avaiable {availableSlots}</p>
        </div>
        <div className="w-full bg-red-100 rounded-full h-3 mb-8">
          <div
            className={`${
              registered === capacity ? "bg-gray-500/80" : "bg-red-500/80"
            } h-3 rounded-full transition-all duration-300`}
            style={{
              width: `${getPercentage(registered, capacity)}%`,
            }}
          ></div>
        </div>

        <div className="w-full">
          <button
            className={`w-full ${
              registered === capacity
                ? "cursor-not-allowed bg-gray-500/80"
                : "cursor-pointer bg-red-500/80"
            } text-white rounded-xl py-2 font-bold text-sm  transition-all duration-500 ease-in-out hover:scale-105 font-lobster tracking-widest border-none active:scale-95`}
          >
            {registered === capacity ? "Full Slot" : "Join Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
