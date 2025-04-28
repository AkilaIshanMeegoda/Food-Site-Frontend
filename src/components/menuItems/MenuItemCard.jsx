import React from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate } from "react-router";
// menu item card component
const MenuItemCard = ({ item, onCardClick }) => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { addToCart } = useCart();

  const handleAddToCart = (e, item) => {
    e.stopPropagation();
    console.log(item);

    if (!item.isAvailable) return;

    const restaurantId = item.restaurantId || props.restaurantId;
    const restaurantName = item.restaurantName;

    if (!user || user.role !== "customer") {
      toast.error("Please login to add items to cart.");
      navigate("/login");
    } else {
      const success = addToCart(item, restaurantId, restaurantName);

      if (success) {
        toast.success(`${item.name} added to cart!`);
      }
    }
  };

  return (
    <div
      key={item._id}
      className="relative overflow-hidden transition-transform duration-300 transform bg-white shadow-lg cursor-pointer group rounded-2xl hover:scale-105"
      onClick={() => onCardClick(item._id)}
    >
      {/* Image section */}
      <div className="relative h-48 bg-gray-100">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="object-cover w-full h-full"
            onError={(e) => {
              e.target.onerror = null;
            }}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-200">
            No Image
          </div>
        )}

        {/* Add to Cart */}
        <button
          type="button"
          onClick={(e) => handleAddToCart(e, item)}
          disabled={!item.isAvailable}
          className="absolute p-2 transition-opacity duration-200 bg-white rounded-full shadow-lg opacity-0 top-3 right-3 group-hover:opacity-100 disabled:opacity-50"
        >
          <ShoppingCart size={20} className="text-blue-600" />
        </button>
      </div>

      {/* Details section */}
      <div className="flex flex-col h-full p-5">
        {/* Title and Category */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-800 truncate">
            {item.name}
          </h3>
          <span className="px-2 py-1 text-xs font-medium text-blue-600 rounded-full bg-blue-50">
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
          <div className="flex items-center mb-2 text-sm text-gray-500">
            <span>⏱ {item.preparationTime} mins</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuItemCard;
