import React from "react";
import { formatDateTime } from "../../utils/date";

function UserCard({ name, createAt, avatarUrl }) {
  return (
    <div className="flex flex-row items-center gap-2">
      <div className="rounded-full">
        <img
          src={avatarUrl}
          alt={name}
          className="w-10 h-10 rounded-full bg-red-400 object-cover ring-1 ring-red-950"
        />
      </div>
      <div className="text-gray-600 text-sm">
        <p>{name}</p>
        <p>{formatDateTime(createAt, { isTimeOnly: true })}</p>
      </div>
    </div>
  );
}

export default UserCard;
