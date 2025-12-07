import React, { useState } from "react";
import { FiCalendar } from "react-icons/fi";
import Card from "../Card.jsx/Card";
import { FaLocationPin } from "react-icons/fa6";
import { formatDateTime } from "../../utils/date";

function EventOverview({ description, location, startTime, endTime }) {
  const [showMore, setShowMore] = useState(true);
  const toggleShowMore = () => setShowMore(!showMore);

  return (
    <div className="p-4 flex gap-4 flex-col">
      {/* Make cards equal height */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        <Card className="h-full">
          <div className="flex items-start gap-3 h-full flex-col justify-between">
            <div className="flex items-start gap-3">
              <FiCalendar className="text-blue-500 text-2xl flex-shrink-0" />
              <div className="flex flex-col">
                <p className="text-sm text-gray-600">Start Time</p>
                <p className="font-semibold">
                  {startTime ? formatDateTime(startTime) : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="h-full">
          <div className="flex items-start gap-3 h-full flex-col justify-between">
            <div className="flex items-start gap-3">
              <FiCalendar className="text-red-500 text-2xl flex-shrink-0" />
              <div className="flex flex-col">
                <p className="text-sm text-gray-600">End Time</p>
                <p className="font-semibold">
                  {endTime ? formatDateTime(endTime) : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="h-full">
          <div className="flex items-start gap-3 h-full flex-col justify-between">
            <div className="flex items-start gap-3">
              <FaLocationPin className="text-yellow-400 text-2xl flex-shrink-0" />
              <div className="flex flex-col">
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-semibold text-sm break-words">
                  {location || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-5 border border-gray-300 p-4 rounded-2xl duration-300">
        <p className={`whitespace-pre-line ${showMore ? "line-clamp-10" : ""}`}>
          {description || "No description available"}
        </p>
        <span onClick={toggleShowMore} className="text-blue-500 cursor-pointer">
          {showMore ? "Show more ↓" : "Show less ↑"}
        </span>
      </div>
      {/* <div>
        <Card>
          <div className="flex flex-col gap-5 max-sm:gap-2">
            <div>
              <p className="font-semibold">Other Volunteer</p>
              <p className="text-gray-600 text-sm">
                See who else is participating
              </p>
            </div>
            <div className="flex flex-col gap-1 md:gap-4">
              {dumpData.slice(0, 5).map((item) => (
                <UserCard key={item.id} {...item} />
              ))}
            </div>
            <p className="font-light text-xs mt-2">More volunteers</p>
          </div>
        </Card>
      </div> */}
    </div>
  );
}

export default EventOverview;
