import { BellDot } from "lucide-react";
import React from "react";
import { useAuth } from "../../hook/useAuth";
import { ROLES } from "../../constant/role";
import { useNavigate } from "react-router-dom";
import { Logo } from "../../assets/img/index";
import DropDown from "../Dropdown/DropDown";
import DropDownItem from "../Dropdown/DropDownItem";
export default function NavBar() {
  const navigate = useNavigate();
  const normalizeRole = (role) => {
    if (role === ROLES.ADMIN) return "Admin";
    if (role === ROLES.ORG) return "Manager";
    if (role === ROLES.USER) return "User";
  };
  const { user } = useAuth();
  return (
    <div className="flex flex-row items-center-safe justify-between w-full">
      <div className="flex items-center gap-0 w-8 relative flex-row">
        <img src={Logo} alt="logo" className="max-h-max" />
        <span className="font-semibold font-lobster text-2xl max-sm:text-xl">
          VolunteerHub
        </span>
      </div>

      <ul className="hidden md:flex items-center gap-8 text-lg  text-gray-700">
        <li
          onClick={() => navigate("/home")}
          className="cursor-pointer hover:underline hover:decoration-blue-500 decoration-1 underline-offset-4"
        >
          DashBoard
        </li>
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
        <DropDown
          trigger={
            <div className="flex flex-row items-center gap-3">
              <div className="bg-red-400 flex items-center flex-col rounded-full w-10 h-10 justify-center">
                <img
                  src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${user?.name}`}
                  alt="avatar"
                  className="w-6 h-6 object-container"
                />
              </div>
              <div className="flex flex-col text-left">
                <span>{user?.name}</span>
                <span className="text-gray-700 text-sm">
                  {normalizeRole(user.role)}
                </span>
              </div>
            </div>
          }
        >
          <DropDownItem className="cursor-pointer">
            <span onClick={() => navigate("/setting")}>Setting</span>
          </DropDownItem>
          <DropDownItem className="cursor-pointer">
            <span>Logout</span>
          </DropDownItem>
        </DropDown>
      </div>
    </div>
  );
}
