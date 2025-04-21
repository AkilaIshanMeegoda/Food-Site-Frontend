import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaInfoCircle,
  FaPhone,
  FaSignInAlt,
  FaSignOutAlt,
  FaListAlt,
  FaStore,
  FaPlusCircle,
  FaEdit,
  FaClipboardList,
  FaUserPlus,
  FaCartPlus,
} from "react-icons/fa";
import { HiMenuAlt3 } from "react-icons/hi";
import { useLogout } from "../../../hooks/useLogout";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const navigate = useNavigate();
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const showSuccess = () => {
    toast.info("Logout successfully!", {
      position: "bottom-right",
      theme: "colored",
    });
  };

  const handleLogout = () => {
    logout();
    showSuccess();
    navigate("/");
  };

  const toggleMenu = () => {
    setMobileMenu(!mobileMenu);
  };

  // Common links for non-admin users
  // Render common links for guests and when user role is "customer"
  const commonLinks = (!user || user?.role === "customer") && (
    <>
      <Link
        to="/"
        className="flex items-center space-x-1 transition-transform hover:scale-110"
      >
        <FaHome /> <span>Home</span>
      </Link>
      <Link
        to="/about"
        className="flex items-center space-x-1 transition-transform hover:scale-110"
      >
        <FaInfoCircle /> <span>About</span>
      </Link>
      <Link
        to="/contact"
        className="flex items-center space-x-1 transition-transform hover:scale-110"
      >
        <FaPhone /> <span>Contact</span>
      </Link>
      <Link
        to="/menuItems"
        className="flex items-center space-x-1 transition-transform hover:scale-110"
      >
        <FaListAlt /> <span>Menu</span>
      </Link>
      <Link
        to="/order"
        className="flex items-center space-x-1 transition-transform hover:scale-110"
      >
        <FaCartPlus /> <span>Orders</span>
      </Link>
      <Link
        to="/restaurants"
        className="flex items-center space-x-1 transition-transform hover:scale-110"
      >
        <FaStore /> <span>Restaurants</span>
      </Link>
      {/* Additional "Become a Member" tab for customers */}
      {user?.role === "customer" && (
        <Link
          to="/restaurant-signup"
          className="flex items-center space-x-1 transition-transform hover:scale-110"
        >
          <FaUserPlus /> <span>Become a Member</span>
        </Link>

        
      )}
      {/* Additional "Become Delivery Personnel" tab for customers */}
      {user?.role === "customer" && (
        <Link
          to="/driver-register"
          className="flex items-center space-x-1 transition-transform hover:scale-110"
        >
          <FaUserPlus /> <span>Become a Driver</span>
        </Link>

        
      )}
    </>
  );

  // Admin specific links (only shown if user is restaurant_admin)
  const adminLinks = user?.role === "restaurant_admin" && (
    <>
      <Link
        to="/restaurant_admin/dashboard/add-item"
        className="flex items-center space-x-1 transition-transform hover:scale-110"
      >
        <FaPlusCircle /> <span>Add Items</span>
      </Link>
      <Link
        to="/restaurant_admin/dashboard/manage-items"
        className="flex items-center space-x-1 transition-transform hover:scale-110"
      >
        <FaEdit /> <span>Manage Items</span>
      </Link>
      <Link
        to="/restaurant_admin/dashboard/manage-orders"
        className="flex items-center space-x-1 transition-transform hover:scale-110"
      >
        <FaClipboardList /> <span>Manage Orders</span>
      </Link>
    </>
  );

  // Auth links (login/logout)
  const authLink = user ? (
    <button
      onClick={handleLogout}
      className="flex items-center space-x-1 transition-transform hover:scale-110"
    >
      <FaSignOutAlt /> <span>Logout</span>
    </button>
  ) : (
    <Link
      to="/login"
      className="flex items-center space-x-1 transition-transform hover:scale-110"
    >
      <FaSignInAlt /> <span>Login</span>
    </Link>
  );

  return (
    <nav>
      <div className="flex items-center justify-between max-w-screen-xl px-4 py-4 mx-auto text-md">
        <div className="flex items-center space-x-2">
          <FaStore className="text-3xl text-main-color" />
          <span className="text-4xl font-bold text-black">Epic</span>
          <span className="text-4xl font-bold text-main-color">Eats</span>
        </div>

        <div className="hidden ml-10 space-x-6 font-medium text-black md:flex">
          {user?.role === "restaurant_admin" ? adminLinks : commonLinks}
          {authLink}
        </div>

        <button className="text-2xl md:hidden" onClick={toggleMenu}>
          <HiMenuAlt3 />
        </button>
      </div>

      {mobileMenu && (
        <div className="px-4 py-2 space-y-4 text-white bg-gray-700 md:hidden">
          {user?.role === "restaurant_admin" ? adminLinks : commonLinks}
          {authLink}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
