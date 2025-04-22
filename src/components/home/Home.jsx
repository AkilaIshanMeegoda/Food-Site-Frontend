import React from "react";
import NavBar from "./Navbar/Navbar";
import homeImage from "../../images/home.jpg";
import HomeContainer from "./HomeContainer";
import Food from "../../images/food3.png";
import { FaMapMarkerAlt } from "react-icons/fa";
import step from "../../images/orderStep.png";
import FoodCategory from "./FoodCategory";
import Footer from "./Footer";
import FoodDescription from "./Navbar/FoodDescription";

const Home = () => {
  return (
    <div>
      <div
        className="min-h-screen bg-center bg-no-repeat bg-cover"
        style={{ backgroundImage: `url(${homeImage})` }}
      >
        <NavBar />
        <div className="flex justify-between px-20">
          <div className="flex flex-col items-start justify-center ml-20 text-6xl font-bold text-black">
            <h1>Enjoy Our</h1>
            <h1>Delicious Meals</h1>
            <p className="mt-4 text-lg text-gray-600">Search restaurants</p>
            
            {/* Smaller Search Restaurant Component */}
            <div className="flex items-center p-1 mt-4 bg-white rounded-full shadow-md w-96">
              <div className="flex items-center px-2">
                <FaMapMarkerAlt className="text-sm text-orange-500" />
              </div>
              <input
                type="text"
                placeholder="Enter restaurant name"
                className="flex-1 px-2 py-1 text-sm outline-none"
              />
              <button className="px-4 py-1 text-sm font-semibold text-white bg-orange-500 rounded-full hover:bg-orange-600">
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
        <img src={step} alt="Step" className="object-cover w-full mt-16" />
        <FoodCategory />
        <FoodDescription/>
      </div>
        <Footer />  
    </div>
  );
};

export default Home;