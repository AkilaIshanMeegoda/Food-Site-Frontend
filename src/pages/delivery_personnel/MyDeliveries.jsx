import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Footer, Navbar } from "flowbite-react";
import DriverMap from "./../../components/driver/DriverMap";
import { useAuthContext } from "../../hooks/useAuthContext";

const MyDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);

  // Fetch deliveries function
  const fetchDeliveries = async () => {
    if (!user || !user.token) return;

    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:8000/deliveryApi/delivery-personnel/my-deliveries",
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setDeliveries(res.data || []); // Ensure it defaults to an empty array if data is undefined
      setLoading(false);
    } catch (err) {
      console.error("Fetch deliveries error:", err);
      toast.error("Failed to load deliveries.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.token) {
      fetchDeliveries();

      // Set up an interval to refresh deliveries periodically (every 30 seconds)
      const intervalId = setInterval(fetchDeliveries, 30000);

      return () => clearInterval(intervalId);
    }
  }, [user]);

  // Return early if user or token is not available - AFTER all hooks are defined
  if (!user || !user.token) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-6xl px-4 py-10 mx-auto text-center">
          <p>Please login to see your deliveries.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAccept = async (orderId) => {
    try {
      await axios.post(
        "http://localhost:8000/deliveryApi/delivery/accept",
        {
          orderId,
          deliveryPersonnelId: user.userId,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      toast.success("Delivery Accepted!");
      fetchDeliveries();
    } catch (error) {
      toast.error("Failed to accept delivery.");
      console.error(
        "Accept delivery error:",
        error.response?.data || error.message
      );
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:8000/deliveryApi/delivery/update-status/${orderId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      toast.success("Status updated!");
      fetchDeliveries();
    } catch (error) {
      toast.error("Failed to update status.");
      console.error(
        "Status update error:",
        error.response?.data || error.message
      );
    }
  };

  const getStatusBadge = (status) => {
    const base = "text-xs font-semibold px-2 py-1 rounded";
    switch (status) {
      case "pending":
        return `${base} bg-yellow-100 text-yellow-700`;
      case "accepted":
        return `${base} bg-blue-100 text-blue-700`;
      case "picked_up":
        return `${base} bg-indigo-100 text-indigo-700`;
      case "on_the_way":
        return `${base} bg-orange-100 text-orange-700`;
      case "delivered":
        return `${base} bg-green-100 text-green-700`;
      default:
        return `${base} bg-gray-100 text-gray-600`;
    }
  };

  // Filter deliveries into:
  // 1. Available deliveries (pending and assigned to this driver)
  // 2. Active and completed deliveries (accepted or later status by this driver)
  const availableDeliveries = deliveries.filter(
    (d) =>
      d.status === "pending" &&
      (d.assignedDrivers?.includes(user.userId) || false)
  );

  const myDeliveries = deliveries.filter(
    (d) => d.status !== "pending" && d.deliveryPersonnelId === user.userId
  );

  // Find the active delivery (one that is accepted, picked up, or on the way)
  const activeDelivery = myDeliveries.find(
    (d) =>
      d.status === "accepted" ||
      d.status === "picked_up" ||
      d.status === "on_the_way"
  );

  // Get address to display based on delivery status
  const getActiveAddress = () => {
    if (!activeDelivery) return null;

    if (
      activeDelivery.status === "picked_up" ||
      activeDelivery.status === "on_the_way"
    ) {
      return {
        label: "Heading to",
        address: activeDelivery.dropoffAddress,
      };
    } else {
      return {
        label: "Pickup from",
        address: activeDelivery.pickupAddress,
      };
    }
  };

  const activeAddress = getActiveAddress();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-6xl px-4 py-10 mx-auto">
        <h2 className="mb-6 text-3xl font-bold text-center text-orange-500">
          📦 My Deliveries
        </h2>

        {loading ? (
          <div className="text-center p-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
            <p className="mt-2 text-gray-600">Loading deliveries...</p>
          </div>
        ) : (
          <>
            {/* Available deliveries section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">
                📬 Available Deliveries
              </h3>

              {availableDeliveries.length === 0 ? (
                <div className="text-center text-gray-600 bg-white p-6 rounded-lg shadow-inner">
                  No available deliveries at the moment.
                </div>
              ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
                  <table className="min-w-full table-auto">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="px-4 py-2">Order ID</th>
                        <th className="px-4 py-2">Pickup Address</th>
                        <th className="px-4 py-2">Drop-off Address</th>
                        <th className="px-4 py-2 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {availableDeliveries.map((delivery) => (
                        <tr key={delivery._id} className="border-b">
                          <td className="px-4 py-3">
                            {typeof delivery.orderId === "object"
                              ? delivery.orderId
                              : delivery.orderId.substring(0, 10)}
                            ...
                          </td>
                          <td className="px-4 py-3">
                            {delivery.pickupAddress}
                          </td>
                          <td className="px-4 py-3">
                            {delivery.dropoffAddress}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full"
                              onClick={() => handleAccept(delivery.orderId)}
                            >
                              Accept
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* My active/completed deliveries section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">
                🚚 My Active & Completed Deliveries
              </h3>

              {myDeliveries.length === 0 ? (
                <div className="text-center text-gray-600 bg-white p-6 rounded-lg shadow-inner">
                  You haven't accepted any deliveries yet.
                </div>
              ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
                  <table className="min-w-full table-auto">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="px-4 py-2">Order ID</th>
                        <th className="px-4 py-2">Pickup Address</th>
                        <th className="px-4 py-2">Drop-off Address</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myDeliveries.map((delivery) => (
                        <tr
                          key={delivery._id}
                          className={`border-b ${
                            activeDelivery &&
                            activeDelivery.orderId === delivery.orderId
                              ? "bg-orange-50"
                              : ""
                          }`}
                        >
                          <td className="px-4 py-3">
                            {typeof delivery.orderId === "object"
                              ? delivery.orderId
                              : delivery.orderId.substring(0, 10)}
                            ...
                          </td>
                          <td className="px-4 py-3">
                            {delivery.pickupAddress}
                          </td>
                          <td className="px-4 py-3">
                            {delivery.dropoffAddress}
                          </td>
                          <td className="px-4 py-3">
                            <span className={getStatusBadge(delivery.status)}>
                              {delivery.status
                                .replaceAll("_", " ")
                                .toUpperCase()}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {delivery.status === "delivered" ? (
                              <span className="text-green-600 font-medium">
                                ✓ Completed
                              </span>
                            ) : (
                              <select
                                value={delivery.status}
                                onChange={(e) =>
                                  handleStatusUpdate(
                                    delivery.orderId,
                                    e.target.value
                                  )
                                }
                                className="border p-2 rounded"
                              >
                                <option value="accepted">Accepted</option>
                                <option value="picked_up">Picked Up</option>
                                <option value="on_the_way">On The Way</option>
                                <option value="delivered">Delivered</option>
                              </select>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-center mb-4">
            📍 Real-Time Delivery Map
          </h3>
          <DriverMap
            userId={user.userId}
            orderId={activeDelivery ? activeDelivery.orderId : null}
            deliveries={myDeliveries}
            activeDelivery={activeDelivery}
          />

          {activeDelivery && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center mb-2">
                <div
                  className={`w-3 h-3 rounded-full mr-2 ${
                    activeDelivery.status === "accepted"
                      ? "bg-blue-500"
                      : activeDelivery.status === "picked_up"
                      ? "bg-indigo-500"
                      : "bg-orange-500"
                  }`}
                ></div>
                <h4 className="font-medium text-blue-700">Active Delivery</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-medium">
                    {typeof activeDelivery.orderId === "object"
                      ? activeDelivery.orderId
                      : activeDelivery.orderId.substring(0, 10)}
                    ...
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-medium capitalize">
                    {activeDelivery.status.replaceAll("_", " ")}
                  </p>
                </div>
                {activeAddress && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">
                      {activeAddress.label}
                    </p>
                    <p className="font-medium">{activeAddress.address}</p>
                  </div>
                )}
              </div>

              {activeDelivery.status === "accepted" && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <p className="text-sm">
                    <span className="font-medium text-blue-700">
                      Next Step:
                    </span>{" "}
                    Update status to "Picked Up" once you've collected the
                    package
                  </p>
                </div>
              )}

              {activeDelivery.status === "picked_up" && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <p className="text-sm">
                    <span className="font-medium text-blue-700">
                      Next Step:
                    </span>{" "}
                    Update status to "On The Way" during transit
                  </p>
                </div>
              )}

              {activeDelivery.status === "on_the_way" && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <p className="text-sm">
                    <span className="font-medium text-blue-700">
                      Next Step:
                    </span>{" "}
                    Update status to "Delivered" once the package is delivered
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyDeliveries;
