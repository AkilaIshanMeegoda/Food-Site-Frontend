import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";
import axios from "axios";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Clock,
  CheckCircle,
  ArrowLeft,
  CreditCard,
  Banknote,
  ChevronDown,
  ChevronUp,
  CircleCheck,
  CircleX
} from "lucide-react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate } from "react-router";

const foodImages = {
  default: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80",
};

const Order = () => {
  const navigate = useNavigate();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalAmount,
    itemCount,
  } = useCart();
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState("cart");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch user's orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setOrderLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login to view your orders");
        return;
      }
      
      const response = await axios.get(
        `http://localhost:5002/api/orders/customer/${user.userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load your orders");
    } finally {
      setOrderLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (cart.items.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    if (!deliveryAddress) {
      toast.error("Please provide a delivery address");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login to place an order");
        return;
      }

      const orderData = {
        customerId: user.userId,
        customerName,
        customerEmail,
        customerPhone,
        restaurantId: cart.restaurantId,
        restaurantName: cart.restaurantName,
        items: cart.items.map((item) => ({
          id: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        deliveryAddress,
        deliveryInstructions,
        paymentMethod,
      };

      const response = await axios.post(
        "http://localhost:5002/api/order",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Order placed successfully!");
        clearCart();
        fetchOrders();
        setActiveTab("orders");
      } else {
        toast.error(response.data.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: {
        color: "bg-amber-100 text-amber-800 border border-amber-200",
        icon: <Clock className="w-3 h-3 mr-1" />,
      },
      confirmed: {
        color: "bg-blue-100 text-blue-800 border border-blue-200",
        icon: <CheckCircle className="w-3 h-3 mr-1" />,
      },
      preparing: {
        color: "bg-orange-100 text-orange-800 border border-orange-200",
        icon: <Clock className="w-3 h-3 mr-1" />,
      },
      ready_for_pickup: {
        color: "bg-purple-100 text-purple-800 border border-purple-200",
        icon: <CheckCircle className="w-3 h-3 mr-1" />,
      },
      out_for_delivery: {
        color: "bg-indigo-100 text-indigo-800 border border-indigo-200",
        icon: <Clock className="w-3 h-3 mr-1" />,
      },
      delivered: {
        color: "bg-emerald-100 text-emerald-800 border border-emerald-200",
        icon: <CheckCircle className="w-3 h-3 mr-1" />,
      },
      cancelled: {
        color: "bg-red-100 text-red-800 border border-red-200",
        icon: <CircleX className="w-3 h-3 mr-1" />,
      },
      false: {
        color: "bg-gray-100 text-gray-800 border border-gray-200",
        icon: <Clock className="w-3 h-3 mr-1" />,
      },
    };

    const statusConfig = statusMap[status] || statusMap["pending"];

    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}
      >
        {statusConfig.icon}
        {status === "false" ? "pending" : status.replace(/_/g, " ")}
      </span>
    );
  };

  const renderCartTab = () => (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>

      {cart.items.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <ShoppingCart className="text-gray-400 w-8 h-8" />
          </div>
          <h3 className="mb-2 text-xl font-medium text-gray-700">
            Your cart is empty
          </h3>
          <p className="mb-6 text-gray-500">
            Add items from the menu to get started with your order
          </p>
          <button 
            onClick={() => navigate("/menuItems")}
            className="px-6 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            Browse Menu
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
              <h3 className="font-semibold text-gray-800 flex items-center">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                {cart.restaurantName || "Restaurant"}
              </h3>
            </div>

            <div className="divide-y divide-gray-100">
              {cart.items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center p-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 mr-4 flex-shrink-0">
                    <img 
                      src={foodImages.default} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{item.name}</h4>
                    <p className="text-blue-600 font-semibold">Rs{item.price.toFixed(2)}</p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="p-2 text-gray-500 hover:bg-gray-100 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} className={item.quantity <= 1 ? "opacity-50" : ""} />
                      </button>

                      <span className="w-8 text-center text-gray-800 font-medium">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="p-2 text-gray-500 hover:bg-gray-100 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <h3 className="mb-4 text-lg font-semibold text-gray-800 pb-2 border-b border-gray-100">
                  Customer Details
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block mb-1.5 text-sm font-medium text-gray-700">
                      Full Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-sm font-medium text-gray-700">
                      Email Address<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-sm font-medium text-gray-700">
                      Phone Number<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Enter your contact number"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <h3 className="mb-4 text-lg font-semibold text-gray-800 pb-2 border-b border-gray-100">
                  Delivery Details
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block mb-1.5 text-sm font-medium text-gray-700">
                      Delivery Address<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Enter your full address"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-1.5 text-sm font-medium text-gray-700">
                      Delivery Instructions
                    </label>
                    <textarea
                      value={deliveryInstructions}
                      onChange={(e) => setDeliveryInstructions(e.target.value)}
                      placeholder="Any special instructions for delivery?"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      rows="3"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-2 gap-3 mt-1">
                      <label className={`flex items-center p-3 ${paymentMethod === "card" 
                        ? "bg-blue-50 border-blue-200 ring-2 ring-blue-100" 
                        : "bg-gray-50 border-gray-200"} border rounded-lg cursor-pointer transition-all`}>
                        <input
                          type="radio"
                          checked={paymentMethod === "card"}
                          onChange={() => setPaymentMethod("card")}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 hidden"
                        />
                        <CreditCard className={`mr-3 ${paymentMethod === "card" ? "text-blue-500" : "text-gray-400"}`} size={20} />
                        <span className={`${paymentMethod === "card" ? "text-blue-700 font-medium" : "text-gray-700"}`}>
                          Credit/Debit Card
                        </span>
                      </label>

                      <label className={`flex items-center p-3 ${paymentMethod === "cash" 
                        ? "bg-blue-50 border-blue-200 ring-2 ring-blue-100" 
                        : "bg-gray-50 border-gray-200"} border rounded-lg cursor-pointer transition-all`}>
                        <input
                          type="radio"
                          checked={paymentMethod === "cash"}
                          onChange={() => setPaymentMethod("cash")}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 hidden"
                        />
                        <Banknote className={`mr-3 ${paymentMethod === "cash" ? "text-blue-500" : "text-gray-400"}`} size={20} />
                        <span className={`${paymentMethod === "cash" ? "text-blue-700 font-medium" : "text-gray-700"}`}>
                          Cash on Delivery
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 sticky top-6 self-start">
              <h3 className="mb-4 text-lg font-semibold text-gray-800 pb-2 border-b border-gray-100">
                Order Summary
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-800">Rs{totalAmount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium text-gray-800">Rs150.00</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (5%)</span>
                  <span className="font-medium text-gray-800">
                    Rs{(totalAmount * 0.05).toFixed(2)}
                  </span>
                </div>

                <div className="pt-3 mt-3 border-t border-dashed border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Total Amount</span>
                    <span className="text-xl font-bold text-blue-600">
                      Rs{(totalAmount + 150 + totalAmount * 0.05).toFixed(2)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    Inclusive of all taxes
                  </div>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading || cart.items.length === 0}
                className={`w-full py-3.5 px-4 rounded-lg font-medium text-white 
                  ${
                    loading || cart.items.length === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow-md transition-all"
                  }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <CheckCircle className="mr-2" size={18} />
                    Place Order
                  </span>
                )}
              </button>
              
              <div className="mt-4 text-center text-xs text-gray-500">
                By placing your order, you agree to our Terms of Service and Privacy Policy
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderOrdersTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h2>

      {orderLoading ? (
        <div className="py-16 text-center bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 mx-auto border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <ShoppingCart className="text-gray-400 w-8 h-8" />
          </div>
          <h3 className="mb-2 text-xl font-medium text-gray-700">
            No orders yet
          </h3>
          <p className="mb-6 text-gray-500">
            Start shopping to create your first order
          </p>
          <button 
            onClick={() => navigate("/")}
            className="px-6 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            Browse Menu
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className={`bg-white rounded-xl shadow-sm border ${
                selectedOrder === order._id 
                ? "border-blue-200 ring-1 ring-blue-100" 
                : "border-gray-100 hover:border-gray-200"
              } overflow-hidden transition-all duration-200`}
            >
              <div 
                className="flex items-center justify-between p-5 cursor-pointer"
                onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
              >
                <div className="flex items-center">
                  <div className="mr-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 flex items-center">
                      Order #{order._id.substring(order._id.length - 6)}
                      {order.orderStatus === "delivered" && (
                        <CircleCheck className="ml-2 w-4 h-4 text-green-500" />
                      )}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {getStatusBadge(order.orderStatus)}
                  {selectedOrder === order._id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>

              {selectedOrder === order._id && (
                <div className="border-t border-gray-100 p-5 bg-gray-50">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Order Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p className="flex justify-between">
                          <span className="text-gray-500">Restaurant:</span>
                          <span className="font-medium text-gray-800">{order.restaurantName}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-500">Delivery Address:</span>
                          <span className="font-medium text-gray-800">{order.deliveryAddress}</span>
                        </p>
                        {order.deliveryInstructions && (
                          <p className="flex justify-between">
                            <span className="text-gray-500">Instructions:</span>
                            <span className="font-medium text-gray-800">{order.deliveryInstructions}</span>
                          </p>
                        )}
                        <p className="flex justify-between">
                          <span className="text-gray-500">Payment Method:</span>
                          <span className="font-medium text-gray-800 capitalize">{order.paymentMethod}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-500">Payment Status:</span>
                          <span className={`font-medium ${
                            order.paymentStatus === "paid" 
                              ? "text-green-600" 
                              : "text-amber-600"
                          } capitalize`}>
                            {order.paymentStatus}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Items
                      </h4>
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className={`flex justify-between py-2 ${
                              index !== order.items.length - 1 ? "border-b border-gray-100" : ""
                            }`}
                          >
                            <div className="flex-1">
                              <p className="font-medium text-gray-800">{item.name}</p>
                              <p className="text-xs text-gray-500">
                                Rs{item.price} x {item.quantity}
                              </p>
                            </div>
                            <p className="font-medium text-gray-800">
                              Rs{(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Total Amount</span>
                      <span className="text-xl font-bold text-blue-600">
                        Rs{order.totalAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="mt-4 text-right">
                      <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                        Track Order
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-5xl px-4 py-10 mx-auto">
      <button
        onClick={() => navigate("/")}
        className="flex items-center mb-6 text-blue-600 hover:text-blue-800 transition-colors"
      >
        <ArrowLeft className="mr-2" size={18} /> Back to Home
      </button>
      
      <div className="flex mb-8 border-b border-gray-200">
        <button
          className={`py-3 px-6 font-medium relative ${
            activeTab === "cart"
              ? "text-blue-600 before:absolute before:bottom-0 before:left-0 before:right-0 before:h-0.5 before:bg-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("cart")}
        >
          <span className="flex items-center">
            Cart {itemCount > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-full">
                {itemCount}
              </span>
            )}
          </span>
        </button>

        <button
          className={`py-3 px-6 font-medium relative ${
            activeTab === "orders"
              ? "text-blue-600 before:absolute before:bottom-0 before:left-0 before:right-0 before:h-0.5 before:bg-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("orders")}
        >
          My Orders
        </button>
      </div>

      {activeTab === "cart" ? renderCartTab() : renderOrdersTab()}
    </div>
  );
};

export default Order;