import { useState } from "react";

const categories = [
  { name: "All Chicken Dish", icon: "🍗", key: "chicken" },
  { name: "All Seafood Dish", icon: "🐟", key: "seafood" },
  { name: "Burgers & Pizza", icon: "🍔", key: "burgers_pizza" },
  { name: "Rice", icon: "🍚", key: "rice" },
];

const restaurants = {
  chicken: [
    {
      name: "Grilled Chicken",
      image: "grilled_chicken.jpg",
      rating: 4.5,
      price: "Rs 1500.00",
    },
    {
      name: "Chicken Curry",
      image: "chicken_curry.jpg",
      rating: 4.8,
      price: "Rs.1000",
    },
    {
      name: "Chicken Biryani",
      image: "chicken_biryani.jpg",
      rating: 4.6,
      price: "Rs.1000",
    },
    {
      name: "Fried Chicken",
      image: "fried_chicken.jpg",
      rating: 4.7,
      price: "Rs.1000",
    },
  ],
  seafood: [
    {
      name: "Grilled Salmon",
      image: "grilled_salmon.jpg",
      rating: 4.9,
      price: "Rs.1000",
    },
    {
      name: "Shrimp Pasta",
      image: "shrimp_pasta.jpg",
      rating: 4.7,
      price: "Rs.1000",
    },
    {
      name: "Lobster Roll",
      image: "lobster_roll.jpg",
      rating: 4.8,
      price: "Rs.1000",
    },
    {
      name: "Fried Fish",
      image: "fried_fish.jpg",
      rating: 4.5,
      price: "Rs.1000",
    },
  ],
  burgers_pizza: [
    {
      name: "Cheese Burger",
      image: "cheese_burger.jpg",
      rating: 4.2,
      price: "Rs.1000",
    },
    {
      name: "Pepperoni Pizza",
      image: "pepperoni_pizza.jpg",
      rating: 4.6,
      price: "Rs.1000",
    },
    {
      name: "Veggie Burger",
      image: "veggie_burger.jpg",
      rating: 4.4,
      price: "Rs.1000",
    },
    {
      name: "BBQ Chicken Pizza",
      image: "bbq_chicken_pizza.jpg",
      rating: 4.5,
      price: "Rs.1000",
    },
  ],
  rice: [
    {
      name: "Fried Rice",
      image: "fried_rice.jpg",
      rating: 4.3,
      price: "Rs.1000",
    },
    {
      name: "Steamed Rice & Curry",
      image: "steamed_rice_curry.jpg",
      rating: 4.6,
      price: "Rs.1000",
    },
    {
      name: "Seafood Paella",
      image: "seafood_paella.jpg",
      rating: 4.8,
      price: "Rs.1000",
    },
    {
      name: "Vegetable Pulao",
      image: "vegetable_pulao.jpg",
      rating: 4.5,
      price: "Rs.1000",
    },
  ],
};

const FoodCategory = () => {
  const [selectedCategory, setSelectedCategory] = useState("chicken");

  return (
    <div className="flex gap-8 p-6">
      <div className="w-1/4">
        <h2 className="text-2xl font-bold ">Quick Pick Restaurants</h2>
        <hr className="mb-8 border-2 rounded-full border-main-color" />
        <div className="flex flex-col gap-8">
          {categories.map((category) => (
            <button
              key={category.key}
              className={`flex items-center gap-2 px-6 py-6 rounded-full border transition-all ${
                selectedCategory === category.key
                  ? "bg-orange-500 text-white"
                  : "bg-white shadow-lg border-gray-300 hover:shadow-2xl"
              }`}
              onClick={() => setSelectedCategory(category.key)}
            >
              <span className="text-lg">{category.icon}</span>
              <span className="font-semibold">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid w-3/4 grid-cols-2 gap-6">
        {restaurants[selectedCategory].map((restaurant, index) => (
          <div key={index} className="p-4 bg-white rounded-lg shadow-lg">
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="object-cover w-full h-40 rounded-lg"
            />
            <h3 className="mt-2 font-semibold text-gray-900">
              {restaurant.name}
            </h3>
            <div className="flex flex-row justify-between">
              <p className="font-semibold text-orange-500">
                ⭐ {restaurant.rating}
              </p>
              <p> {restaurant.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodCategory;
