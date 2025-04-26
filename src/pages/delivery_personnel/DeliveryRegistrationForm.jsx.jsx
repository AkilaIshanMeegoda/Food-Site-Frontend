import React, { useState } from "react";
import axios from "axios";
import {
  FaUser,
  FaPhone,
  FaTruck,
  FaMapMarkerAlt,
  FaIdCard,
  FaEnvelope 
} from "react-icons/fa";
import { Footer } from "flowbite-react";
import homeImage from "../../images/delivery.jpg";
import { useNavigate } from "react-router-dom"; // import this
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../../components/home/Navbar/Navbar";

const DeliveryRegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "", 
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
        "http://localhost:8000/deliveryApi/delivery-personnel/register",
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
        navigate("/login");
      }, 1500); // optional delay so user can see the success message
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  const fields = [
    { name: "name", placeholder: "Full Name", icon: <FaUser /> },
    { name: "phone", placeholder: "Phone Number", icon: <FaPhone /> },
    { name: "email", placeholder: "Email Address", icon: <FaEnvelope  /> }, 
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
      <Navbar />
      <div
        className="relative min-h-screen bg-cover"
        style={{ backgroundImage: `url(${homeImage})` }}
      >
        <div className="flex items-center justify-center min-h-screen bg-black/40 ">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg p-10 bg-white shadow-xl bg-opacity-95 rounded-3xl"
          >
            <h2 className="mb-8 text-3xl font-bold text-center text-orange-500">
              Register as a Delivery Driver
            </h2>

            {fields.map((field) => (
              <div
                key={field.name}
                className="flex items-center p-3 mb-4 bg-gray-100 rounded-full shadow-sm"
              >
                <div className="mr-3 text-orange-500">{field.icon}</div>
                <input
                  type="text"
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                  className="flex-1 text-sm text-gray-700 bg-transparent outline-none"
                />
              </div>
            ))}

            <button
              type="submit"
              className="w-full py-2 font-semibold text-white transition duration-200 bg-orange-500 rounded-full hover:bg-orange-600"
            >
              Register
            </button>

            {message && (
              <p className="mt-4 text-sm text-center text-red-600">{message}</p>
            )}
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DeliveryRegistrationForm;
