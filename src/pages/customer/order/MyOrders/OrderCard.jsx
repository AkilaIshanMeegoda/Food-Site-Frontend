// src/components/MyOrders/OrderCard.js
import StatusBadge from '../shared/StatusBadge';

const OrderCard = ({ order, isSelected, onClick }) => {
  return (
    <div 
      className={`bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={onClick}
    >
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-gray-800">Order #{order.id}</h3>
            <p className="text-sm text-gray-500">
              {new Date(order.date).toLocaleDateString()} • {order.restaurants.length} restaurant(s)
            </p>
          </div>
          <StatusBadge status={order.status} />
        </div>
      </div>
    </div>
  );
};

export default OrderCard;