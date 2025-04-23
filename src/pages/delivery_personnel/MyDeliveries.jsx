import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Footer, Navbar } from "flowbite-react";
import DriverMap from "./../../components/driver/DriverMap";
import { useAuthContext } from "../../hooks/useAuthContext";

const MyDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const { user } = useAuthContext();


  // Fetch deliveries function
  const fetchDeliveries = async () => {
    if (!user || !user.token) return;
    
    try {
      const res = await axios.get(
        "http://localhost:5003/delivery-personnel/my-deliveries",
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setDeliveries(res.data || []);  // Ensure it defaults to an empty array if data is undefined
    } catch (err) {
      console.error("Fetch deliveries error:", err);
      toast.error("Failed to load deliveries.");
    }
  };



  useEffect(() => { 
      fetchDeliveries();
  
  });
  
  
  // Return early if user or token is not available - AFTER all hooks are defined
  if (!user || !user.token) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="py-10 px-4 max-w-6xl mx-auto text-center">
          <p>Please login to see your deliveries.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAccept = async (orderId, deliveryPersonnelId) => {
    try {
      await axios.post(
        "http://localhost:5003/delivery/accept",
        { orderId, deliveryPersonnelId },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      toast.success("Delivery Accepted!");
      fetchDeliveries();
    } catch (error) {
      toast.error("Failed to accept delivery.");
      console.error("Accept delivery error:", error.response?.data || error.message);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5003/delivery/update-status/${orderId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      toast.success("Status updated!");
      fetchDeliveries();
    } catch (error) {
      toast.error("Failed to update status.");
      console.error("Status update error:", error.response?.data || error.message);
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

  const acceptedDelivery = deliveries.find(
    (d) => d.status === "accepted" || d.status === "picked_up" || d.status === "on_the_way"
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="py-10 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-orange-500 text-center">
          📦 My Deliveries
        </h2>

        {deliveries.length === 0 ? (
          <div className="text-center text-gray-600 bg-white p-6 rounded-lg shadow-inner">
            No deliveries assigned yet.
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
                {deliveries.map((delivery) => (
                  <tr key={delivery._id} className="border-b">
                    <td className="px-4 py-3">{delivery.orderId}</td>
                    <td className="px-4 py-3">{delivery.pickupAddress}</td>
                    <td className="px-4 py-3">{delivery.dropoffAddress}</td>
                    <td className="px-4 py-3">
                      <span className={getStatusBadge(delivery.status)}>
                        {delivery.status.replaceAll("_", " ").toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {delivery.status === "pending" ? (
                        <button
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full"
                          onClick={() => handleAccept(delivery.orderId, delivery.deliveryPersonnelId)}
                        >
                          Accept
                        </button>
                      ) : (
                        <select
                          value={delivery.status}
                          onChange={(e) =>
                            handleStatusUpdate(delivery.orderId, e.target.value)
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

       {acceptedDelivery && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-center mb-4">
              📍 Real-Time Driver Location
            </h3>
            <DriverMap
              userId={user.userId}
              orderId={acceptedDelivery.orderId}
            />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyDeliveries;