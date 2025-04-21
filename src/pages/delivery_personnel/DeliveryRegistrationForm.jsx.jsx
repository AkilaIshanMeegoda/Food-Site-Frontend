import React, { useState } from "react";
import axios from "axios";
import {
  FaUser,
  FaPhone,
  FaTruck,
  FaMapMarkerAlt,
  FaIdCard,
} from "react-icons/fa";
import { Footer, Navbar } from "flowbite-react";
import homeImage from "../../images/home.jpg";
import { useNavigate } from "react-router-dom"; // import this
import { ToastContainer, toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 

const DeliveryRegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    vehicleType: "",
    vehicleNumber: "",
    currentLocation: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5003/delivery-personnel/register",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      toast.success(response.data.message || "Registered successfully!"); 

      //redirect after short delay or immediately
      setTimeout(() => {
        navigate("/delivery/dashboard/my-deliveries");
      }, 1500); // optional delay so user can see the success message
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed"); 
    }
  };

  const fields = [
    { name: "name", placeholder: "Full Name", icon: <FaUser /> },
    { name: "phone", placeholder: "Phone Number", icon: <FaPhone /> },
    { name: "vehicleType", placeholder: "Vehicle Type", icon: <FaTruck /> },
    {
      name: "vehicleNumber",
      placeholder: "Vehicle Number",
      icon: <FaIdCard />,
    },
    {
      name: "currentLocation",
      placeholder: "Current Location",
      icon: <FaMapMarkerAlt />,
    },
  ];

  return (
    <div>
      <div
        className="min-h-screen bg-cover bg-center relative"
        style={{ backgroundImage: `url(${homeImage})` }}
      >
        <Navbar />
        <div className="flex justify-center items-center min-h-screen bg-black/40 px-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white bg-opacity-95 p-10 rounded-3xl shadow-xl w-full max-w-lg"
          >
            <h2 className="text-3xl font-bold text-center text-orange-500 mb-8">
              Register as a Delivery Driver
            </h2>

            {fields.map((field) => (
              <div
                key={field.name}
                className="flex items-center bg-gray-100 p-3 rounded-full mb-4 shadow-sm"
              >
                <div className="text-orange-500 mr-3">{field.icon}</div>
                <input
                  type="text"
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                  className="bg-transparent flex-1 outline-none text-sm text-gray-700"
                />
              </div>
            ))}

            <button
              type="submit"
              className="w-full bg-orange-500 text-white font-semibold py-2 rounded-full hover:bg-orange-600 transition duration-200"
            >
              Register
            </button>

            {message && (
              <p className="text-center mt-4 text-sm text-red-600">{message}</p>
            )}
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DeliveryRegistrationForm;
