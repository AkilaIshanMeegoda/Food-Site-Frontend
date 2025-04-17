// src/components/Cart/Cart.js
import { FiShoppingCart } from 'react-icons/fi';
import CartItem from './CartItem';
import CartSummary from './CartSummary';

const Cart = ({ 
  cart, 
  onUpdateQuantity, 
  onRemoveItem, 
  onPlaceOrder, 
  onBrowseRestaurants,
  deliveryAddress,
  deliveryInstructions,
  paymentMethod,
  onAddressChange,
  onInstructionsChange,
  onPaymentMethodChange
}) => {
  const calculateSubtotal = () => {
    return cart.reduce((total, restaurant) => {
      return total + restaurant.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const deliveryFee = 200;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <FiShoppingCart className="mx-auto text-gray-400 text-5xl mb-4" />
        <h3 className="text-xl font-medium text-gray-700 mb-2">Your cart is empty</h3>
        <p className="text-gray-500 mb-4">Browse restaurants and add items to get started</p>
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
      <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {cart.map(restaurant => (
          <div key={restaurant.restaurantId} className="border-b last:border-b-0">
            <div className="p-4 bg-gray-50">
              <h3 className="font-semibold text-gray-800">{restaurant.restaurantName}</h3>
            </div>
            <div className="p-4">
              {restaurant.items.map(item => (
                <CartItem
                  key={item.id}
                  restaurantId={restaurant.restaurantId}
                  item={item}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemoveItem={onRemoveItem}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <CartSummary
        subtotal={subtotal}
        deliveryFee={deliveryFee}
        tax={tax}
        total={total}
        onPlaceOrder={onPlaceOrder}
        deliveryAddress={deliveryAddress}
        deliveryInstructions={deliveryInstructions}
        paymentMethod={paymentMethod}
        onAddressChange={onAddressChange}
        onInstructionsChange={onInstructionsChange}
        onPaymentMethodChange={onPaymentMethodChange}
      />
    </div>
  );
};

export default Cart;