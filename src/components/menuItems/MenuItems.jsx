import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/home/Navbar/Navbar";

const MenuItems = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = async () => {
    try {
      const response = await fetch(
        "http://localhost:5001/api/public/all-menu-items"
      );
      console.log("Raw response:", response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Parsed response data:", result);

      // Handle different possible response structures
      const itemsData = result.data || result.items || result || [];
      setItems(Array.isArray(itemsData) ? itemsData : []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching items:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleCardClick = (itemId) => {
    const selectedItem = items.find((item) => item._id === itemId);
    navigate(`/view-menuItem/${itemId}`, { state: selectedItem });
  };

  useEffect(() => {
    fetchItems();
  }, []);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="p-8 text-center">Loading items...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="p-8 text-center text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div className="p-8">
        <h1 className="mb-6 text-2xl font-bold">Our Menu</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.length > 0 ? (
            items.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                onClick={() => handleCardClick(item._id)}
              >
                <div className="p-4 h-48 flex items-center justify-center bg-gray-50">
                  {item.image ? (
                    <img
                      className="object-cover w-full h-full" // Changed from object-contain
                      src={item.image}
                      alt={item.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/300?text=No+Image";
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
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full py-10">
              No menu items available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItems;
