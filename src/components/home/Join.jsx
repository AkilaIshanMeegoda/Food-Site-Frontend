import React from "react";
import { useNavigate } from "react-router-dom";
import { Store, Truck } from "lucide-react";
import Navbar from "./Navbar/Navbar";

const Join = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-[#FDE1D3] to-[#F97316]">
        {/* Restaurant Side */}
        <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-white/70 to-[#FDE1D3]/80 backdrop-blur-xl">
          <div className="w-full max-w-md flex flex-col items-center bg-white/80 rounded-3xl shadow-2xl px-8 py-16 glass-morphism animate-fade-in">
            <Store size={56} className="mb-4 text-orange-400 drop-shadow-xl" />
            <h2 className="text-3xl md:text-4xl font-bold text-[#222] mb-3 text-center">
              Own a Restaurant?
            </h2>
            <p className="text-gray-700 text-lg text-center mb-8">
              Grow your business with Epic Eats and reach more hungry customers
              every day!
            </p>
            <button
              className="bg-gradient-to-r from-orange-400 to-pink-400 text-white px-8 py-3 rounded-lg shadow-lg font-semibold text-xl hover:scale-105 transition-transform duration-200 hover:shadow-2xl"
              onClick={() => navigate("/restaurant-signup")}
            >
              Register as Restaurant
            </button>
          </div>
        </div>
        {/* Divider (only on large screens) */}
        <div className="hidden md:flex items-center justify-center w-8">
          <div className="w-0.5 h-52 bg-gradient-to-b from-orange-300 via-white to-teal-400 opacity-70 rounded-full" />
        </div>
        {/* Driver Side */}
        <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-[#F9FAFB]/90 to-[#FDE1D3]/70 backdrop-blur-xl">
          <div className="w-full max-w-md flex flex-col items-center bg-white/80 rounded-3xl shadow-2xl px-8 py-16 glass-morphism animate-fade-in">
            <Truck size={56} className="mb-4 text-teal-500 drop-shadow-xl" />
            <h2 className="text-3xl md:text-4xl font-bold text-[#222] mb-3 text-center">
              Want to Deliver Food?
            </h2>
            <p className="text-gray-700 text-lg text-center mb-8">
              Set your own hours, earn great money, and become an Epic Eats
              delivery hero!
            </p>
            <button
              className="bg-gradient-to-r from-teal-400 to-blue-400 text-white px-8 py-3 rounded-lg shadow-lg font-semibold text-xl hover:scale-105 transition-transform duration-200 hover:shadow-2xl"
              onClick={() => navigate("/driver-register")}
            >
              Register as Driver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Join;
