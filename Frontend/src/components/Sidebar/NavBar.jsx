import { BellDot, User } from "lucide-react";
import React from "react";
import { useAuth } from "../../hook/useAuth";

import { ROLES } from "../../constant/role";
import { Navigate, useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();
  const normalizeRole = (role) => {
    if (role === ROLES.ADMIN) return "Admin";
    if (role === ROLES.ORG) return "Manager";
    if (role === ROLES.USER) return "User";
  };
  const { user } = useAuth();
  return (
    <div className="flex flex-row items-center justify-between w-full">
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="logo" className="w-6 h-6" />
        <span className="font-semibold font-lobster">VolunteerHub</span>
      </div>

      <ul className="hidden md:flex items-center gap-8 text-md  text-gray-700">
        <li
          onClick={() => navigate("/opportunities")}
          className="cursor-pointer hover:underline hover:decoration-blue-500 decoration-1 underline-offset-4"
        >
          Opportunities
        </li>
        <li
          onClick={() => navigate("/messages")}
          className="cursor-pointer hover:underline hover:decoration-blue-500 decoration-1 underline-offset-4"
        >
          Messages
        </li>
        <li
          onClick={() => navigate("/leaderboard")}
          className="cursor-pointer hover:underline hover:decoration-blue-500 decoration-1 underline-offset-4"
        >
          Leaderboard
        </li>
      </ul>

      <div className="flex items-center gap-8">
        <BellDot />
        <div className="flex flex-row items-center gap-3">
          <div className="bg-red-400 flex items-center flex-col rounded-full w-10 h-10 justify-center">
            <img
              src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${user?.name}`}
              alt="avatar"
              className="w-6 h-6 object-container"
            />
          </div>
          <div className="flex flex-col">
            <span>{user?.name}</span>
            <span className="text-gray-700 text-sm">
              {normalizeRole(user.role)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
