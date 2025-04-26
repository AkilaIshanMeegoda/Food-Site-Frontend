import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/home/Navbar/Navbar";
import MenuItemCard from "../../components/menuItems/MenuItemCard"; // adjust the path if needed

const CategoryItems = () => {
  const { category } = useParams(); // extract the category from the URL
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log(
    "Category from URL:", category
  )
  // Fetch menu items for the selected category
  const fetchMenuItems = async () => {
    try {
        console.log("checking category", category);
      const response = await fetch(
        `http://localhost:8000/restaurantApi/public/menu-items/category/${encodeURIComponent(category)}`
      );
      console.log("checking response", response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      // Adjust if the API wraps the items array in a nested property
      const itemsData = result.data || result;
      setMenuItems(Array.isArray(itemsData) ? itemsData : []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching menu items:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, [category]);

  // Optional: Handle click on a menu item to navigate to its details page
  const handleMenuItemClick = (menuItemId, menuItemData) => {
    navigate(`/view-menuItem/${menuItemId}`, { state: menuItemData });
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="p-8 text-center">Loading menu items for "{category}"...</div>
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
        <h1 className="mb-6 text-2xl font-bold">
          Menu Items for "{category}"
        </h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {menuItems.length > 0 ? (
            menuItems.map((menuItem) => (
              <MenuItemCard
                key={menuItem._id}
                item={menuItem}
                onCardClick={handleMenuItemClick}
              />
            ))
          ) : (
            <p className="py-10 text-center text-gray-500 col-span-full">
              No menu items available for this category.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryItems;
