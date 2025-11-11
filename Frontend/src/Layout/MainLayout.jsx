import React from "react";
import NavBar from "../components/Sidebar/NavBar";
import { Outlet } from "react-router-dom";
import BottomNav from "../components/Sidebar/BottomNav";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar fixed (desktop / tablet) */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <NavBar />
        </div>
      </header>

      {/* Nội dung chính */}
      <main className="flex-1 pt-20 px-4 sm:px-6 lg:px-8 pb-20 overflow-auto">
        {/* thêm pb-20 để tránh bị che bởi BottomNav */}
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation (mobile only) */}
      <BottomNav />
    </div>
  );
}
