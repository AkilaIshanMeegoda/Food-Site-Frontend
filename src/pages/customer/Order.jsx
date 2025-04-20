// src/pages/Order.jsx
import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus, FiClock, FiCheckCircle } from 'react-icons/fi';
import { useAuthContext } from '../../hooks/useAuthContext';

const Order = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, totalAmount, itemCount } = useCart();
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState('cart');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch user's orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setOrderLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login to view your orders');
        return;
      }
      console.log("hi")
      console.log(user.userId)
      const response = await axios.get(`http://localhost:5002/api/orders/customer/${user.userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load your orders');
    } finally {
      setOrderLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (cart.items.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    if (!deliveryAddress) {
      toast.error('Please provide a delivery address');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login to place an order');
        return;
      }
      
      const orderData = {
        customerId: user.userId,
        customerName: user.name || 'Customer',
        customerEmail: user.email || '',
        restaurantId: cart.restaurantId,
        restaurantName: cart.restaurantName,
        items: cart.items.map(item => ({
          id: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        deliveryAddress,
        deliveryInstructions,
        paymentMethod
      };
      
      const response = await axios.post('http://localhost:5002/api/order', orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        toast.success('Order placed successfully!');
        clearCart();
        fetchOrders();
        setActiveTab('orders');
      } else {
        toast.error(response.data.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
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
      'pending': { color: 'bg-yellow-100 text-yellow-800', icon: <FiClock className="mr-1" /> },
      'confirmed': { color: 'bg-blue-100 text-blue-800', icon: <FiCheckCircle className="mr-1" /> },
      'preparing': { color: 'bg-orange-100 text-orange-800', icon: <FiClock className="mr-1" /> },
      'ready_for_pickup': { color: 'bg-purple-100 text-purple-800', icon: <FiCheckCircle className="mr-1" /> },
      'out_for_delivery': { color: 'bg-indigo-100 text-indigo-800', icon: <FiClock className="mr-1" /> },
      'delivered': { color: 'bg-green-100 text-green-800', icon: <FiCheckCircle className="mr-1" /> },
      'cancelled': { color: 'bg-red-100 text-red-800', icon: <FiClock className="mr-1" /> },
      'false': { color: 'bg-gray-100 text-gray-800', icon: <FiClock className="mr-1" /> }
    };
    
    const statusConfig = statusMap[status] || statusMap['pending'];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
        {statusConfig.icon}
        {status === 'false' ? 'pending' : status.replace(/_/g, ' ')}
      </span>
    );
  };

  const renderCartTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
      
      {cart.items.length === 0 ? (
        <div className="p-6 text-center bg-white rounded-lg shadow">
          <FiShoppingCart className="mx-auto mb-4 text-5xl text-gray-400" />
          <h3 className="mb-2 text-xl font-medium text-gray-700">Your cart is empty</h3>
          <p className="mb-4 text-gray-500">Add items from the menu to get started</p>
        </div>
      ) : (
        <>
          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="p-4 border-b bg-gray-50">
              <h3 className="font-semibold text-gray-800">
                {cart.restaurantName || 'Restaurant'}
              </h3>
            </div>
            
            <div className="divide-y">
              {cart.items.map(item => (
                <div key={item._id} className="flex items-center justify-between p-4">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{item.name}</h4>
                    <p className="text-sm text-gray-600">Rs{item.price.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex items-center">
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="p-1 text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300"
                      disabled={item.quantity <= 1}
                    >
                      <FiMinus size={16} />
                    </button>
                    
                    <span className="w-8 mx-3 text-center">{item.quantity}</span>
                    
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="p-1 text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300"
                    >
                      <FiPlus size={16} />
                    </button>
                    
                    <button 
                      onClick={() => removeFromCart(item._id)}
                      className="p-1 ml-4 text-red-500 rounded-full hover:bg-red-100"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">Delivery Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Delivery Address*
                </label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter your full address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Delivery Instructions (Optional)
                </label>
                <textarea
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                  placeholder="Any special instructions for delivery?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                />
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Payment Method
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">Credit/Debit Card</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={paymentMethod === 'cash'}
                      onChange={() => setPaymentMethod('cash')}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">Cash on Delivery</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">Order Summary</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">Rs{totalAmount.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium">Rs50.00</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (5%)</span>
                <span className="font-medium">Rs{(totalAmount * 0.05).toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between pt-2 mt-2 border-t">
                <span className="font-semibold text-gray-800">Total</span>
                <span className="text-lg font-bold text-blue-600">
                  Rs{(totalAmount + 50 + totalAmount * 0.05).toFixed(2)}
                </span>
              </div>
            </div>
            
            <button
              onClick={handlePlaceOrder}
              disabled={loading || cart.items.length === 0}
              className={`w-full mt-6 py-2 px-4 rounded-md font-medium text-white 
                ${loading || cart.items.length === 0 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </>
      )}
    </div>
  );

  const renderOrdersTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
      
      {orderLoading ? (
        <div className="py-8 text-center">
          <div className="w-12 h-12 mx-auto border-b-2 border-blue-500 rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-600">Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="p-6 text-center bg-white rounded-lg shadow">
          <FiShoppingCart className="mx-auto mb-4 text-5xl text-gray-400" />
          <h3 className="mb-2 text-xl font-medium text-gray-700">No orders yet</h3>
          <p className="mb-4 text-gray-500">Your order history will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div 
              key={order._id} 
              className={`bg-white rounded-lg shadow overflow-hidden cursor-pointer 
                ${selectedOrder === order._id ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
            >
              <div className="flex items-center justify-between p-4 border-b">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Order #{order._id.substring(order._id.length - 6)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                {getStatusBadge(order.orderStatus)}
              </div>
              
              {selectedOrder === order._id && (
                <div className="p-4">
                  <div className="mb-4">
                    <h4 className="mb-2 font-medium text-gray-700">Order Details</h4>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Restaurant:</span> {order.restaurantName}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Delivery Address:</span> {order.deliveryAddress}
                    </p>
                    {order.deliveryInstructions && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Instructions:</span> {order.deliveryInstructions}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Payment Method:</span> {order.paymentMethod}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Payment Status:</span> {order.paymentStatus}
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="mb-2 font-medium text-gray-700">Items</h4>
                    <div className="p-3 rounded-md bg-gray-50">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between py-2 border-b last:border-0">
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">Rs{item.price} x {item.quantity}</p>
                          </div>
                          <p className="font-medium">Rs{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4 mt-4 border-t">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount</span>
                      <span className="font-bold">Rs{order.totalAmount.toFixed(2)}</span>
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
    <div className="max-w-4xl px-4 py-8 mx-auto">
      <div className="flex mb-6 border-b">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'cart' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('cart')}
        >
          Cart {itemCount > 0 && `(${itemCount})`}
        </button>
        
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'orders' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('orders')}
        >
          My Orders
        </button>
      </div>
      
      {activeTab === 'cart' ? renderCartTab() : renderOrdersTab()}
    </div>
  );
};

export default Order;
