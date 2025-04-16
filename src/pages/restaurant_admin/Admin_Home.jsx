import React, { useState } from "react";
import Navbar from "../../components/home/Navbar/Navbar";
import { FaDollarSign, FaClipboardList, FaUtensils } from "react-icons/fa";
import { useAuthContext } from "../../hooks/useAuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner } from "flowbite-react";

const Admin_Home = () => {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  console.log("check user", user);
  const toggleAvailability = async () => {
    if (!user || !user.token || !user.restaurantId) {
      console.log("User not authenticated or missing restaurant ID");
      toast.error("Authentication required");
      return;
    }
  console.log("check user, token, restaurantId", user.token, user.restaurantId);
    try {
      setLoading(true);
      const newStatus = !isAvailable;
      
      const response = await fetch(
        `http://localhost:5001/api/restaurants/${user.restaurantId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.token}`
          },
          body: JSON.stringify({ isAvailable: newStatus })
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Update failed");
      }
  
      setIsAvailable(newStatus);
      toast.success(`Status updated to ${newStatus ? "Available" : "Unavailable"}`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black dark:bg-white">
      <Navbar />

      {/* Stats Cards */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Income Card */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total Income</p>
                <p className="text-2xl font-bold text-white">$24,500</p>
              </div>
              <FaDollarSign className="text-3xl text-green-500 bg-green-800 p-2 rounded-full" />
            </div>
          </div>

          {/* Total Orders Card */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-white">1,234</p>
              </div>
              <FaClipboardList className="text-3xl text-blue-500 bg-blue-800 p-2 rounded-full" />
            </div>
          </div>

          {/* Restaurant Availability Card */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-300 text-sm">Restaurant Status</p>
                <p
                  className={`text-2xl font-bold ${
                    isAvailable ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {isAvailable ? "Available" : "Unavailable"}
                </p>
              </div>
              <FaUtensils className="text-3xl text-yellow-500 bg-yellow-800 p-2 rounded-full" />
            </div>
            <button
                onClick={toggleAvailability}
                disabled={loading}
                className="mt-2 w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-700 transition disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Spinner size="sm" />
                    Updating...
                  </div>
                ) : isAvailable ? (
                  "Make Unavailable"
                ) : (
                  "Make Available"
                )}
            </button>
          </div>
        </div>

        {/* Table Section */}
        {/* Table Section */}
        <div className="bg-gray-900 rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-white">
              Recent Orders
            </h2>
            <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
              <table className="w-full md:w-3/4 mx-auto text-sm">
                <thead className="bg-gray-800 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-300">
                      #
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-300">
                      First
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-300">
                      Last
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-300">
                      Handle
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {[...Array(20).keys()].map((item) => (
                    <tr
                      key={item}
                      className="hover:bg-gray-800 transition-colors"
                    >
                      <td className="px-4 py-3 text-white">{item + 1}</td>
                      <td className="px-4 py-3 text-white">Mark</td>
                      <td className="px-4 py-3 text-white">Otto</td>
                      <td className="px-4 py-3 text-white">@mdo</td>
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

export default Admin_Home;
