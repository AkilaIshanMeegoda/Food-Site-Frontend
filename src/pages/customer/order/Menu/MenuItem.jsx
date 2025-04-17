// src/components/Menu/MenuItem.js
const MenuItem = ({ item, onAddToCart }) => {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-32 object-cover rounded mb-3"
        />
        <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{item.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-blue-600 font-bold">Rs. {item.price.toFixed(2)}</span>
          <button 
            onClick={onAddToCart}
            className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add
          </button>
        </div>
      </div>
    );
  };
  
  export default MenuItem;