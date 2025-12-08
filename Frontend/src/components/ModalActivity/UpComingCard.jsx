import React from "react";
import Card from "../Card.jsx/Card";
import { formatDateTime } from "../../utils/date";
import { FiCalendar } from "react-icons/fi";
import { FiClock } from "react-icons/fi";
import { TfiLocationPin } from "react-icons/tfi";
function UpComingCard({
  title,
  subtile,
  date,
  starttime,
  endtime,
  location,
  status,
  urlImg = "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=200&fit=crop",
}) {
  const dateNorm = formatDateTime(date, {
    separator: "-",
    customFormat: "DD{sep}MM{sep}YYYY",
  });
  const startNorm = formatDateTime(starttime, {
    customFormat: "hh:mm A",
    use12Hour: true,
  });
  const endNorm = formatDateTime(endtime, {
    customFormat: "hh:mm A",
    use12Hour: true,
  });
  const startNormClean = startNorm.replace(/\s+/g, " ");
  const endNormClean = endNorm.replace(/\s+/g, " ");

  // Status color mapping for better visual cues
  const statusKey = String(status || "").toUpperCase();
  const statusClassMap = {
    APPROVED: "bg-green-600 text-white",
    PENDING: "bg-yellow-100 text-yellow-800",
    REJECTED: "bg-red-100 text-red-800",
    COMPLETED: "bg-blue-600 text-white",
    CONFIRMED: "bg-gray-900 text-white",
    VERIFY: "bg-gray-900 text-white",
    DEFAULT: "bg-gray-200 text-gray-800",
  };
  const statusClass = statusClassMap[statusKey] || statusClassMap.DEFAULT;

  return (
    <div>
      <Card>
        <div className="flex justify-between relative">
          <div className="text-md max-sm:text-sm flex flex-col gap-2 pl-5">
            <p className="font-semibold mb-1 inline-flex items-center relative text-black">
              {/* Ping indicator */}
              <span className="absolute -left-5 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75 animate-ping"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
              </span>
              {/* Title text */}
              <span className="ml-1 text-lg">{title}</span>
            </p>

            {/* Category / subtitle pill */}
            <p className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium bg-gray-900 text-white rounded-full max-w-[30%] truncate text-center">
              {subtile}
            </p>

            <div className="flex flex-row gap-5 max-sm:block text-gray-600">
              <div className="flex flex-1 gap-1 items-center">
                <span>
                  <FiCalendar />
                </span>
                <span>{dateNorm}</span>
              </div>
              <div className="flex flex-1 flex-row gap-5 items-center">
                <p className="inline-flex items-center gap-1 whitespace-nowrap">
                  <span>
                    <FiClock />
                  </span>
                  <span>{startNormClean}</span> <span> - </span>{" "}
                  <span>{endNormClean}</span>
                </p>
              </div>
            </div>
            <div className="flex flex-1 gap-1 items-center text-gray-600">
              <span>
                <TfiLocationPin />
              </span>
              <span>{location}</span>
            </div>
            <div
              className={`${statusClass} min-w-max max-w-[80px] rounded-full px-2 py-1 mt-1 ring-1 ring-gray-200 text-xs font-medium text-center`}
            >
              <p className="truncate">{status}</p>
            </div>
          </div>

          <div className="flex self-center rounded-xl w-32 max-md:w-28 overflow-hidden ring-1 ring-gray-200 shadow-sm">
            <img
              src={urlImg}
              alt={title}
              className="object-cover w-full h-full object-center aspect-square rounded-2xl transition-transform duration-200 hover:scale-[1.02]"
            ></img>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default UpComingCard;
