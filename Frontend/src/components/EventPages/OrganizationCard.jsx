import React from "react";
import Card from "../Card.jsx/Card";
import { CiCircleCheck } from "react-icons/ci";
import { FaCircle, FaCircleCheck } from "react-icons/fa6";
function OrganizationCard({
  avatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=b",
  name = "demo org",
  description,
  totalEvent = 5,
  totalVolunteer = 100,
}) {
  return (
    <Card>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center gap-2">
          <img
            src={avatarUrl}
            alt={name}
            className="w-10 h-10 rounded-full bg-red-400 object-cover ring-1 ring-red-950"
          />
          <div className="font-semibold">
            <p className="inline-flex items-center gap-4">
              {name}
              <span>
                <FaCircleCheck className="text-green-500" />
              </span>
            </p>
          </div>
        </div>

        <p>{description}</p>
        <div className="flex flex-col gap-1">
          <p className="inline-flex justify-between">
            Total Event: <span>{totalEvent}</span>
          </p>
          <p className="inline-flex justify-between">
            Total Volunteer: <span>{totalVolunteer}</span>
          </p>
        </div>
      </div>
    </Card>
  );
}

export default OrganizationCard;
