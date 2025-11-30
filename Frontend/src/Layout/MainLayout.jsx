import React, { useEffect } from "react";
import NavBar from "../components/Sidebar/NavBar";
import { Outlet } from "react-router-dom";
import BottomNav from "../components/Sidebar/BottomNav";
import { useNavbar } from "../hook/useNavbar";
import { useAuth } from "../hook/useAuth";
import { LOGIN_LINK } from "../constant/constNavigate";

export default function MainLayout() {
  const { showNavbar } = useNavbar();
  const { user } = useAuth();

  console.log("==== MainLayout Check ====");
  console.log("MainLayout user:", user);

  useEffect(() => {
    if (!user) {
      console.log("MainLayout: No user found, redirecting to LOGIN_LINK");
      window.location.href = LOGIN_LINK;
    }
  }, [user]);

  if (!user) {
    // Chờ redirect, không render gì cả
    console.log("MainLayout: No user, returning null and waiting for redirect");
    return null;
  }
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden">
      {/* Navbar fixed (desktop / tablet) */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <NavBar />
        </div>
      </header>

      {/* Nội dung chính */}
      <main className="flex-1 pt-20 px-4 sm:px-6 lg:px-8 pb-20">
        {/* thêm pb-20 để tránh bị che bởi BottomNav */}
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation (mobile only) */}
      {showNavbar && <BottomNav />}
    </div>
  );
}
