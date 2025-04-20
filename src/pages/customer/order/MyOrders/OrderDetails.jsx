// src/components/MyOrders/OrderDetails.js
import { FiHome, FiTruck, FiCreditCard } from 'react-icons/fi';
import StatusBadge from '../shared/StatusBadge';

const OrderDetails = ({ order, paymentMethod }) => {
  return (
    <div className="p-4 bg-gray-50">
      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">Delivery Details</h4>
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
        {order.restaurants.map(restaurant => (
          <div key={restaurant.id} className="bg-white rounded-lg p-3 shadow-xs">
            <div className="flex justify-between items-center mb-2">
              <h5 className="font-medium">{restaurant.name}</h5>
              <StatusBadge status={restaurant.status} />
            </div>
            <ul className="space-y-2">
              {restaurant.items.map(item => (
                <li key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.quantity} × {item.name}
                  </span>
                  <span>Rs. {(item.price * item.quantity).toFixed(2)}</span>
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
          <span>Rs. {(order.totalAmount + 200 + (order.totalAmount * 0.08)).toFixed(2)}</span>
        </div>
      </div>
      
      <div className="mt-4 flex items-center text-sm text-gray-500">
        <FiCreditCard className="mr-2" />
        <span>
          Paid with {paymentMethod === 'credit_card' ? 'Credit/Debit Card' : 
                    paymentMethod === 'payhere' ? 'PayHere' : 'Cash on Delivery'}
        </span>
      </div>
    </div>
  );
};

export default OrderDetails;