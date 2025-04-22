import React from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  { name: "Fast Food", icon: "🌭" },
  { name: "Non-Veg", icon: "🍗" },
  { name: "Dessert", icon: "🍰" },
  { name: "Cocktails", icon: "🍸" },
  { name: "BBQ", icon: "🍖" },
];

const HomeContainer = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    console.log("Category clicked:", categoryName);
    navigate(`/category-items/${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="container mx-auto px-4 my-8 lg:my-20">
      <div className="flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-8">
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => handleCategoryClick(category.name)}
            className="flex items-center justify-center w-full sm:w-auto px-6 py-4 md:px-8 lg:px-12 lg:py-6 
                     transition-all bg-white rounded-full shadow-md 
                     hover:shadow-lg hover:bg-main-color hover:transform hover:scale-95"
          >
            <span className="text-2xl md:text-3xl mr-2">{category.icon}</span>
            <span className="text-lg md:text-xl lg:text-2xl font-medium text-gray-900">
              {category.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomeContainer;