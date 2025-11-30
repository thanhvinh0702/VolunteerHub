import { FiClock, FiChevronDown, FiChevronUp } from "react-icons/fi";
import Card from "../Card.jsx/Card";
import React, { useState } from "react";

function AppliedCard({
  title,
  organization,
  date,
  location,
  status,
  notes,
  thumbnail = "https://tse1.mm.bing.net/th/id/OIP.lTwHCqIOO3-hgviQYUXMjQHaE7?rs=1&pid=ImgDetMain&o=7&rm=3",
}) {
  const [open, setOpen] = useState(false);

  const statusBg = () => {
    if (status?.toLowerCase() === "pending") return "bg-white";
    else if (status?.toLowerCase() === "approved") return "bg-green-500/50";
    else return "bg-white";
  };

  return (
    <div>
      <Card>
        <div className="flex flex-row justify-between px-3 py-2 max-sm:flex-col max-sm:gap-2">
          {/* HEADER */}
          <div
            onClick={() => setOpen(!open)}
            className="flex flex-row gap-4 w-full cursor-pointer"
          >
            <img
              src={thumbnail}
              className="w-24 h-24 object-cover rounded-xl sm:w-24 sm:h-24 flex-shrink-0"
              alt="thumbnail"
            />

            {/* DESKTOP CONTENT */}
            <div className="hidden sm:flex flex-col flex-1">
              <div className="font-semibold text-[18px]">{title}</div>
              <div className="text-gray-600">{organization}</div>
              <div className="text-gray-600 text-[15px]">{date}</div>
            </div>

            {/* MOBILE TITLE + ARROW */}
            <div className="flex flex-col flex-1 sm:hidden">
              <div className="flex justify-between items-start w-full">
                <p className="font-semibold text-[16px] leading-tight break-words pr-2 flex-1">
                  {title}
                </p>
                <span className="text-gray-500 flex-shrink-0 mt-0.5">
                  {open ? (
                    <FiChevronUp size={20} />
                  ) : (
                    <FiChevronDown size={20} />
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* STATUS */}
          <div
            className={`inline-flex items-center ${statusBg()} px-2 py-1 rounded-full border border-gray-600/20 text-[14px] sm:ml-auto max-sm:mt-1 self-start`}
          >
            <span className="text-yellow-500">
              <FiClock size={14} />
            </span>
            <span className="ml-1 font-medium">{status}</span>
          </div>
        </div>

        {/* MOBILE DROPDOWN CONTENT */}
        {open && (
          <div className="sm:hidden px-2 pt-2 pb-3 text-gray-600 text-[14px] border-t border-gray-100 mt-2 space-y-1">
            <p>
              <b>Organization:</b> {organization}
            </p>
            <p>
              <b>Date:</b> {date}
            </p>
            <p>
              <b>Location:</b> {location}
            </p>
            {notes && (
              <p>
                <b>Notes:</b> {notes}
              </p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

export default AppliedCard;
