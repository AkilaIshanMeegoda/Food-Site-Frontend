import React, { useState, useEffect } from "react";
import Navbar from "../../components/home/Navbar/Navbar";
import { FaEdit } from "react-icons/fa";
import { useAuthContext } from "../../hooks/useAuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner } from "flowbite-react";

const SuperAdminHome = () => {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all restaurants using the new API endpoint
        const restaurantsResponse = await fetch("http://localhost:8000/restaurantApi/restaurants/all-restaurants", {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const restaurantsData = await restaurantsResponse.json();
        console.log("check", restaurantsData);
        // Extract the restaurants array if necessary
        setRestaurants(Array.isArray(restaurantsData) ? restaurantsData : restaurantsData.restaurants);
      } catch (error) {
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) fetchData();
  }, [user]);

  // Toggle the 'isActive' field
  const handleToggleActive = async (restaurantId, currentActive) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/restaurantApi/restaurants/update/${restaurantId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({ isActive: !currentActive })
      });

      if (!response.ok) throw new Error("Active status update failed");

      setRestaurants(prevRestaurants =>
        prevRestaurants.map(restaurant =>
          restaurant._id === restaurantId
            ? { ...restaurant, isActive: !currentActive }
            : restaurant
        )
      );
      toast.success("Restaurant active status updated");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black dark:bg-white">
      <Navbar />

      {/* Restaurants Management Table */}
      <div className="container px-4 py-8 mx-auto sm:px-6 lg:px-8">
        <div className="overflow-hidden bg-gray-900 rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Manage Restaurants</h2>
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 z-10 bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-300">Name</th>
                    <th className="px-4 py-3 text-left text-gray-300">Address</th>
                    <th className="px-4 py-3 text-left text-gray-300">Telephone</th>
                    <th className="px-4 py-3 text-left text-gray-300">Is Active</th>
                    <th className="px-4 py-3 text-left text-gray-300">Is Available</th>
                    <th className="px-4 py-3 text-left text-gray-300">Toggle Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {Array.isArray(restaurants) && restaurants.map((restaurant) => (
                    <tr key={restaurant._id} className="transition-colors hover:bg-gray-800">
                      <td className="px-4 py-3 text-white">{restaurant.name}</td>
                      <td className="px-4 py-3 text-white">{restaurant.address}</td>
                      <td className="px-4 py-3 text-white">{restaurant.telephone}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          restaurant.isActive
                            ? "bg-green-800 text-green-300"
                            : "bg-red-800 text-red-300"
                        }`}>
                          {restaurant.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          restaurant.isAvailable
                            ? "bg-green-800 text-green-300"
                            : "bg-red-800 text-red-300"
                        }`}>
                          {restaurant.isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleActive(restaurant._id, restaurant.isActive)}
                          disabled={loading}
                          className="p-2 bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-50"
                        >
                          {loading ? (
                            <Spinner size="sm" />
                          ) : (
                            <FaEdit className="text-blue-400" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminHome;
