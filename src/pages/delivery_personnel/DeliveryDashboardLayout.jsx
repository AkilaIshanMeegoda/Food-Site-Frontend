import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { FaHome, FaTruck, FaUser } from "react-icons/fa";
import { useLogout } from "../../hooks/useLogout";

const DeliveryDashboardLayout = () => {
  const { logout } = useLogout(); // Use the custom hook
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Topbar */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Welcome Back, Driver!
          </h1>
          <button
            onClick={logout}
            className="text-sm bg-orange-500 text-white px-4 py-1 rounded-full hover:bg-orange-600"
          >
            Logout
          </button>
        </div>

        {/* Route Outlet */}
        <Outlet />
      </div>
    </div>
  );
};

export default DeliveryDashboardLayout;
