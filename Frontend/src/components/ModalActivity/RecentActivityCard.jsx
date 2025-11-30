import React from "react";
import Card from "../Card.jsx/Card";
import { FiCalendar, FiClock } from "react-icons/fi";
import { ClockArrowDown, Verified, CircleCheckBig } from "lucide-react";

function RecentActivityCard({
  id,
  title,
  date,
  duration,
  status,

  icon,
}) {
  const statusIcon =
    status.toLowerCase() === "pending" ? (
      <ClockArrowDown className="text-yellow-400 size-5" />
    ) : (
      <CircleCheckBig className="text-green-500 size-5" />
    );
  const colorStatus =
    status.toLowerCase() === "pending"
      ? "bg-gray-200 text-black"
      : "bg-gray-900 text-white";
  return (
    <div className="text-gray-600 max-md:text-sm">
      <Card>
        <div className="flex flex-col justify-between relative px-4 py-0 gap-1 max-sm:gap-2">
          <div className="text-black font-semibold">{title}</div>
          <div className="flex flex-row gap-5">
            <p className="inline-flex gap-1 mb-1">
              <span className="text-gray-600 items-center-safe flex">
                <FiCalendar size={16} />
              </span>
              {date}
            </p>
            <p className="flex flex-row gap-1">
              <span className="text-gray-600 items-center-safe flex">
                <FiClock />
              </span>
              <span>{duration}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <span
              className={`${colorStatus} px-2 py-1 rounded-full max-sm:py-0`}
            >
              {status}
            </span>
            <span className="flex flex-col justify-center">{statusIcon}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default RecentActivityCard;
