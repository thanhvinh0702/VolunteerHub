import Card from "../Card.jsx/Card";
import React from "react";

function AppliedCard({ title, organization, date, location, status, notes }) {
  const statusBg = () => {
    if (status.toLowerCase() === "pending") return "bg-gray-200";
    else if (status.toLowerCase() == "approved") return "bg-green-500/50";
    else return "bg-white";
  };
  return (
    <div>
      <Card>
        <div className="flex flex-row justify-between px-3 py-1">
          <div>
            <div className="font-semibold text-[18px]">{title}</div>
            <div className="text-gray-600">{organization}</div>
            <div className="text-gray-600">{date}</div>
          </div>
          <div
            className={`flex self-center ${statusBg()} px-2 py-1 rounded-full border-1 border-gray-600/20 max-md:py-0`}
          >
            <div>{status}</div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default AppliedCard;
