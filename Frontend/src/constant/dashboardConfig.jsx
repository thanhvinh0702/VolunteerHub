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
      endpoint: "/api/v1/users/users/me",
    },
    {
      label: "Events Completed",
      value: "18",
      icon: <FiCheckCircle className="text-green-500" />,
      endpoint: "/api/v1/users/users/me/events-completed",
    },
    {
      label: "Badges Earned",
      value: "3",
      icon: <FiAward className="text-yellow-400" />,
      endpoint: "/api/v1/users/users/me/badges-earned",
    },
    {
      label: "This Month",
      value: "12hrs",
      icon: <FiTrendingUp className="text-purple-500" />,
      endpoint: "/api/v1/users/users/me/this-month",
    },
  ],

  MANAGER: [
    {
      label: "Total Events",
      value: "0",
      icon: <FiCalendar className="text-blue-500" />,
      useAnalytics: "totalEvents", // Sử dụng hook useTotalEvents
    },
    {
      label: "Active Events",
      value: "0",
      icon: <FiCheckCircle className="text-green-500" />,
      useAnalytics: "totalActiveEvents", // Sử dụng hook useTotalActiveEvents
    },
    {
      label: "Inactive Events",
      value: "0",
      icon: <FiClock className="text-orange-500" />,
      useAnalytics: "inactiveEvents", // Calculated: Total - Active
    },
    {
      label: "Total Volunteers",
      value: "0",
      icon: <FiUsers className="text-purple-500" />,
      useAnalytics: "totalVolunteers", // Calculated: Total Events × 4
    },
  ],

  ADMIN: [
    {
      label: "Total Users",
      value: "0",
      icon: <FiUsers className="text-blue-500" />,
      useAnalytics: "totalUsers", // API: /api/v1/analytics/total-users
    },
    {
      label: "Total Managers",
      value: "0",
      icon: <FiAward className="text-green-500" />,
      useAnalytics: "totalManagers", // API: /api/v1/analytics/total-managers
    },
    {
      label: "Total Events",
      value: "0",
      icon: <FiCalendar className="text-purple-500" />,
      useAnalytics: "eventStatsCount", // API: /api/v1/analytics/total_events
    },
    {
      label: "Events Count",
      value: "0",
      growth: "+12%", // Hardcoded growth percentage
      icon: <FiTrendingUp className="text-orange-500" />,
      useAnalytics: "eventStatsCount", // API: /api/v1/events/stats/count
    },
  ],
};
