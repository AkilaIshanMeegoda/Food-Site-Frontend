import React from "react";
import NavBar from "./Navbar/Navbar";
import homeImage from "../../images/home.jpg";
import HomeContainer from "./HomeContainer";
import Food from "../../images/food3.png";
import { FaMapMarkerAlt } from "react-icons/fa";
import FoodCategory from "./FoodCategory";
import Footer from "./Footer";
import FoodDescription from "./Navbar/FoodDescription";
import OrderSteps from "./OrderSteps";

const Home = () => {
  return (
    <div className="relative min-h-screen">
      <div 
        className="relative min-h-screen bg-center bg-no-repeat bg-cover"
        style={{ 
          backgroundImage: `url(${homeImage})`,
          boxShadow: 'inset 0 -100px 100px -50px rgba(255,255,255,0.8)' 
        }}
      >
        <NavBar />
        
        {/* Main Content Section */}
        <div className="container px-4 mx-auto lg:px-20">
          <div className="flex flex-col items-center lg:flex-row lg:justify-between lg:items-center pt-8 lg:pt-0">
            {/* Text Content */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left mb-8 lg:mb-0">
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-black space-y-2">
                <h1>Enjoy Our</h1>
                <h1>Delicious Meals</h1>
              </div>
              <p className="mt-4 text-base md:text-lg text-gray-600">Search restaurants</p>
              
              {/* Search Component */}
              <div className="flex items-center p-2 mt-4 bg-white rounded-full shadow-md w-full max-w-[24rem]">
                <div className="flex items-center px-2">
                  <FaMapMarkerAlt className="text-orange-500" />
                </div>
                <input
                  type="text"
                  placeholder="Enter restaurant name"
                  className="flex-1 px-2 py-1 text-sm outline-none w-full"
                />
                <button className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 rounded-full hover:bg-orange-600 transition-colors">
                  Find Restaurants
                </button>
              </div>
            </div>

            {/* Food Image */}
            <div className="w-full max-w-[300px] lg:max-w-[400px] mx-auto lg:mx-0">
              <img 
                src={Food} 
                alt="Food" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-b from-transparent to-white"></div>
      </div>

      {/* Additional Content */}
      <div className="w-full">
        <HomeContainer />
        <OrderSteps/>
        <FoodCategory />
        <FoodDescription />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
