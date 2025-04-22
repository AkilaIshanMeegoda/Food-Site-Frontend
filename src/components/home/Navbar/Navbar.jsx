import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const isHomePage = location.pathname === "/";
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

  const handleClick = () => {
    if (!user) {
      navigate("/login");
    } else if (user.role === "customer") {
      navigate("/order");
    } else {
      alert("Access denied: Only customers can view orders.");
    }
  };

  const handleLogout = () => {
    logout();
    showSuccess();
    navigate("/");
  };

  const toggleMenu = () => {
    setMobileMenu(!mobileMenu);
  };

  const commonLinks = (!user || user?.role === "customer") && (
    <>
      <Link
        to="/"
        className="flex items-center gap-2 p-2  hover:scale-110 rounded-lg transition-all"
      >
        <FaHome className="text-lg " /> <span className="font-medium">Home</span>
      </Link>
      <Link
        to="/aboutus"
        className="flex items-center gap-2 p-2  hover:scale-110 rounded-lg transition-all"
      >
        <FaInfoCircle className="text-lg" /> <span className="font-medium">About</span>
      </Link>
      <Link
        to="/contactus"
        className="flex items-center gap-2 p-2  hover:scale-110 rounded-lg transition-all"
      >
        <FaPhone className="text-lg" /> <span className="font-medium">Contact</span>
      </Link>
      <Link
        to="/menuItems"
        className="flex items-center gap-2 p-2  hover:scale-110 rounded-lg transition-all"
      >
        <FaListAlt className="text-lg" /> <span className="font-medium">Menu</span>
      </Link>
      <button
        onClick={handleClick}
        className="flex items-center gap-2 p-2  hover:scale-110 rounded-lg transition-all w-full text-left"
      >
        <FaCartPlus className="text-lg" /> <span className="font-medium">Orders</span>
      </button>
      <Link
        to="/restaurants"
        className="flex items-center gap-2 p-2  hover:scale-110 rounded-lg transition-all"
      >
        <FaStore className="text-lg" /> <span className="font-medium">Restaurants</span>
      </Link>
      {user?.role === "customer" && (
        <Link
          to="/restaurant-signup"
          className="flex items-center gap-2 p-2  hover:scale-110 rounded-lg transition-all"
        >
          <FaUserPlus className="text-lg" /> <span className="font-medium">Join</span>
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
        className="flex items-center gap-2 p-2  hover:scale-110 rounded-lg transition-all"
      >
        <FaPlusCircle className="text-lg" /> <span className="font-medium">Add Items</span>
      </Link>
      <Link
        to="/restaurant_admin/dashboard/manage-items"
        className="flex items-center gap-2 p-2  hover:scale-110 rounded-lg transition-all"
      >
        <FaEdit className="text-lg" /> <span className="font-medium">Manage Items</span>
      </Link>
      <Link
        to="/restaurant_admin/dashboard/manage-orders"
        className="flex items-center gap-2 p-2  hover:scale-110 rounded-lg transition-all"
      >
        <FaClipboardList className="text-lg" /> <span className="font-medium">Manage Orders</span>
      </Link>
    </>
  );

  // Auth links (login/logout)
  const authLink = user ? (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 p-2  hover:scale-110 rounded-lg transition-all w-full text-left"
    >
      <FaSignOutAlt className="text-lg" /> <span className="font-medium">Logout</span>
    </button>
  ) : (
    <Link
      to="/login"
      className="flex items-center gap-2 p-2  hover:scale-110 rounded-lg transition-all"
    >
      <FaSignInAlt className="text-lg" /> <span className="font-medium">Login</span>
    </Link>
  );

  return (
     <nav className="relative z-50">
      <div
        className={`flex items-center justify-between px-4 lg:px-20 py-4 mx-auto w-full ${
          isHomePage ? "" : "bg-gradient-to-br from-[#FEC6A1] to-[#FDE1D3]"
        }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 z-50">
          <FaStore className="text-2xl sm:text-3xl text-[#F97316]" />
          <span className="text-2xl sm:text-3xl font-bold text-black">Epic</span>
          <span className="text-2xl sm:text-3xl font-bold text-[#F97316]">Eats</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-2">
          {user?.role === "restaurant_admin" ? adminLinks : commonLinks}
          {authLink}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden p-2  hover:scale-110 rounded-lg transition-all z-50"
          onClick={toggleMenu}
        >
          <HiMenuAlt3 className="text-2xl" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleMenu}>
          <div 
            className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex flex-col p-4 space-y-2">
              {user?.role === "restaurant_admin" ? adminLinks : commonLinks}
              {authLink}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
