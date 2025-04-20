// src/components/MyOrders/MyOrders.js
import { FiShoppingCart } from 'react-icons/fi';
import OrderCard from './OrderCard';
import OrderDetails from './OrderDetails';

const MyOrders = ({ 
  orders, 
  selectedOrder, 
  onSelectOrder, 
  onBrowseRestaurants,
  paymentMethod
}) => {
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <FiShoppingCart className="mx-auto text-gray-400 text-5xl mb-4" />
        <h3 className="text-xl font-medium text-gray-700 mb-2">No orders yet</h3>
        <p className="text-gray-500 mb-4">Your completed orders will appear here</p>
        <button 
          onClick={onBrowseRestaurants}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Browse Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Your Orders</h2>
      
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id}>
            <OrderCard 
              order={order} 
              isSelected={selectedOrder === order.id}
              onClick={() => onSelectOrder(order.id)}
            />
            {selectedOrder === order.id && (
              <OrderDetails order={order} paymentMethod={paymentMethod} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;