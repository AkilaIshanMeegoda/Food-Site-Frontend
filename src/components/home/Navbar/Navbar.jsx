import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaInfoCircle,
  FaPhone,
  FaSignInAlt,
  FaListAlt,
  FaStore,
} from "react-icons/fa";
import { HiMenuAlt3 } from "react-icons/hi";

const Navbar = () => {
  const [mobileMenu, setMobileMenu] = useState(false);

  const toggleMenu = () => {
    setMobileMenu(!mobileMenu);
  };

  return (
    <nav>
      <div className="flex items-center justify-between max-w-screen-xl px-4 py-4 mx-auto text-md">
        <div className="flex items-center space-x-2">
          <FaStore className="text-3xl text-main-color" />
          <span className="text-4xl font-bold text-black">Epic</span><span className="text-main-color text-4xl font-bold">Eats</span>
        </div>

        <div className="hidden ml-10 space-x-6 md:flex text-black font-medium">
          <Link to="/" className="flex items-center space-x-1 transform hover:scale-110 transition-transform duration-200">
            <FaHome />
            <span>Home</span>
          </Link>
          <Link
            to="/about"
            className="flex items-center space-x-1 transform hover:scale-110 transition-transform duration-200"
          >
            <FaInfoCircle />
            <span>About</span>
          </Link>
          <Link
            to="/contact"
            className="flex items-center space-x-1 transform hover:scale-110 transition-transform duration-200"
          >
            <FaPhone />
            <span>Contact</span>
          </Link>
          <Link
            to="/menu"
            className="flex items-center space-x-1 transform hover:scale-110 transition-transform duration-200"
          >
            <FaListAlt />
            <span>Menu</span>
          </Link>
          <Link
            to="/restaurants"
            className="flex items-center space-x-1 transform hover:scale-110 transition-transform duration-200"
          >
            <FaStore />
            <span>Restaurants</span>
          </Link>
          <Link
            to="/login"
            className="flex items-center space-x-1 transform hover:scale-110 transition-transform duration-200"
          >
            <FaSignInAlt />
            <span>Login</span>
          </Link>
        </div>

        <button className="text-2xl md:hidden" onClick={toggleMenu}>
          <HiMenuAlt3 />
        </button>
      </div>

      {mobileMenu && (
        <div className="px-4 py-2 space-y-4 text-white bg-gray-700 md:hidden">
          <Link to="/" className="flex items-center space-x-1 transform hover:scale-110 transition-transform duration-200">
            <FaHome />
            <span>Home</span>
          </Link>
          <Link
            to="/about"
            className="flex items-center space-x-1 transform hover:scale-110 transition-transform duration-200"
          >
            <FaInfoCircle />
            <span>About</span>
          </Link>
          <Link
            to="/contact"
            className="flex items-center space-x-1 transform hover:scale-110 transition-transform duration-200"
          >
            <FaPhone />
            <span>Contact</span>
          </Link>
          <Link
            to="/menu"
            className="flex items-center space-x-1 transform hover:scale-110 transition-transform duration-200"
          >
            <FaListAlt />
            <span>Menu</span>
          </Link>
          <Link
            to="/restaurants"
            className="flex items-center space-x-1 transform hover:scale-110 transition-transform duration-200"
          >
            <FaStore />
            <span>Restaurants</span>
          </Link>
          <Link
            to="/login"
            className="flex items-center space-x-1 transform hover:scale-110 transition-transform duration-200"
          >
            <FaSignInAlt />
            <span>Login</span>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
