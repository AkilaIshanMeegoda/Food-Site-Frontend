import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthContext } from "../../hooks/useAuthContext";
import Navbar from "../../components/home/Navbar/Navbar";
import { FaArrowLeft, FaEdit, FaTrash } from "react-icons/fa";
// restaurant owner side view item details page for viewing menu item details
const ViewItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
  // fetch item details from the API
  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8000/restaurantApi/menu-items/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch item");
        }

        const data = await response.json();
        setItem(data);
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load item details");
      } finally {
        setLoading(false);
      }
    };

    if (user && id) {
      fetchItem();
    }
  }, [id, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="p-8 text-center">
          <p className="text-xl text-red-500">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 mt-4 text-white bg-blue-600 rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="p-8 text-center">
          <p className="text-xl">Item not found</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 mt-4 text-white bg-blue-600 rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl p-4 mx-auto md:p-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center mb-6 text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="mr-2" /> Back to Menu
        </button>

        <div className="overflow-hidden bg-white rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row">
            <div className="flex justify-center p-4 bg-gray-100 md:w-1/2">
              <img
                src={item.image || "/placeholder-food.jpg"}
                alt={item.name}
                className="object-cover w-full rounded-lg h-80"
                onError={(e) => {
                  e.target.src = "/placeholder-food.jpg";
                }}
              />
            </div>

            <div className="p-6 md:w-1/2">
              <h1 className="mb-4 text-3xl font-bold">{item.name}</h1>
              <div className="mb-6">
                <span className="text-2xl font-bold text-red-600">
                  Rs. {item.price}
                </span>
                <span className="px-3 py-1 ml-4 text-sm text-blue-800 bg-blue-100 rounded-full">
                  {item.category}
                </span>
              </div>

              <div className="mb-6">
                <h2 className="mb-2 text-xl font-semibold">Description</h2>
                <p className="text-gray-700">
                  {item.description || "No description available"}
                </p>
              </div>

              <div className="flex flex-col gap-4 mb-6 md:flex-row md:gap-12">
                
                <div>
                  <h2 className="mb-1 text-lg font-semibold">
                    Preparation Time
                  </h2>
                  <p className="text-gray-700">
                    {item.preparationTime || "Not specified"}
                  </p>
                </div>

                <div>
                  <h2 className="mb-1 text-lg font-semibold">Availability</h2>
                  <p
                    className={`text-gray-700 ${
                      item.isAvailable ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {item.isAvailable ? "Available" : "Not Available"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewItemDetails;
