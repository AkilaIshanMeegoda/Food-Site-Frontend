import { FaFacebookF, FaTwitter, FaInstagram, FaStore } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="px-6 py-10 text-white bg-gray-900">
      <div className="flex flex-row">
        {/* Logo & Description */}
        <div className="ml-20 w-96">
          <div className="flex items-center">
            <FaStore className="text-3xl text-main-color" />
            <h2 className="ml-2 text-2xl font-bold text-white">
              Epic<span className="text-orange-500">Eats</span>
            </h2>
          </div>
          <p className="mt-4 text-justify text-gray-400">
            Our app brings you the best local restaurants, fresh ingredients,
            and mouth-watering recipes, all at your fingertips. Enjoy fast
            delivery, easy ordering, and a seamless food experience, anytime,
            anywhere.
          </p>
          <div className="flex mt-4 space-x-4">
            <FaFacebookF className="text-gray-400 cursor-pointer hover:text-white" />
            <FaTwitter className="text-gray-400 cursor-pointer hover:text-white" />
            <FaInstagram className="text-gray-400 cursor-pointer hover:text-white" />
          </div>
        </div>

        {/* Other Links */}
        <div className="ml-60 w-96">
          <h3 className="mb-4 text-lg font-semibold text-white">Other Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="cursor-pointer hover:text-white">Home</li>
            <li className="cursor-pointer hover:text-white">About Us</li>
            <li className="cursor-pointer hover:text-white">Services</li>
            <li className="cursor-pointer hover:text-white">Menu</li>
            <li className="cursor-pointer hover:text-white">Blog</li>
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">Contact Us</h3>
          <ul className="space-y-2 text-gray-400">
            <li>203, Alvis road, Colombo 03.</li>
            <li>070 165 0323</li>
            <li>034 223 0061</li>
            <li>services@epiceats.com</li>
            <li>info@epiceats.com</li>
          </ul>
        </div>
      </div>

      <div className="pt-4 mt-10 text-center text-gray-500 border-t border-gray-700">
        Copyright &copy; 2025 <span className="text-orange-500">EpicEats</span>.
        All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;