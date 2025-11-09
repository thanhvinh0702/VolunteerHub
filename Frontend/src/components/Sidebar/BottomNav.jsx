// src/components/BottomNav/BottomNav.jsx
import React from "react";
import {
  Home,
  MessageSquare,
  Trophy,
  User,
  Plus,
  LayoutDashboard,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hook/useAuth";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { key: "opps", label: "Opportunities", icon: Home, to: "/opportunities" },
    {
      key: "DashBoard",
      label: "DashBoard",
      icon: LayoutDashboard,
      to: "/home",
    },
    {
      key: "messages",
      label: "Messages",
      icon: MessageSquare,
      to: "/messages",
    },
    {
      key: "leaderboard",
      label: "Leaderboard",
      icon: Trophy,
      to: "/leaderboard",
    },
    { key: "profile", label: "Profile", icon: User, to: "/profile" },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
      <div className="max-w-3xl mx-auto flex justify-between items-center px-3 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => navigate(item.to)}
              className={`flex flex-col items-center text-xs focus:outline-none ${
                isActive(item.to) ? "text-blue-600" : "text-gray-600"
              }`}
            >
              <div className="relative">
                <Icon className="w-6 h-6" />

                {item.key === "messages" && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] rounded-full px-1">
                    {/* Replace with real unread count */}3
                  </span>
                )}
              </div>
              <span className="mt-1">{item.label}</span>
            </button>
          );
        })}

        {/* Floating action button (center overlay) */}
        {user && (user.role === "ORG" || user.role === "ADMIN") && (
          <button
            onClick={() => navigate("/events/create")}
            className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
            aria-label="Create"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>
    </nav>
  );
}
