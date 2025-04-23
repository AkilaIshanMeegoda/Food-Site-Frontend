import React from "react";
import { useNavigate } from "react-router-dom";
import homeImage from "../../images/home.jpg";
import { Footer, Navbar } from "flowbite-react";

const Delivery_Home = () => {
  const navigate = useNavigate();



  const handleDashboard = () => {
    navigate("/delivery/dashboard/my-deliveries");
  };

  return (
    <div>
      <Navbar />
      <div
        className="min-h-screen bg-cover bg-center relative"
        style={{ backgroundImage: `url(${homeImage})` }}
      >
        <div className="flex justify-center items-center min-h-screen bg-black/40">
          <div className="bg-white bg-opacity-95 p-10 rounded-3xl shadow-xl text-center w-full max-w-xl">
            <h1 className="text-4xl font-bold text-orange-500 mb-6">
              🚀 Start Your Delivery Journey with Us!
            </h1>
            <p className="text-gray-700 mb-10 text-lg">
              Whether you're new or already delivering smiles, choose your path
              below.
            </p>

            <div className="flex flex-col gap-5">
              
              <button
                onClick={handleDashboard}
                className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 rounded-full transition duration-200"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Delivery_Home;
