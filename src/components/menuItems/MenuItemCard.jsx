import React from "react";
import { ShoppingCart } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MenuItemCard = ({ item, onCardClick }) => {

  const handleAddToCart = (e, item) => {
    e.stopPropagation();
    if (!item.isAvailable) return;

    // TEMPORARY: Just toast notification
    toast.success(`“${item.name} ${item._id}” added to cart!`);
    
    // TODO: Connect to your cart system:
    // 1. Use context: const { addToCart } = useCart();
    // 2. Call addToCart(item)
  };

  return (
    <div
      key={item._id}
      className="group relative bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300"
      onClick={() => onCardClick(item._id)}
    >
      {/* Image section with hover-cart overlay */}
      <div className="relative h-48 bg-gray-100">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/300?text=No+Image";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
            No Image
          </div>
        )}

        {/* Add to Cart overlay button */}
        <button
          type="button"
          onClick={(e) => handleAddToCart(e, item)}
          disabled={!item.isAvailable}
          className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 disabled:opacity-50"
        >
          <ShoppingCart size={20} className="text-blue-600" />
        </button>
      </div>

      {/* Details section */}
      <div className="p-5 flex flex-col h-full">
        {/* Title and Category */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-800 truncate">{item.name}</h3>
          <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
            {item.category || "Uncategorized"}
          </span>
        </div>

        {/* Price and Availability */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-semibold text-gray-900">
            Rs. {item.price ?? "N/A"}
          </span>
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              item.isAvailable
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            {item.isAvailable ? "Available" : "Unavailable"}
          </span>
        </div>

        {/* Preparation time if available */}
        {item.preparationTime && (
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span>⏱ {item.preparationTime} mins</span>
          </div>
        )}

      </div>
    </div>
  );
};

export default MenuItemCard;
