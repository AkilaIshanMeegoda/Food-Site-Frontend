import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaInfoCircle, FaPhone, FaSignInAlt, FaListAlt, FaStore } from "react-icons/fa";
import { HiMenuAlt3 } from "react-icons/hi";

const Navbar = () => {
  const [mobileMenu, setMobileMenu] = useState(false);

  const toggleMenu = () => {
    setMobileMenu(!mobileMenu);
  };

  return (
    <nav className="text-white bg-orange-500">
      <div className="flex items-center justify-between max-w-screen-xl px-4 py-4 mx-auto">
        <div className="flex items-center space-x-2">
          <FaStore className="text-2xl" />
          <span className="text-xl font-bold">EpicEats</span>
        </div>

        <div className="hidden ml-10 space-x-6 md:flex"> 
          <Link to="/" className="flex items-center space-x-1 hover:text-yellow-400">
            <FaHome />
            <span>Home</span>
          </Link>
          <Link to="/about" className="flex items-center space-x-1 hover:text-yellow-400">
            <FaInfoCircle />
            <span>About</span>
          </Link>
          <Link to="/contact" className="flex items-center space-x-1 hover:text-yellow-400">
            <FaPhone />
            <span>Contact</span>
          </Link>
          <Link to="/menu" className="flex items-center space-x-1 hover:text-yellow-400">
            <FaListAlt />
            <span>Menu</span>
          </Link>
          <Link to="/restaurants" className="flex items-center space-x-1 hover:text-yellow-400">
            <FaStore />
            <span>Restaurants</span>
          </Link>
          <Link to="/login" className="flex items-center space-x-1 hover:text-yellow-400">
            <FaSignInAlt />
            <span>Login</span>
          </Link>
        </div>

        <button
          className="text-2xl md:hidden"
          onClick={toggleMenu}
        >
          <HiMenuAlt3 />
        </button>
      </div>

      {mobileMenu && (
        <div className="px-4 py-2 space-y-4 text-white bg-gray-700 md:hidden">
          <Link to="/" className="flex items-center space-x-1 hover:text-yellow-400">
            <FaHome />
            <span>Home</span>
          </Link>
          <Link to="/about" className="flex items-center space-x-1 hover:text-yellow-400">
            <FaInfoCircle />
            <span>About</span>
          </Link>
          <Link to="/contact" className="flex items-center space-x-1 hover:text-yellow-400">
            <FaPhone />
            <span>Contact</span>
          </Link>
          <Link to="/menu" className="flex items-center space-x-1 hover:text-yellow-400">
            <FaListAlt />
            <span>Menu</span>
          </Link>
          <Link to="/restaurants" className="flex items-center space-x-1 hover:text-yellow-400">
            <FaStore />
            <span>Restaurants</span>
          </Link>
          <Link to="/login" className="flex items-center space-x-1 hover:text-yellow-400">
            <FaSignInAlt />
            <span>Login</span>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
