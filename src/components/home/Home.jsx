import React from "react";
import NavBar from "./Navbar/Navbar";
import homeImage from "../../images/home.jpg";
import HomeContainer from "./HomeContainer";
import Food from "../../images/food3.png";
import { FaMapMarkerAlt } from "react-icons/fa";

const Home = () => {
  return (
    <div>
      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${homeImage})` }}
      >
        <NavBar />
        <div className="flex justify-between px-20">
          <div className="flex flex-col justify-center items-start ml-20 text-black text-6xl font-bold">
            <h1>Enjoy Our</h1>
            <h1>Delicious Meals</h1>
            <p className="text-lg text-gray-600 mt-4">Search restaurants</p>
            
            {/* Smaller Search Restaurant Component */}
            <div className="flex items-center bg-white rounded-full shadow-md mt-4 p-1 w-96">
              <div className="flex items-center px-2">
                <FaMapMarkerAlt className="text-orange-500 text-sm" />
              </div>
              <input
                type="text"
                placeholder="Drop Your Location"
                className="flex-1 px-2 py-1 text-sm outline-none"
              />
              <button className="bg-orange-500 text-white px-4 py-1 text-sm rounded-full font-semibold hover:bg-orange-600">
                Find Restaurants
              </button>
            </div>
          </div>
          <img src={Food} alt="Food" className="w-[400px] object-cover mt-16" />
        </div>
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-b from-transparent to-white"></div>
      </div>
      <div>
        <HomeContainer />
      </div>
    </div>
  );
};

export default Home;