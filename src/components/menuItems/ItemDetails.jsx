import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../components/home/Navbar/Navbar";

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleAddToCart = () => {
    toast.success(`${item.name} added to cart!`);
  };

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/public/menu-items/${id}`);
        if (!response.ok) throw new Error("Failed to fetch item");
        
        const data = await response.json();
        setItem(data);
      } catch (error) {
        toast.error(error.message);
        navigate("/menu");
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [id, navigate]);

  if (loading) return <div className="text-center p-8">Loading...</div>;

  if (!item) return <div className="text-center p-8 text-red-500">Item not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 text-gray-600 hover:text-gray-800 flex items-center"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Menu
        </button>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Image Section - Increased size */}
            <div className="lg:w-1/2">
              <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-[4/3]">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/600?text=Image+Not+Available";
                  }}
                />
              </div>
            </div>

            {/* Details Section - Enhanced layout */}
            <div className="lg:w-1/2 space-y-8">
              <h1 className="text-4xl font-bold text-gray-900">{item.name}</h1>
              
              <div className="space-y-6">
                {/* Price Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  {item.discountPercentage > 0 ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-4">
                        <span className="text-3xl font-bold text-red-600">
                          Rs. {item.discountedPrice}
                        </span>
                        <span className="text-gray-500 line-through text-lg">
                          Rs. {item.price}
                        </span>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                          {item.discountPercentage}% OFF
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">Inclusive of all taxes</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <span className="text-3xl font-bold text-gray-900">
                        Rs. {item.price}
                      </span>
                      <p className="text-sm text-gray-500">Inclusive of all taxes</p>
                    </div>
                  )}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium">{item.category || "Uncategorized"}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Availability</p>
                    <p className={`font-medium ${item.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                      {item.isAvailable ? "In Stock" : "Out of Stock"}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Preparation Time</p>
                    <p className="font-medium">{item.preparationTime || "15-20 mins"}</p>
                  </div>
                  <div>
                     {/* Add to Cart Button */}
                  <button 
                    disabled={!item.isAvailable}
                    onClick={handleAddToCart}
                    className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-colors ${
                      item.isAvailable 
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {item.isAvailable ? "Add to Cart" : "Out of Stock"}
                  </button>
                  </div>
                </div>

                {/* Description Section */}
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description || "No description available"}
                  </p>
                </div>

                {/* Ingredients Section */}
                {item.ingredients && (
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Ingredients</h3>
                    <ul className="list-disc list-inside text-gray-600">
                      {item.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;