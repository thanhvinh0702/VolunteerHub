import React, { useState } from "react";
import Card from "../Card.jsx/Card";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { LogIn, Trash } from "lucide-react";

function UpcomingCard({
  title,
  organization,
  date,
  status,
  location,
  thumbnail = "https://tse1.mm.bing.net/th/id/OIP.lTwHCqIOO3-hgviQYUXMjQHaE7?rs=1&pid=ImgDetMain&o=7&rm=3",
}) {
  const [open, setOpen] = useState(false);

  const bgColor =
    status.toLowerCase() === "confirm"
      ? "bg-black text-white"
      : "bg-white text-black";

  return (
    <Card>
      <div className="flex flex-row justify-between px-3 py-2 max-sm:flex-col max-sm:gap-2">
        {/* THUMBNAIL + TITLE */}
        <div
          className="flex flex-row flex-1 gap-3 cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <img
            src={thumbnail}
            alt={title}
            className="w-20 h-20 object-cover rounded-2xl sm:w-24 sm:h-24 flex-shrink-0"
          />
          {/* DESKTOP INFO */}
          <div className="hidden sm:flex flex-col justify-center gap-1">
            <div className="font-semibold text-[18px]">{title}</div>
            <div className="text-gray-600 text-sm">{organization}</div>
            <div className="text-gray-600 text-sm">{date}</div>
            <div className="text-gray-600 text-sm">{location}</div>
          </div>

          {/* MOBILE TITLE + CHEVRON */}
          <div className="flex flex-col justify-center sm:hidden flex-1">
            <div className="flex justify-between items-center w-full">
              <p className="font-semibold text-[16px] break-words flex-1">
                {title}
              </p>
              <span className="text-gray-500 flex-shrink-0">
                {open ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
              </span>
            </div>
          </div>
        </div>

        {/* STATUS + BUTTON */}
        <div className="flex flex-col gap-2 items-center md:self-center max-sm:flex-row max-sm:justify-around max-sm:mt-2">
          <div
            className={`px-2 py-1 rounded-full border border-gray-300 ${bgColor} text-center min-w-[80px]`}
          >
            {status}
          </div>
          <button className="bg-black text-white px-3 py-1 rounded-md flex w-[80px] flex-row gap-1 items-center hover:scale-105 active:scale-95 duration-200 transition-all">
            <span>Checkin</span> <LogIn className="w-4" />
          </button>
          <button className="bg-red-500 text-white px-3 py-1 rounded-md w-[80px] flex flex-row gap-1 items-center hover:scale-105 active:scale-95 duration-200 transition-all">
            <span>Delete</span> <Trash className="w-4" />
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN INFO */}
      {open && (
        <div className="sm:hidden px-3 pt-2 pb-3 text-gray-600 text-sm border-t border-gray-100 mt-2 space-y-1">
          <p>
            <b>Organization:</b> {organization}
          </p>
          <p>
            <b>Date:</b> {date}
          </p>
          <p>
            <b>Location:</b> {location}
          </p>
        </div>
      )}
    </Card>
  );
}

export default UpcomingCard;
