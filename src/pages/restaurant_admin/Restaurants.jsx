import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/home/Navbar/Navbar"; // update the path if needed

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch restaurants from the API endpoint.
  const fetchRestaurants = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/public/restaurants");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();

      // Assuming the API returns an array of restaurants directly.
      // If your response contains the data in a nested property (like result.data),
      // adjust the assignment accordingly.
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
    // Navigate to /restaurant/{restaurantId}.
    // This route should render your RestaurantItems page.
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {restaurants.length > 0 ? (
            restaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                onClick={() => handleCardClick(restaurant._id, restaurant)}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              >
                <div className="p-4 h-48 flex items-center justify-center bg-gray-50">
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
                    <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-500">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-2">{restaurant.name}</h2>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {restaurant.address || "No address available"}
                  </p>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {restaurant.phone || "No phone number available"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full py-10">
              No restaurants available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Restaurants;
