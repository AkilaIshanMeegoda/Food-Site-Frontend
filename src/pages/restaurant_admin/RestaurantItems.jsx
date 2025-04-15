import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/home/Navbar/Navbar";
import MenuItemCard from "../../components/menuItems/MenuItemCard"; // adjust the path as needed

const RestaurantItems = () => {
  const { id } = useParams(); // restaurant id from URL
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch menu items for the restaurant
  const fetchMenuItems = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/public/restaurants/${id}/menu-items`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      const itemsData = result.data || result;
      setMenuItems(Array.isArray(itemsData) ? itemsData : []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching restaurant menu items:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, [id]);

  // Handler when a menu item card is clicked
  const handleMenuItemClick = (menuItemId, menuItemData) => {
    navigate(`/view-menuItem/${menuItemId}`, { state: menuItemData });
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="p-8 text-center">Loading menu items...</div>
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
        <h1 className="mb-6 text-2xl font-bold">Restaurant Menu Items</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {menuItems.length > 0 ? (
            menuItems.map((menuItem) => (
              <MenuItemCard
                key={menuItem._id}
                item={menuItem}
                onCardClick={handleMenuItemClick}
              />
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

export default RestaurantItems;
