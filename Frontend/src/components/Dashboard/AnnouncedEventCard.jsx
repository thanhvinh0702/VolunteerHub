import React from "react";
import Card from "../Card.jsx/Card";
import { formatDateTime } from "../../utils/date";
import { FiCalendar } from "react-icons/fi";
import { User, Users } from "lucide-react";
import { TfiLocationPin } from "react-icons/tfi";

function AnnouncedEventCard({
  title,
  date,
  starttime,
  endtime,
  location,
  joined = 10,
  capacity = 200,

  urlImg = "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=200&fit=crop",
}) {
  const dateNorm = formatDateTime(date, {
    separator: "-",
    customFormat: "DD{sep}MM{sep}YYYY",
  });

  return (
    <div className="bg-blue-300/20 rounded-xl">
      <Card className>
        <div className="flex justify-between relative">
          <div className="text-md max-sm:text-sm flex flex-col gap-1 pl-5">
            <p className="font-medium mb-1 inline-flex items-center relative">
              {/* Ping indicator */}
              <span className="absolute -left-8 top-0 flex text-blue-600 animate-spin">
                <span className="bg-blue-500 text-white text-xs font-medium rounded-md px-1 py-1 flex-shrink-0 max-sm:px-1 m">
                  New
                </span>
              </span>

              {/* Title text */}
              <span className="ml-1 mb-2">{title}</span>
            </p>

            <div className="flex flex-row gap-5 max-sm:block text-gray-600">
              <div className="flex flex-1 gap-1 align-middle items-center-safes">
                <span>
                  <FiCalendar />
                </span>
                <span>{dateNorm}</span>
              </div>
              <div className="flex flex-1 flex-row items-center-safe">
                <p className="inline-flex items-center gap-1 whitespace-nowrap">
                  <span className>
                    <User className="w-4 h-4" />
                  </span>
                  <span>{joined}</span> <span> / </span> <span>{capacity}</span>
                </p>
              </div>
            </div>
            <div className="flex flex-1 gap-1 items-center-safe text-gray-600">
              <span>
                <TfiLocationPin />
              </span>
              <span>{location}</span>
            </div>
          </div>

          <div className="flex self-center rounded-xl w-24 max-md:w-20 max-sm:max-w-25 max-sm:max-h-25 bg-red-300">
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

export default AnnouncedEventCard;
