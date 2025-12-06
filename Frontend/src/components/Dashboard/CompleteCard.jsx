import React, { useState } from "react";
import Card from "../Card.jsx/Card";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { Calendar, Clock, Building2 } from "lucide-react";

function CompleteCard({
  title,
  organization,
  date,
  hours,
  statusApply = "pending apply",
  thumbnail = "https://tse1.mm.bing.net/th/id/OIP.lTwHCqIOO3-hgviQYUXMjQHaE7?rs=1&pid=ImgDetMain&o=7&rm=3",
}) {
  const [open, setOpen] = useState(false);

  const statusBg = () => {
    if (statusApply.toLowerCase() === "pending apply")
      return "bg-gray-200 text-black";
    else if (statusApply.toLowerCase() === "approved")
      return "bg-green-500/50 text-black";
    else return "bg-white text-black";
  };

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
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Building2 size={16} className="flex-shrink-0" />
              <span>{organization}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Calendar size={16} className="flex-shrink-0" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Clock size={16} className="flex-shrink-0" />
              <span>{hours}</span>
            </div>
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

        {/* STATUS BUTTON */}
        <div className="flex flex-row gap-2 justify-around max-sm:self-start max-sm:mt-2 h-8">
          <button className={`px-3 py-1 rounded-full ${statusBg()}`}>
            <span className="max-sm:hidden">{statusApply}</span>
            <span className="sm:hidden">Pending</span>
          </button>
          <button
            className={`px-3 py-1 rounded-xl bg-gray-900 text-white cursor-pointer`}
          >
            View Certificate
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
            <b>Hours:</b> {hours}
          </p>
        </div>
      )}
    </Card>
  );
}

export default CompleteCard;
