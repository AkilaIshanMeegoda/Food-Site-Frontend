import React, { useEffect, useState } from 'react';
import OrderCard from '../../components/orders/OrderCard';
import { useAuthContext } from '../../hooks/useAuthContext';
import { toast } from 'react-toastify';
import Navbar from '../../components/home/Navbar/Navbar';

const ManageOrders = () => {
  const { user } = useAuthContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user?.restaurantId || !user?.token) {
          setError('Authentication required');
          setLoading(false);
          return;
        }

        setLoading(true);
        setError('');

        const response = await fetch(
          `http://localhost:5002/api/orders/restaurant/${user.restaurantId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        
        if (!response.ok) throw new Error('Failed to fetch orders');
        
        const data = await response.json();
        console.log("checking response", data);
        setOrders(data.data);
        console.log("check orders", orders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleApprove = async (orderId) => {
    try {
      if (!user?.token) {
        setError('Authentication required');
        return;
      }
      console.log("check orderId", orderId);
      
      // 1. Update order status
      const response = await fetch(
        `http://localhost:5002/api/order/${orderId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ orderStatus: 'approved' }),
        }
      );

      if (!response.ok) throw new Error('Failed to approve order');
      
      // 2. Find the order to get addresses
      const order = orders.find(o => o._id === orderId);
      if (!order) throw new Error('Order not found');

      // Get restaurant address
      const pickupAddress = user?.restaurant?.address || order.restaurantAddress || '';
      const dropoffAddress = order.deliveryAddress || '';

      // 3. Call delivery API to assign delivery
      try {
        const deliveryResponse = await fetch(
          'http://localhost:5003/delivery/assign',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
              orderId,
              pickupAddress,
              dropoffAddress
            }),
          }
        );

        if (deliveryResponse.ok) {
          toast.success('Order approved and delivery assigned!');
        } else {
          toast.warning('Order approved but delivery assignment failed.');
        }
      } catch (deliveryErr) {
        toast.warning('Order approved but delivery assignment failed: ' + deliveryErr.message);
      }

      // 4. Update local state to show the change immediately
      setOrders(orders.map(order =>
        order._id === orderId ? { ...order, orderStatus: 'approved' } : order
      ));
      
    } catch (err) {
      setError(err.message);
      toast.error('Error: ' + err.message);
    }
  };

  if (!user) return <div>Loading user information...</div>;

  return (
    <div>
      <Navbar />
      <div className="p-8">
        <h1
          className="max-w-2xl mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl dark:text-black"
          style={{
            fontSize: "2rem",
            marginTop: "40px",
            marginBottom: "6px",
            marginLeft: "20px",
          }}
        >
          Restaurant Order Management
        </h1>
        <div className="container mx-auto p-4">
          <OrderCard
            orders={orders}
            loading={loading}
            error={error}
            onApprove={handleApprove}
            restaurantName={user?.restaurant?.name || 'Your Restaurant'}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageOrders;