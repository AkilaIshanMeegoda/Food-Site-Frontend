import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";
import { toast } from "react-toastify";

const DeliveryDashboardLayout = () => {
  const { logout } = useLogout();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.info("Logout successfully!", {
      position: "bottom-right",
      theme: "colored",
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-4 lg:px-20 py-4 bg-gradient-to-br from-[#FEC6A1] to-[#FDE1D3] shadow z-50">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Welcome Back, <span className="text-[#F97316]">Driver!</span>
        </h1>
        <button
          onClick={handleLogout}
          className="text-sm sm:text-base bg-[#F97316] hover:bg-orange-600 text-white px-6 py-2 rounded-full transition-all"
        >
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default DeliveryDashboardLayout;
