import { FaFacebookF, FaTwitter, FaInstagram, FaStore } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="px-4 py-8 text-white bg-gray-900 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center">
              <FaStore className="text-2xl sm:text-3xl text-main-color" />
              <h2 className="ml-2 text-xl sm:text-2xl font-bold text-white">
                Epic<span className="text-orange-500">Eats</span>
              </h2>
            </div>
            <p className="text-sm sm:text-base text-gray-400">
              Our app brings you the best local restaurants, fresh ingredients,
              and mouth-watering recipes, all at your fingertips. Enjoy fast
              delivery, easy ordering, and a seamless food experience, anytime,
              anywhere.
            </p>
            <div className="flex space-x-4">
              <FaFacebookF className="w-5 h-5 text-gray-400 transition-colors duration-300 cursor-pointer hover:text-white" />
              <FaTwitter className="w-5 h-5 text-gray-400 transition-colors duration-300 cursor-pointer hover:text-white" />
              <FaInstagram className="w-5 h-5 text-gray-400 transition-colors duration-300 cursor-pointer hover:text-white" />
            </div>
          </div>

          {/* Other Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Other Links</h3>
            <ul className="space-y-2 text-sm sm:text-base text-gray-400">
              <li className="cursor-pointer transition-colors duration-300 hover:text-white">Home</li>
              <li className="cursor-pointer transition-colors duration-300 hover:text-white">About Us</li>
              <li className="cursor-pointer transition-colors duration-300 hover:text-white">Services</li>
              <li className="cursor-pointer transition-colors duration-300 hover:text-white">Menu</li>
              <li className="cursor-pointer transition-colors duration-300 hover:text-white">Blog</li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact Us</h3>
            <ul className="space-y-2 text-sm sm:text-base text-gray-400">
              <li>203, Alvis road, Colombo 03.</li>
              <li>070 165 0323</li>
              <li>034 223 0061</li>
              <li>services@epiceats.com</li>
              <li>info@epiceats.com</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 text-sm text-center text-gray-400 border-t border-gray-700">
          Copyright &copy; 2025 <span className="text-orange-500">EpicEats</span>.
          All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;