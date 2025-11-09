import React from "react";
import Card from "../Card.jsx/Card";
function CompleteCard({
  title,
  organization,
  date,
  hours,
  statusApply = "pending apply",
}) {
  const statusBg = () => {
    if (statusApply.toLowerCase() === "pending apply") return "bg-gray-200";
    else if (statusApply.toLowerCase() == "approved") return "bg-green-500/50";
    else return "bg-white";
  };
  /* chưa hoàn thiện tính sau các trạng thái be trả về */
  return (
    <Card>
      <div className="flex flex-row justify-between px-3 py-1 max-sm:px-0 max-sm:py-0">
        <div className="flex flex-col gap-1">
          <div className="font-semibold text-[18px]">{title}</div>
          <div className="max-sm:text-sm">
            <div className="text-gray-600">{organization}</div>
            <div className="text-gray-600">{date}</div>
            <div className="text-gray-600">{hours}</div>
          </div>
        </div>
        <div className="flex self-center flex-col gap-3 items-center">
          <div>
            <button className={`px-2 py-1 rounded-xl ${statusBg()}`}>
              {statusApply}
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default CompleteCard;
