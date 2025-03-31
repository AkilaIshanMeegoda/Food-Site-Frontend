import React from 'react'

const categories = [
  { name: "Fast Food", icon: "🌭" },
  { name: "Non-Veg", icon: "🍗" },
  { name: "Dessert", icon: "🍰" },
  { name: "Cocktails", icon: "🍸" },
];

const HomeContainer = () => {
  return (
    <div className="flex justify-center gap-8 p-4 my-20 ">
      {categories.map((category, index) => (
        <button
        key={index}
        className="flex items-center gap-2 px-12 py-6 transition-all bg-white rounded-full shadow-md hover:shadow-lg hover:bg-main-color hover:transform hover:scale-95"
      >
          <span className="text-3xl">{category.icon}</span>
          <span className="text-2xl font-medium text-gray-900">{category.name}</span>
        </button>
      ))}
    </div>
  )
}

export default HomeContainer