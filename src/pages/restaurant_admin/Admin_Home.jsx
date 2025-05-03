import React, { useState, useEffect } from "react";
import Navbar from "../../components/home/Navbar/Navbar";
import { FaDollarSign, FaClipboardList, FaUtensils } from "react-icons/fa";
import { useAuthContext } from "../../hooks/useAuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner } from "flowbite-react";
// restaurant owner side home page for manage orders and restaurant status
const Admin_Home = () => {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(null);
  const [orders, setOrders] = useState([]);

  console.log("check user", user);
  useEffect(() => {
    if (!user?.token || !user?.restaurantId) return;

    const loadRestaurant = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/restaurantApi/restaurants/my-restaurant`,
          {
            headers: { Authorization: `Bearer ${user.token}` }
          }
        );
        const json = await res.json();
        setIsAvailable(json.isAvailable);
      } catch (err) {
        toast.error("Could not load restaurant status");
      }
    };
  
    loadRestaurant();

    const fetchOrders = async () => {
      setOrdersLoading(true);
      try {
        const res = await fetch(
          `http://localhost:8000/orderApi/order/restaurant/${user.restaurantId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Failed to load orders");
        }

        const json = await res.json();
        // the raw array lives under `data`
        const rawOrders = Array.isArray(json.data) ? json.data : [];
        // store *all* orders
        setOrders(rawOrders);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // count all orders
  const totalOrders = orders.length;
  // get total for non-pending orders
  const totalIncome = orders
    .filter(o => o.paymentStatus !== "pending")
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  // handle restaurant availability
  const toggleAvailability = async () => {
    if (!user?.token || !user?.restaurantId) {
      toast.error("Authentication required");
      return;
    }
    setLoading(true);
    try {
      const newStatus = !isAvailable;
      const res = await fetch(
        `http://localhost:8000/restaurantApi/restaurants/${user.restaurantId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ isAvailable: newStatus }),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Update failed");
      }
      setIsAvailable(newStatus);
      toast.success(
        `Status updated to ${newStatus ? "Available" : "Unavailable"}`
      );
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
      <div className="container px-4 py-8 mx-auto sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
          {/* Total Income (non‑pending only) */}
          <div className="p-6 bg-gray-900 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Total Income</p>
                {ordersLoading ? (
                  <Spinner size="lg" />
                ) : (
                  <p className="text-2xl font-bold text-white">
                    ${totalIncome.toLocaleString()}
                  </p>
                )}
              </div>
              <FaDollarSign className="p-2 text-3xl text-green-500 bg-green-800 rounded-full" />
            </div>
          </div>

          {/* Total Orders (all orders) */}
          <div className="p-6 bg-gray-900 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Total Orders</p>
                {ordersLoading ? (
                  <Spinner size="lg" />
                ) : (
                  <p className="text-2xl font-bold text-white">
                    {totalOrders}
                  </p>
                )}
              </div>
              <FaClipboardList className="p-2 text-3xl text-blue-500 bg-blue-800 rounded-full" />
            </div>
          </div>

          {/* Restaurant Availability */}
          <div className="p-6 bg-gray-900 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-300">Restaurant Status</p>
                <p
                  className={`text-2xl font-bold ${
                    isAvailable ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {isAvailable ? "Available" : "Unavailable"}
                </p>
              </div>
              <FaUtensils className="p-2 text-3xl text-yellow-500 bg-yellow-800 rounded-full" />
            </div>
            <button
              onClick={toggleAvailability}
              disabled={loading}
              className="w-full py-2 mt-2 text-white transition bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-50"
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

        {/* Total Orders Table (all orders) */}
        <div className="overflow-hidden bg-gray-900 rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">
              Recent Orders
            </h2>
            {ordersLoading ? (
              <div className="flex justify-center">
                <Spinner size="lg" />
              </div>
            ) : orders.length === 0 ? (
              <p className="text-gray-300">No orders yet.</p>
            ) : (
              <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 z-10 bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-gray-300">#</th>
                      <th className="px-4 py-3 text-left text-gray-300">
                        Order ID
                      </th>
                      <th className="px-4 py-3 text-left text-gray-300">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-gray-300">
                        Payment Status
                      </th>
                      <th className="px-4 py-3 text-left text-gray-300">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {orders.map((o, idx) => (
                      <tr
                        key={o._id || idx}
                        className="transition-colors hover:bg-gray-800"
                      >
                        <td className="px-4 py-3 text-white">{idx + 1}</td>
                        <td className="px-4 py-3 text-white">{o._id}</td>
                        <td className="px-4 py-3 text-white">
                          ${o.totalAmount.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-white">
                          {o.paymentStatus}
                        </td>
                        <td className="px-4 py-3 text-white">
                          {new Date(o.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin_Home;
