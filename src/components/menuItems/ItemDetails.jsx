import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../components/home/Navbar/Navbar";
import { useCart } from "../../context/CartContext";
import { useAuthContext } from "../../hooks/useAuthContext";

const ItemDetails = () => {
  const { id } = useParams();
  const { user } = useAuthContext();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleAddToCart = (e, item) => {
    e.stopPropagation();
    console.log(item);

    if (!item.isAvailable) return;

    const restaurantId = item.restaurantId || props.restaurantId;
    const restaurantName = item.restaurantName;

    if (!user || user.role !== "customer") {
      toast.error("Please login to add items to cart.");
      navigate("/login");
    } else {
      const success = addToCart(item, restaurantId, restaurantName);

      if (success) {
        toast.success(`${item.name} added to cart!`);
      }
    }
  };

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/restaurantApi/public/menu-items/${id}`
        );
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

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  if (!item)
    return <div className="p-8 text-center text-red-500">Item not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center mb-6 text-gray-600 hover:text-gray-800"
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Menu
        </button>

        <div className="p-6 bg-white rounded-lg shadow-lg">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Image Section - Increased size */}
            <div className="lg:w-1/2">
              <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-[4/3]">
                <img
                  src={item.image}
                  alt={item.name}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/600?text=Image+Not+Available";
                  }}
                />
              </div>
            </div>

            {/* Details Section - Enhanced layout */}
            <div className="space-y-8 lg:w-1/2">
              <h1 className="text-4xl font-bold text-gray-900">{item.name}</h1>

              <div className="space-y-6">
                {/* Price Section */}
                <div className="p-4 rounded-lg bg-gray-50">
                  {item.discountPercentage > 0 ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-4">
                        <span className="text-3xl font-bold text-red-600">
                          Rs. {item.discountedPrice}
                        </span>
                        <span className="text-lg text-gray-500 line-through">
                          Rs. {item.price}
                        </span>
                        <span className="px-3 py-1 text-sm text-green-800 bg-green-100 rounded-full">
                          {item.discountPercentage}% OFF
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Inclusive of all taxes
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <span className="text-3xl font-bold text-gray-900">
                        Rs. {item.price}
                      </span>
                      <p className="text-sm text-gray-500">
                        Inclusive of all taxes
                      </p>
                    </div>
                  )}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-gray-50">
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium">
                      {item.category || "Uncategorized"}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50">
                    <p className="text-sm text-gray-500">Availability</p>
                    <p
                      className={`font-medium ${
                        item.isAvailable ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {item.isAvailable ? "In Stock" : "Out of Stock"}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50">
                    <p className="text-sm text-gray-500">Preparation Time</p>
                    <p className="font-medium">
                      {item.preparationTime || "15-20 mins"}
                    </p>
                  </div>
                  <div>
                    {/* Add to Cart Button */}
                    <button
                      disabled={!item.isAvailable}
                      onClick={(e) => handleAddToCart(e, item)}
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
                  <p className="leading-relaxed text-gray-600">
                    {item.description || "No description available"}
                  </p>
                </div>

                {/* Ingredients Section */}
                {item.ingredients && (
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Ingredients</h3>
                    <ul className="text-gray-600 list-disc list-inside">
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
