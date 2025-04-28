import React, { useState } from "react";
import { FaCheckCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { toast } from "react-toastify";

// order status styles
const orderStatusStyles = {
  pending: "bg-yellow-400 text-gray-900",
  approved: "bg-green-500 text-white",
  cancelled: "bg-red-500 text-white",
  shipped: "bg-blue-400 text-white",
};

// payment status styles
const paymentStatusStyles = {
  pending: "bg-red-400 text-white",
  completed: "bg-green-500 text-white",
  failed: "bg-red-600 text-white",
  refunded: "bg-purple-500 text-white",
};
// restaurant owner side order details card
const OrderCard = ({ orders, loading, error, onApprove, restaurantName }) => {
  const [expandedIds, setExpandedIds] = useState([]);

  const toggleDetails = (id) =>
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const handleApprove = (id) => {
    const order = orders.find((order) => order._id === id);
    if (order?.orderStatus.toLowerCase() === "approved") {
      toast.error("Order already approved!");
      return;
    }
    if (window.confirm("Are you sure you want to approve this order?")) {
      onApprove(id);
      toast.success("Order approved!");
    }
  };

  if (loading)
    return <div className="text-center p-6 text-white">Loading orders…</div>;
  if (error) return <div className="text-red-400 p-6">{error}</div>;
  if (!orders.length) return <div className="p-6 text-white">No orders found</div>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold text-white">
        Manage Orders - {restaurantName}
      </h2>

      <div className="grid gap-6">
        {orders.map((order) => {
          const isExpanded = expandedIds.includes(order._id);
          const status = order.orderStatus.toLowerCase();
          const payment = order.paymentStatus.toLowerCase();
          const orderPill = orderStatusStyles[status] || "bg-gray-500 text-white";
          const paymentPill = paymentStatusStyles[payment] || "bg-gray-500 text-white";

          // Customer name and total calculation
          const customerName = order.customerName || order.customer?.name || "Guest";
          const totalAmount = order.totalAmount;
          return (
            <div
              key={order._id}
              className="bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-xl transition"
            >
              {/* Header: ID, Customer, Total, Status, Payment Status, and Actions */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                {/* Left: Order info */}
                <div className="flex-1 text-white space-y-2">
                  <p className="text-lg font-semibold text-green-400">
                    Order #{order._id.slice(-6)}
                  </p>
                  <p className="text-md">
                    <span className="font-medium">Customer:</span> {customerName}
                  </p>
                  <p className="text-md">
                    <span className="font-medium">Payment Method:</span> {order.paymentMethod}
                  </p>
                  <p className="text-md font-semibold">
                    Total: LKR {totalAmount.toLocaleString()}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${orderPill}`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${paymentPill}`}
                    >
                      Payment: {payment.charAt(0).toUpperCase() + payment.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                  {/* Always show the Approve button */}
                  <button
                    onClick={() => handleApprove(order._id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center transition"
                  >
                    <FaCheckCircle className="mr-2" /> Approve
                  </button>

                  <button
                    onClick={() => toggleDetails(order._id)}
                    className="text-gray-400 hover:text-white text-sm flex items-center"
                  >
                    {isExpanded ? (
                      <>
                        Hide Details <FaChevronUp className="ml-1" />
                      </>
                    ) : (
                      <>
                        Show Details <FaChevronDown className="ml-1" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Collapsible Details: Delivery, Items, Date */}
              {isExpanded && (
                <div className="mt-4 border-t border-gray-700 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300 text-sm">
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Date:</span>{" "}
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                    <p>
                      <span className="font-medium">Delivery:</span>{" "}
                      {order.deliveryAddress}
                    </p>
                    <p>
                      <span className="font-medium">Instructions:</span>{" "}
                      {order.deliveryInstructions || "None"}
                    </p>
                    <p>
                      <span className="font-medium">Phone Number:</span>{" "}
                      {order.customerPhone || "None"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Items:</span>
                    </p>
                    <ul className="mt-1 list-disc pl-5 space-y-1">
                      {order.items?.map((item) => (
                        <li key={item._id}>
                          {item.name} ×{item.quantity}{" "}
                          <span className="text-gray-500">
                            (LKR {item.price?.toLocaleString()})
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderCard;
