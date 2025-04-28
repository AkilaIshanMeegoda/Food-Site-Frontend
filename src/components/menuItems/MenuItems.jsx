import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/home/Navbar/Navbar";
import MenuItemCard from "../menuItems/MenuItemCard";
// show all menu items in a grid layout
const MenuItems = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = async () => {
    try {
      const response = await fetch("http://localhost:8000/restaurantApi/public/all-menu-items");
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.length > 0 ? (
            items.map((item) => (
              <MenuItemCard 
                key={item._id}
                item={item} 
                onCardClick={handleCardClick} 
              />
            ))
          ) : (
            <p className="py-10 text-center text-gray-500 col-span-full">
              No menu items available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItems;
