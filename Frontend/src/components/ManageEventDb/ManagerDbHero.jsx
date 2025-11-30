import { CircleCheckBig, ClockFading } from "lucide-react";
import React from "react";

function ManagerDbHero({
  thumbnail,
  title,
  subtitle,
  date,
  status = "pending",
}) {
  const icon =
    status === "pending" ? (
      <ClockFading className="w-full h-full" />
    ) : (
      <CircleCheckBig />
    );
  const color =
    status === "pending"
      ? "text-yellow-500 bg-yellow-500/20"
      : "text-green-600 bg-green-500/20 ";
  return (
    <div className="p-4 flex flex-col w-full shadow-2xl rounded-2xl">
      <div className="w-full aspect-[16/5] max-h-[380px] md:max-h-[280px] overflow-hidden rounded-xl bg-gray-100 mb-4">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover object-top"
        />
      </div>
      <div className="flex flex-row max-lg:flex-col items-start max-sm:gap-2 max-sm:text-sm justify-between">
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <div
            className={`text-2xl font-bold flex gap-2 items-center flex-wrap`}
          >
            <p className="text-xl max-md:text-[1rem] break-all line-clamp-2 min-w-0">
              {title}
            </p>

            <div
              className={`${color} flex items-center gap-3 rounded-2xl py-1 px-2 self-start  flex-shrink-0`}
            >
              <span className="w-4">{icon}</span>
              <span className="text-sm">
                {status === "pending" ? "Pending" : "Approved"}
              </span>
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-sm break-all">{subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagerDbHero;
