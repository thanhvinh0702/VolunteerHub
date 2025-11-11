import React from "react";
import Card from "../Card.jsx/Card";
import { formatDateTime } from "../../utils/date";
import { BsFillPeopleFill } from "react-icons/bs";
function RegistrationCard({
  id,
  duration,
  minAge,
  registrationDeadline,
  registrationStatus,
  durationCancel,
  onAction,
  registedVolunteer = 10,
  totalSpots = 10,
}) {
  console.log(
    duration,
    minAge,
    registrationDeadline,
    registrationStatus,
    durationCancel
  );
  const width = (registedVolunteer / totalSpots) * 100;
  console.log(width);
  const active =
    registedVolunteer == totalSpots
      ? "bg-gray-500/80 cursor-not-allowed"
      : "bg-red-500/80 cursor-pointer";
  return (
    <Card>
      <div className="flex flex-col text-sm/6 text-black gap-1">
        <div className="flex gap-1 flex-col">
          <p>Register for Event</p>
          <div className="flex flex-row items-center gap-5">
            <div className="bg-gray-600/20 h-2 w-full relative rounded-full">
              <div
                className="bg-red-400 h-2 absolute top-0 left-0 rounded-full transition-all duration-300"
                style={{ width: `${width}%` }}
              ></div>
            </div>
            <p className="inline-flex items-center text-sm text-center gap-1">
              <span>
                <BsFillPeopleFill />
              </span>
              <span className="text-gray-600">
                {registedVolunteer}/{totalSpots}
              </span>
            </p>
          </div>
        </div>
        <div className="flex flex-row justify-between">
          <p>Duration:</p>
          <p>{duration}</p>
        </div>
        <div className="flex flex-row justify-between">
          <p>Min age:</p>
          <p>{minAge}</p>
        </div>
        <div className="flex flex-row justify-between">
          <p>Deadline:</p>
          <p className="max-md:hidden">
            {formatDateTime(registrationDeadline)}
          </p>
          <p className="max-md:block hidden">
            {formatDateTime(registrationDeadline, { withTime: false })}
          </p>
        </div>
        <div className="text-gray-600 text-sm/3">
          Cancellations must be made at least {durationCancel} hours in advance.
        </div>
        <div
          className={`border-none rounded-xl md:mt-8 text-white px-4 mt-1 py-1 text-center font-lobster tracking-widest hover:scale-105 transition-all duration-300 ease-in-out active:scale-95 ${active}`}
        >
          <button onClick={onAction}>Join</button>
        </div>
      </div>
    </Card>
  );
}

export default RegistrationCard;
