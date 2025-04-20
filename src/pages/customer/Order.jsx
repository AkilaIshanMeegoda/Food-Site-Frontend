import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiShoppingCart,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiHome,
  FiCreditCard,
} from "react-icons/fi";

const Order = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("menu");
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState(
    "123 Main Street, Colombo"
  );
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit_card");

  // Sample restaurant data
  const restaurants = [
    {
      id: "1",
      name: "Burger King",
      cuisine: "American • Burgers",
      image: "https://source.unsplash.com/random/300x200/?burger",
      rating: 4.2,
      deliveryTime: "20-30 min",
      menuItems: [
        {
          id: "101",
          name: "Whopper Meal",
          description:
            "Flame-grilled beef patty with tomatoes, lettuce, mayo, ketchup, pickles, and onions",
          price: 1200,
          category: "Meals",
          image: "https://source.unsplash.com/random/300x200/?whopper",
        },
        {
          id: "102",
          name: "Cheeseburger",
          description:
            "Classic cheeseburger with American cheese, ketchup, and mustard",
          price: 800,
          category: "Burgers",
          image: "https://source.unsplash.com/random/300x200/?cheeseburger",
        },
      ],
    },
    {
      id: "2",
      name: "Pizza Hut",
      cuisine: "Italian • Pizza",
      image: "https://source.unsplash.com/random/300x200/?pizza",
      rating: 4.5,
      deliveryTime: "30-45 min",
      menuItems: [
        {
          id: "201",
          name: "Pepperoni Pizza",
          description: "Classic pepperoni pizza with mozzarella cheese",
          price: 1800,
          category: "Pizzas",
          image: "https://source.unsplash.com/random/300x200/?pepperoni+pizza",
        },
        {
          id: "202",
          name: "Vegetarian Pizza",
          description: "Mixed vegetables with mozzarella cheese",
          price: 1600,
          category: "Pizzas",
          image: "https://source.unsplash.com/random/300x200/?vegetarian+pizza",
        },
      ],
    },
  ];

  useEffect(() => {
    // Fetch orders from backend
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token"); // or however you store JWT
        const res = await fetch("http://localhost:5002/orders/customer", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error("Failed to fetch orders", err);
      }
    };
    fetchOrders();
  }, []);

  const addToCart = (restaurantId, item) => {
    setCart((prevCart) => {
      // Check if we already have items from this restaurant
      const restaurantInCart = prevCart.find(
        (r) => r.restaurantId === restaurantId
      );

      if (restaurantInCart) {
        // Check if item already exists in cart
        const existingItem = restaurantInCart.items.find(
          (i) => i.id === item.id
        );

        if (existingItem) {
          // Increase quantity
          return prevCart.map((r) =>
            r.restaurantId === restaurantId
              ? {
                  ...r,
                  items: r.items.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                  ),
                }
              : r
          );
        } else {
          // Add new item to existing restaurant
          return prevCart.map((r) =>
            r.restaurantId === restaurantId
              ? { ...r, items: [...r.items, { ...item, quantity: 1 }] }
              : r
          );
        }
      } else {
        // Add new restaurant with this item
        return [
          ...prevCart,
          {
            restaurantId,
            restaurantName: restaurants.find((r) => r.id === restaurantId).name,
            items: [{ ...item, quantity: 1 }],
          },
        ];
      }
    });
  };

  const updateQuantity = (restaurantId, itemId, newQuantity) => {
    if (newQuantity < 1) return;

    setCart((prevCart) =>
      prevCart.map((r) =>
        r.restaurantId === restaurantId
          ? {
              ...r,
              items: r.items.map((i) =>
                i.id === itemId ? { ...i, quantity: newQuantity } : i
              ),
            }
          : r
      )
    );
  };

  const removeFromCart = (restaurantId, itemId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((r) =>
        r.restaurantId === restaurantId
          ? {
              ...r,
              items: r.items.filter((i) => i.id !== itemId),
            }
          : r
      );

      // Remove restaurant if no items left
      return updatedCart.filter((r) => r.items.length > 0);
    });
  };

  const calculateCartTotal = () => {
    return cart.reduce((total, restaurant) => {
      const restaurantTotal = restaurant.items.reduce((subtotal, item) => {
        return subtotal + item.price * item.quantity;
      }, 0);
      return total + restaurantTotal;
    }, 0);
  };

  const placeOrder = async () => {
    if (cart.length === 0) return;
    try {
      const token = localStorage.getItem("token");
      const body = {
        restaurants: cart.map((restaurant) => ({
          restaurantId: restaurant.restaurantId,
          restaurantName: restaurant.restaurantName,
          items: restaurant.items.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        })),
        deliveryAddress,
        deliveryInstructions,
        paymentMethod,
      };
      const res = await fetch("http://localhost:5002/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const newOrder = await res.json();
        setOrders([newOrder, ...orders]);
        setCart([]);
        setActiveTab("order-confirmation");
      } else {
        const err = await res.json();
        alert("Order failed: " + (err.error || "Unknown error"));
      }
    } catch (err) {
      alert("Order failed: " + err.message);
    }
  };

  const renderStatusBadge = (status) => {
    const statusConfig = {
      preparing: {
        color: "bg-yellow-100 text-yellow-800",
        icon: <FiClock className="mr-1" />,
      },
      "on-the-way": {
        color: "bg-blue-100 text-blue-800",
        icon: <FiTruck className="mr-1" />,
      },
      delivered: {
        color: "bg-green-100 text-green-800",
        icon: <FiCheckCircle className="mr-1" />,
      },
      processing: {
        color: "bg-purple-100 text-purple-800",
        icon: <FiClock className="mr-1" />,
      },
    };

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          statusConfig[status]?.color || "bg-gray-100 text-gray-800"
        }`}
      >
        {statusConfig[status]?.icon}
        {status.replace("-", " ")}
      </span>
    );
  };

  const renderMenuTab = () => (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Choose Restaurants</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {restaurant.name}
                  </h3>
                  <p className="text-gray-600">{restaurant.cuisine}</p>
                </div>
                <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
                  <span className="text-yellow-500">★</span>
                  <span className="ml-1 text-gray-700">
                    {restaurant.rating}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <button
                  onClick={() => setActiveTab(`menu-${restaurant.id}`)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Menu
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRestaurantMenu = (restaurantId) => {
    const restaurant = restaurants.find((r) => r.id === restaurantId);
    if (!restaurant) return null;

    return (
      <div className="space-y-6">
        <button
          onClick={() => setActiveTab("menu")}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Restaurants
        </button>

        <div className="flex items-start">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-20 h-20 rounded-lg object-cover mr-4"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {restaurant.name}
            </h2>
            <p className="text-gray-600">
              {restaurant.cuisine} • {restaurant.deliveryTime}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {restaurant.menuItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-32 object-cover rounded mb-3"
              />
              <h3 className="text-lg font-semibold text-gray-800">
                {item.name}
              </h3>
              <p className="text-gray-600 text-sm mb-2">{item.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-blue-600 font-bold">
                  Rs. {item.price.toFixed(2)}
                </span>
                <button
                  onClick={() => addToCart(restaurant.id, item)}
                  className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCartTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>

      {cart.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <FiShoppingCart className="mx-auto text-gray-400 text-5xl mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            Your cart is empty
          </h3>
          <p className="text-gray-500 mb-4">
            Browse restaurants and add items to get started
          </p>
          <button
            onClick={() => setActiveTab("menu")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Restaurants
          </button>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {cart.map((restaurant) => (
              <div
                key={restaurant.restaurantId}
                className="border-b last:border-b-0"
              >
                <div className="p-4 bg-gray-50">
                  <h3 className="font-semibold text-gray-800">
                    {restaurant.restaurantName}
                  </h3>
                </div>
                <div className="p-4">
                  {restaurant.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center mb-3 last:mb-0"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Rs. {item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <button
                          onClick={() =>
                            updateQuantity(
                              restaurant.restaurantId,
                              item.id,
                              item.quantity - 1
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center border rounded-l-lg text-gray-600 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="w-10 h-8 flex items-center justify-center border-t border-b text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              restaurant.restaurantId,
                              item.id,
                              item.quantity + 1
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center border rounded-r-lg text-gray-600 hover:bg-gray-100"
                        >
                          +
                        </button>
                        <button
                          onClick={() =>
                            removeFromCart(restaurant.restaurantId, item.id)
                          }
                          className="ml-3 text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Delivery Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Address
                </label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Instructions
                </label>
                <textarea
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  rows="2"
                  placeholder="Any special instructions for delivery?"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      checked={paymentMethod === "credit_card"}
                      onChange={() => setPaymentMethod("credit_card")}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Credit/Debit Card</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      checked={paymentMethod === "payhere"}
                      onChange={() => setPaymentMethod("payhere")}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">PayHere</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      checked={paymentMethod === "cash"}
                      onChange={() => setPaymentMethod("cash")}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Cash on Delivery</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Order Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  Rs. {calculateCartTotal().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium">Rs. 200.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (8%)</span>
                <span className="font-medium">
                  Rs. {(calculateCartTotal() * 0.08).toFixed(2)}
                </span>
              </div>
              <div className="border-t pt-3 mt-3 flex justify-between">
                <span className="font-semibold text-gray-800">Total</span>
                <span className="font-bold text-lg text-blue-600">
                  Rs.{" "}
                  {(
                    calculateCartTotal() +
                    200 +
                    calculateCartTotal() * 0.08
                  ).toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={placeOrder}
              className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );

  const renderOrderConfirmation = () => {
    const latestOrder = orders[0]; // Our most recent order

    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-2xl mx-auto">
        <FiCheckCircle className="mx-auto text-green-500 text-5xl mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Order Confirmed!
        </h2>
        <p className="text-gray-600 mb-6">
          Your order #{latestOrder.id} has been placed successfully.
        </p>

        <div className="text-left space-y-4 mb-8">
          <div className="flex justify-between">
            <span className="text-gray-600">Order Number</span>
            <span className="font-medium">#{latestOrder.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date & Time</span>
            <span className="font-medium">
              {new Date(latestOrder.date).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Amount</span>
            <span className="font-medium">
              Rs. {latestOrder.totalAmount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Method</span>
            <span className="font-medium">
              {paymentMethod === "credit_card"
                ? "Credit/Debit Card"
                : paymentMethod === "payhere"
                ? "PayHere"
                : "Cash on Delivery"}
            </span>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="font-semibold text-gray-800 mb-3">
            Restaurants in your order:
          </h3>
          <div className="space-y-3">
            {latestOrder.restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
              >
                <span className="font-medium">{restaurant.name}</span>
                {renderStatusBadge(restaurant.status)}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => {
              setActiveTab("orders");
              setSelectedOrder(latestOrder.id);
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Order Details
          </button>
          <button
            onClick={() => setActiveTab("menu")}
            className="bg-white text-blue-600 px-6 py-2 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  };

  const renderOrdersTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Your Orders</h2>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <FiShoppingCart className="mx-auto text-gray-400 text-5xl mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No orders yet
          </h3>
          <p className="text-gray-500 mb-4">
            Your completed orders will appear here
          </p>
          <button
            onClick={() => setActiveTab("menu")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Restaurants
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className={`bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                selectedOrder === order.id ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => setSelectedOrder(order.id)}
            >
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Order #{order._id}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()} •{" "}
                      {order.restaurants.length} restaurant(s)
                    </p>
                  </div>
                  {renderStatusBadge(order.status)}
                </div>
              </div>

              {selectedOrder === order.id && (
                <div className="p-4 bg-gray-50">
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">
                      Delivery Details
                    </h4>
                    <div className="flex items-center text-gray-600">
                      <FiHome className="mr-2" />
                      <span>123 Main Street, Colombo</span>
                    </div>
                    {order.deliveryPerson && (
                      <div className="flex items-center text-gray-600 mt-1">
                        <FiTruck className="mr-2" />
                        <span>Delivery by {order.deliveryPerson}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700">Items</h4>
                    {order.restaurants.map((restaurant) => (
                      <div
                        key={restaurant.id}
                        className="bg-white rounded-lg p-3 shadow-xs"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="font-medium">{restaurant.name}</h5>
                          {renderStatusBadge(restaurant.status)}
                        </div>
                        <ul className="space-y-2">
                          {restaurant.items.map((item) => (
                            <li
                              key={item.id}
                              className="flex justify-between text-sm"
                            >
                              <span>
                                {item.quantity} × {item.name}
                              </span>
                              <span>
                                Rs. {(item.price * item.quantity).toFixed(2)}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <div className="flex justify-between border-t mt-2 pt-2 text-sm font-medium">
                          <span>Subtotal</span>
                          <span>Rs. {restaurant.subtotal.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>Rs. {order.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 mt-1">
                      <span>Delivery Fee</span>
                      <span>Rs. 200.00</span>
                    </div>
                    <div className="flex justify-between text-gray-600 mt-1">
                      <span>Tax (8%)</span>
                      <span>Rs. {(order.totalAmount * 0.08).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-gray-800 mt-2 pt-2 border-t">
                      <span>Total</span>
                      <span>
                        Rs.{" "}
                        {(
                          order.totalAmount +
                          200 +
                          order.totalAmount * 0.08
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center text-sm text-gray-500">
                    <FiCreditCard className="mr-2" />
                    <span>
                      Paid with{" "}
                      {paymentMethod === "credit_card"
                        ? "Credit/Debit Card"
                        : paymentMethod === "payhere"
                        ? "PayHere"
                        : "Cash on Delivery"}
                    </span>
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">FoodExpress</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab("menu")}
              className={`px-4 py-2 rounded-lg ${
                activeTab === "menu"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Menu
            </button>
            <button
              onClick={() => setActiveTab("cart")}
              className={`px-4 py-2 rounded-lg flex items-center ${
                activeTab === "cart"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <FiShoppingCart className="mr-2" />
              Cart{" "}
              {cart.length > 0 &&
                `(${cart.reduce((sum, r) => sum + r.items.length, 0)})`}
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2 rounded-lg ${
                activeTab === "orders"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              My Orders
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-md p-6">
          {activeTab === "menu" && renderMenuTab()}
          {activeTab.startsWith("menu-") &&
            renderRestaurantMenu(activeTab.split("-")[1])}
          {activeTab === "cart" && renderCartTab()}
          {activeTab === "order-confirmation" && renderOrderConfirmation()}
          {activeTab === "orders" && renderOrdersTab()}
        </div>
      </div>
    </div>
  );
};

export default Order;
