import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/home/Navbar/Navbar"; // update the path if needed
// user side restaurants page for displaying all restaurants
const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch restaurants from the API endpoint.
  const fetchRestaurants = async () => {
    try {
      const response = await fetch("http://localhost:8000/restaurantApi/public/restaurants");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();

      // Adjust if the API wraps the restaurants array in a nested property
      const restaurantsData = result.data || result;
      setRestaurants(Array.isArray(restaurantsData) ? restaurantsData : []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching restaurants:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  // Function to handle click on a restaurant card, navigating to RestaurantItems page.
  const handleCardClick = (restaurantId, restaurantData) => {
    navigate(`/restaurants-all-items/${restaurantId}`, { state: restaurantData });
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="p-8 text-center">Loading restaurants...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="p-8 text-center text-red-500">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="p-8">
        <h1 className="mb-6 text-2xl font-bold">Our Restaurants</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {restaurants.length > 0 ? (
            restaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                onClick={() => handleCardClick(restaurant._id, restaurant)}
                className="overflow-hidden transition-shadow duration-300 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg"
              >
                <div className="flex items-center justify-center h-48 p-4 bg-gray-50">
                  {restaurant.image ? (
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/300?text=No+Image";
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-200">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="mb-2 text-lg font-semibold">{restaurant.name}</h2>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {restaurant.address || "No address available"}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {restaurant.phone || "No phone number available"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="py-10 text-center text-gray-500 col-span-full">
              No restaurants available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Restaurants;
