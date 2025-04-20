// src/components/Menu/Menu.js
import { useState } from 'react';
import RestaurantCard from './RestaurantCard';
import MenuItem from './MenuItem';

const Menu = ({ restaurants, onAddToCart, onBackToRestaurants }) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const handleViewMenu = (restaurantId) => {
    setSelectedRestaurant(restaurants.find(r => r.id === restaurantId));
  };

  const handleBackToRestaurants = () => {
    setSelectedRestaurant(null);
    onBackToRestaurants();
  };

  if (selectedRestaurant) {
    return (
      <div className="space-y-6">
        <button 
          onClick={handleBackToRestaurants}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Restaurants
        </button>
        
        <div className="flex items-start">
          <img 
            src={selectedRestaurant.image} 
            alt={selectedRestaurant.name} 
            className="w-20 h-20 rounded-lg object-cover mr-4"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{selectedRestaurant.name}</h2>
            <p className="text-gray-600">{selectedRestaurant.cuisine} • {selectedRestaurant.deliveryTime}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedRestaurant.menuItems.map(item => (
            <MenuItem 
              key={item.id} 
              item={item} 
              onAddToCart={() => onAddToCart(selectedRestaurant.id, item)}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Choose Restaurants</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {restaurants.map(restaurant => (
          <RestaurantCard 
            key={restaurant.id} 
            restaurant={restaurant} 
            onViewMenu={handleViewMenu}
          />
        ))}
      </div>
    </div>
  );
};

export default Menu;