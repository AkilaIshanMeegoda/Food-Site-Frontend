import React from "react";

const MenuItemCard = ({ item, onCardClick }) => {
  return (
    <div
      key={item._id}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={() => onCardClick(item._id)}
    >
      <div className="p-4 h-48 flex items-center justify-center bg-gray-50">
        {item.image ? (
          <img
            className="object-cover w-full h-full"
            src={item.image}
            alt={item.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/300?text=No+Image";
            }}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-500">
            No Image
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold">{item.name}</h2>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            {item.category || "Uncategorized"}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {item.description || "No description available"}
        </p>

        <div className="text-xl font-bold text-gray-900">
          Rs. {item.price || "N/A"}
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
