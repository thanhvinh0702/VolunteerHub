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

  const classStatus =
    status.toLowerCase() == "confirmed" || status.toLowerCase() == "verify"
      ? "text-white bg-black"
      : "text-black bg-gray-200";
  return (
    <div>
      <Card>
        <div className="flex justify-between relative">
          <div className="text-md max-sm:text-sm flex flex-col gap-1 pl-5">
            <p className="font-medium mb-2 inline-flex items-center relative">
              {/* Ping indicator */}
              <span className="absolute -left-5 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75 animate-ping"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
              </span>

              {/* Title text */}
              <span className="ml-1">{title}</span>
            </p>

            <p>{subtile}</p>

            <div className="flex flex-row gap-5 max-sm:block text-gray-600">
              <div className="flex flex-1 gap-1 align-middle items-center-safes">
                <span>
                  <FiCalendar />
                </span>
                <span>{dateNorm}</span>
              </div>
              <div className="flex flex-1 flex-row gap-5 items-center-safe">
                <p className="inline-flex items-center gap-1 whitespace-nowrap">
                  <span>
                    <FiClock />
                  </span>
                  <span>{startNormClean}</span> <span> - </span>{" "}
                  <span>{endNormClean}</span>
                </p>
              </div>
            </div>
            <div className="flex flex-1 gap-1 items-center-safe text-gray-600">
              <span>
                <TfiLocationPin />
              </span>
              <span>{location}</span>
            </div>
            <div
              className={`${classStatus} min-w-max max-w-[50px] rounded-full px-2 py-1 mt-1 ring-gray-200 ring-1 max-sm:py-0`}
            >
              <p>{status}</p>
            </div>
          </div>

          <div className="flex self-center rounded-xl w-32 max-md:w-28 max-sm:max-w-25 max-sm:max-h-25 bg-red-300">
            <img
              src={urlImg}
              className="object-cover w-full h-full object-center aspect-square rounded-2xl"
            ></img>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default UpComingCard;
