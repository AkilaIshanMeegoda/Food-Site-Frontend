// ManageOrders.jsx
import React, { useEffect, useState } from 'react';
import OrderCard from '../../components/orders/OrderCard';
import { useAuthContext } from '../../hooks/useAuthContext';

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

      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, orderStatus: 'approved' } : order
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  if (!user) return <div>Loading user information...</div>;

  return (
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
  );
};

export default ManageOrders;