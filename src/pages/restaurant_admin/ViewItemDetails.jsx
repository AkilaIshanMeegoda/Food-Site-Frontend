import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthContext } from "../../hooks/useAuthContext";
import Navbar from "../../components/home/Navbar/Navbar";
import { FaArrowLeft, FaEdit, FaTrash } from "react-icons/fa";

const ViewItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/restaurantApi/menu-items/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });

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

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const response = await fetch(`http://localhost:3000/inventory/delete-item/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete item");
        }

        toast.success("Item deleted successfully");
        navigate("/manage-items");
      } catch (err) {
        toast.error("Failed to delete item");
      }
    }
  };

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
                <span className="text-2xl font-bold text-red-600">Rs. {item.price}</span>
                <span className="px-3 py-1 ml-4 text-sm text-blue-800 bg-blue-100 rounded-full">
                  {item.category}
                </span>
              </div>
              
              <div className="mb-6">
                <h2 className="mb-2 text-xl font-semibold">Description</h2>
                <p className="text-gray-700">{item.description || "No description available"}</p>
              </div>

              {/* {user?.role === "restaurant_admin" && (
                <div className="flex mt-6 space-x-4">
                  <button
                    onClick={() => navigate(`/update-item/${id}`)}
                    className="flex items-center px-4 py-2 text-white bg-yellow-500 rounded hover:bg-yellow-600"
                  >
                    <FaEdit className="mr-2" /> Edit Item
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                  >
                    <FaTrash className="mr-2" /> Delete Item
                  </button>
                </div>
              )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewItemDetails;