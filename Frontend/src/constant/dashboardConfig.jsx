// src/config/dashboardConfig.js
import {
  FiClock,
  FiCheckCircle,
  FiAward,
  FiTrendingUp,
  FiUsers,
  FiCalendar,
} from "react-icons/fi";

export const dashboardConfig = {
  USER: [
    {
      label: "Total Hours",
      value: "124",
      icon: <FiClock className="text-blue-500" />,
    },
    {
      label: "Events Completed",
      value: "18",
      icon: <FiCheckCircle className="text-green-500" />,
    },
    {
      label: "Badges Earned",
      value: "3",
      icon: <FiAward className="text-yellow-400" />,
    },
    {
      label: "This Month",
      value: "12hrs",
      icon: <FiTrendingUp className="text-purple-500" />,
    },
  ],

  ORGANIZATION: [
    {
      label: "Total Events",
      value: "3",
      icon: <FiCalendar className="text-blue-500" />,
    },
    {
      label: "Active Events",
      value: "1",
      icon: <FiCheckCircle className="text-green-500" />,
    },
    {
      label: "Total Volunteers",
      value: "17",
      icon: <FiUsers className="text-purple-500" />,
    },
    {
      label: "Pending Applications",
      value: "2",
      icon: <FiClock className="text-yellow-400" />,
    },
  ],

  ADMIN: [
    {
      label: "Total Users",
      value: "256",
      icon: <FiUsers className="text-blue-500" />,
    },
    {
      label: "Active Organizations",
      value: "12",
      icon: <FiAward className="text-green-500" />,
    },
    {
      label: "Active Events",
      value: "5",
      icon: <FiTrendingUp className="text-purple-500" />,
    },
    {
      label: "Active Events",
      value: "5",
      icon: <FiTrendingUp className="text-purple-500" />,
    },
  ],
};
