import React, { useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import SignupImg from "../../images/restaurant.jpg";
import { toast } from "react-toastify";
import Navbar from "../home/Navbar/Navbar";
// to register a restaurant by a user
const RestaurantSignUp = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Retrieve logged-in owner details from auth context.
  const { user } = useAuthContext();
  console.log("check user", user);
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create the restaurant data object.
    const restaurantData = {
      name: name,
      address,
      phone,
    };

    // Retrieve data from the auth context.
    const email = user?.email;
    const token = user?.token;

    // Combine all data into a payload.
    const payload = {
      email,
      token,
      role: "restaurant_admin",
      ...restaurantData,
    };
    console.log("checking payload", payload);
    try {
      setIsLoading(true);
      // Send a POST request to the API endpoint to register the restaurant owner.
      const response = await fetch(
        "http://localhost:8000/userApi/user/register-restaurant-owner",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error registering restaurant owner");
      }

      // Registration successful
      toast.success("Registration successful!");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div
        style={{
          height: "100vh",
          backgroundSize: "cover",
          backgroundImage: `url(${SignupImg})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="max-w-screen-xl px-4 sm:px-6 lg:px-8 pt-28">
          <div className="max-w-lg ml-40">
            <h1 className="text-3xl font-bold font-[poppins] text-center text-yellow-200 sm:text-3xl">
              Get started today
            </h1>

            <form
              onSubmit={handleSubmit}
              className="p-4 mb-0 space-y-4 rounded-lg shadow-lg signUp sm:p-6 lg:p-8"
            >
              <p className="text-2xl font-bold text-center font-[poppins] text-white">
                Register Your Restaurant
              </p>

              {/* Restaurant Name Field */}
              <div>
                <label htmlFor="name" className="sr-only">
                  Restaurant Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    className="w-full p-4 text-sm border-gray-200 rounded-lg shadow-sm"
                    placeholder="Enter restaurant name"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                  />
                </div>
              </div>

              {/* Address Field */}
              <div>
                <label htmlFor="address" className="sr-only">
                  Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="address"
                    className="w-full p-4 text-sm border-gray-200 rounded-lg shadow-sm"
                    placeholder="Enter address"
                    onChange={(e) => setAddress(e.target.value)}
                    value={address}
                  />
                </div>
              </div>

              {/* Telephone Field */}
              <div>
                <label htmlFor="phone" className="sr-only">
                  Telephone
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    id="phone"
                    className="w-full p-4 text-sm border-gray-200 rounded-lg shadow-sm"
                    placeholder="Enter telephone number"
                    onChange={(e) => setPhone(e.target.value)}
                    value={phone}
                  />
                </div>
              </div>

              {error && (
                <div className="font-bold text-red-700 text-md error">
                  {error}
                </div>
              )}

              <button
                disabled={isLoading}
                type="submit"
                className="block w-full px-5 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-purple-800"
              >
                {isLoading ? "Signing Up..." : "Sign Up"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantSignUp;
