// src/components/Menu/RestaurantCard.js
import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant, onViewMenu }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img 
        src={restaurant.image} 
        alt={restaurant.name} 
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{restaurant.name}</h3>
            <p className="text-gray-600">{restaurant.cuisine}</p>
          </div>
          <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
            <span className="text-yellow-500">★</span>
            <span className="ml-1 text-gray-700">{restaurant.rating}</span>
          </div>
        </div>
        
        <div className="mt-4">
          <button 
            onClick={() => onViewMenu(restaurant.id)}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;