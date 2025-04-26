import React, { useEffect, useState } from "react";
import Navbar from "../../components/home/Navbar/Navbar";
import { FaClipboardList, FaDollarSign, FaUtensils } from "react-icons/fa";
import { useAuthContext } from "../../hooks/useAuthContext";
import { Spinner } from "flowbite-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SuperAdminDashBoard = () => {
  const { user } = useAuthContext();
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoadingRestaurants(true);
      try {
        const res = await fetch("http://localhost:5001/api/public/restaurants");
        const json = await res.json();
        setRestaurants(json || []);
      } catch (err) {
        toast.error("Failed to fetch restaurants.");
      } finally {
        setLoadingRestaurants(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handleRestaurantClick = async (restaurant) => {
    setSelectedRestaurant(restaurant);
    setLoadingOrders(true);
    try {
      const res = await fetch(
        `http://localhost:5002/api/orders/restaurant/${restaurant._id}`,
        {
            headers: { Authorization: `Bearer ${user.token}` }
        }
      );
      const json = await res.json();
      setOrders(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      toast.error("Failed to fetch orders.");
    } finally {
      setLoadingOrders(false);
    }
  };

  const totalOrders = orders.length;
  const totalIncome = orders
    .filter((o) => o.paymentStatus !== "pending")
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return (
    <div className="min-h-screen bg-black dark:bg-white">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">Super Admin Dashboard</h1>

        {/* Restaurant List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {loadingRestaurants ? (
            <Spinner size="lg" />
          ) : (
            restaurants.map((rest) => (
              <div
                key={rest._id}
                onClick={() => handleRestaurantClick(rest)}
                className="bg-gray-900 p-4 rounded-lg cursor-pointer hover:bg-gray-800 transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold">{rest.name}</p>
                    <p className="text-gray-400 text-sm">{rest.location || "No location"}</p>
                  </div>
                  <FaUtensils className="text-yellow-500 text-2xl" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Selected Restaurant Summary */}
        {selectedRestaurant && (
          <div className="mb-8">
            <h2 className="text-xl text-white font-semibold mb-4">
              Stats for: {selectedRestaurant.name}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-900 p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">Total Income</p>
                    {loadingOrders ? (
                      <Spinner size="lg" />
                    ) : (
                      <p className="text-2xl font-bold text-white">
                        ${totalIncome.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <FaDollarSign className="text-3xl text-green-500 bg-green-800 p-2 rounded-full" />
                </div>
              </div>

              <div className="bg-gray-900 p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">Total Orders</p>
                    {loadingOrders ? (
                      <Spinner size="lg" />
                    ) : (
                      <p className="text-2xl font-bold text-white">{totalOrders}</p>
                    )}
                  </div>
                  <FaClipboardList className="text-3xl text-blue-500 bg-blue-800 p-2 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders Table */}
        {selectedRestaurant && (
          <div className="bg-gray-900 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4 text-white">Recent Orders</h2>
              {loadingOrders ? (
                <div className="flex justify-center">
                  <Spinner size="lg" />
                </div>
              ) : orders.length === 0 ? (
                <p className="text-gray-300">No orders found.</p>
              ) : (
                <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-800 sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-3 text-left text-gray-300">#</th>
                        <th className="px-4 py-3 text-left text-gray-300">Order ID</th>
                        <th className="px-4 py-3 text-left text-gray-300">Amount</th>
                        <th className="px-4 py-3 text-left text-gray-300">Payment</th>
                        <th className="px-4 py-3 text-left text-gray-300">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {orders.map((order, idx) => (
                        <tr key={order._id} className="hover:bg-gray-800 transition-colors">
                          <td className="px-4 py-3 text-white">{idx + 1}</td>
                          <td className="px-4 py-3 text-white">{order._id}</td>
                          <td className="px-4 py-3 text-white">${order.totalAmount.toFixed(2)}</td>
                          <td className="px-4 py-3 text-white">{order.paymentStatus}</td>
                          <td className="px-4 py-3 text-white">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashBoard;
