// src/components/Cart/CartItem.js
const CartItem = ({ restaurantId, item, onUpdateQuantity, onRemoveItem }) => {
    return (
      <div className="flex justify-between items-center mb-3 last:mb-0">
        <div className="flex-1">
          <h4 className="font-medium text-gray-800">{item.name}</h4>
          <p className="text-sm text-gray-600">Rs. {item.price.toFixed(2)}</p>
        </div>
        <div className="flex items-center">
          <button 
            onClick={() => onUpdateQuantity(restaurantId, item.id, item.quantity - 1)}
            className="w-8 h-8 flex items-center justify-center border rounded-l-lg text-gray-600 hover:bg-gray-100"
          >
            -
          </button>
          <span className="w-10 h-8 flex items-center justify-center border-t border-b text-center">
            {item.quantity}
          </span>
          <button 
            onClick={() => onUpdateQuantity(restaurantId, item.id, item.quantity + 1)}
            className="w-8 h-8 flex items-center justify-center border rounded-r-lg text-gray-600 hover:bg-gray-100"
          >
            +
          </button>
          <button 
            onClick={() => onRemoveItem(restaurantId, item.id)}
            className="ml-3 text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        </div>
      </div>
    );
  };
  
  export default CartItem;