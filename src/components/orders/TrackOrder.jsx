import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ArrowLeft, TruckIcon, ShoppingBag, Package, Home, CheckCircle } from "lucide-react";
import Navbar from "../../components/home/Navbar/Navbar";

const TrackOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [delivery, setDelivery] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderAndDelivery = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          toast.error("Please login to track your order");
          navigate("/login");
          return;
        }

        // Fetch order details
        const orderResponse = await axios.get(
          `http://localhost:5002/api/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (orderResponse.data.success) {
          setOrder(orderResponse.data.data);
          
          // Fetch delivery details
          const deliveryResponse = await axios.get(
            `http://localhost:5003/delivery/order/${orderId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (deliveryResponse.data.success) {
            setDelivery(deliveryResponse.data.data);
          }
        } else {
          setError("Order not found");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        setError(error.response?.data?.message || "Failed to fetch order details");
        toast.error("Failed to load order tracking information");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderAndDelivery();
    }
  }, [orderId, navigate]);

  const getDeliveryStatusInfo = () => {
    if (!delivery) return { current: 0, text: "Pending" };

    const statusMap = {
      pending: { step: 0, text: "Order Confirmed" },
      accepted: { step: 1, text: "Preparing" },
      picked_up: { step: 2, text: "Picked Up" },
      on_the_way: { step: 3, text: "On the Way" },
      delivered: { step: 4, text: "Delivered" }
    };

    return statusMap[delivery.status] || { step: 0, text: "Pending" };
  };

  const statusInfo = getDeliveryStatusInfo();

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const renderStatusSteps = () => {
    const steps = [
      { icon: <ShoppingBag className="w-6 h-6" />, label: "Order Confirmed" },
      { icon: <Package className="w-6 h-6" />, label: "Preparing" },
      { icon: <TruckIcon className="w-6 h-6" />, label: "Picked Up" },
      { icon: <TruckIcon className="w-6 h-6" />, label: "On the Way" },
      { icon: <Home className="w-6 h-6" />, label: "Delivered" }
    ];

    return (
      <div className="relative">
        {/* Progress Bar */}
        <div className="absolute top-9 left-0 right-0 h-1 bg-gray-200">
          <div
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${(statusInfo.step / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>

        {/* Steps */}
        <div className="flex justify-between relative">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center relative z-10"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                  index <= statusInfo.step
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {index < statusInfo.step ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  step.icon
                )}
              </div>
              <span
                className={`text-xs font-medium ${
                  index <= statusInfo.step ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="max-w-5xl px-4 py-10 mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
            <p className="ml-4 text-gray-600">Loading tracking information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div>
        <Navbar />
        <div className="max-w-5xl px-4 py-10 mx-auto">
          <button
            onClick={() => navigate("/order")}
            className="flex items-center mb-6 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="mr-2" size={18} /> Back to Orders
          </button>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <TruckIcon className="text-red-500 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h2>
            <p className="text-gray-600 mb-6">
              {error || "We couldn't find the order you're looking for."}
            </p>
            <button
              onClick={() => navigate("/order")}
              className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to My Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl px-4 py-10 mx-auto">
        <button
          onClick={() => navigate("/order")}
          className="flex items-center mb-6 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="mr-2" size={18} /> Back to Orders
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
            <h2 className="text-xl font-bold text-gray-800">
              Tracking Order #{orderId.substring(orderId.length - 6)}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Order placed on {formatDate(order.createdAt)}
            </p>
          </div>

          <div className="p-6">
            <div className="mb-8">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                <p className="text-blue-700 font-medium">
                  Current Status: <span className="font-semibold">{statusInfo.text}</span>
                </p>
                {delivery?.deliveryPersonnelId && (
                  <p className="text-sm text-blue-600 mt-1">
                    Delivery Agent: {delivery.deliveryPersonnelId}
                  </p>
                )}
              </div>

              <div className="py-6">{renderStatusSteps()}</div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Details</h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Order ID:</span>
                      <span className="font-medium text-gray-800">#{orderId.substring(orderId.length - 6)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Restaurant:</span>
                      <span className="font-medium text-gray-800">{order.restaurantName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Order Date:</span>
                      <span className="font-medium text-gray-800">{formatDate(order.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Payment Method:</span>
                      <span className="font-medium text-gray-800 capitalize">{order.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Payment Status:</span>
                      <span className={`font-medium capitalize ${
                        order.paymentStatus === "paid" ? "text-green-600" : "text-amber-600"
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="text-gray-700 font-medium">Total Amount:</span>
                      <span className="font-bold text-blue-600">Rs{order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Delivery Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Delivery Address:</span>
                      <span className="font-medium text-gray-800">{order.deliveryAddress}</span>
                    </div>
                    {order.deliveryInstructions && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Instructions:</span>
                        <span className="font-medium text-gray-800">{order.deliveryInstructions}</span>
                      </div>
                    )}
                    {delivery && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Estimated Delivery:</span>
                          <span className="font-medium text-gray-800">
                            {delivery.status === "delivered" 
                              ? "Delivered" 
                              : "Approximately 30-45 minutes"}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mb-4 mt-6">Items</h3>
                <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className={`flex justify-between p-3 ${
                        index !== order.items.length - 1 ? "border-b border-gray-200" : ""
                      }`}
                    >
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-500">Rs{item.price} x {item.quantity}</p>
                      </div>
                      <p className="font-medium text-gray-800">
                        Rs{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;