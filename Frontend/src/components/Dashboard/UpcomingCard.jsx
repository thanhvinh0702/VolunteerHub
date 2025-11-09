import React from "react";
import Card from "../Card.jsx/Card";

function UpcomingCard({ title, organization, date, status, location }) {
  console.log(status);
  const bgColor =
    status.toLowerCase() === "confirm"
      ? "bg-black text-white"
      : "bg-white text-black";
  /* chưa có hàm thêm vào button nhé nếu viết thì thêm để checkout */
  return (
    <Card>
      <div className="flex flex-row justify-between px-3 py-1 max-sm:px-0 max-sm:py-0">
        <div className="flex flex-col gap-1">
          <div className="font-semibold text-[18px]">{title}</div>
          <div className="max-sm:text-sm">
            <div className="text-gray-600">{organization}</div>
            <div className="text-gray-600">{date}</div>
            <div className="text-gray-600">{location}</div>
          </div>
        </div>
        <div className="flex self-center flex-col gap-3 items-center">
          <div
            className={` px-2 py-1 rounded-full border-1 border-gray-600/20 ${bgColor} max-sm:py-0 max-sm:min-w-20 items-center`}
          >
            <div>{status}</div>
          </div>
          <div>
            <button className="bg-black text-white px-2 py-1 rounded-md">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default UpcomingCard;
