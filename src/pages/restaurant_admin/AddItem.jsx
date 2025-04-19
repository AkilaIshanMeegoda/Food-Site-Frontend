import React, { useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import Navbar from "../../components/home/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner } from "flowbite-react";
import { storage } from "./../../utils/firebaseConfig"; // Your firebase config should export `storage`

const AddItem = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    preparationTime: "",
    price: "",
    category: "Burger",
    image: "",
    isAvailable: false,
  });

  const categories = ["Burger", "Pizza", "Pasta", "Drinks", "Snacks", "BBQ", "Desserts"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (value.trim() === "") {
      setErrors((prev) => ({ ...prev, [name]: `${name} is required` }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };
  
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const storageRef = storage.ref();
    const fileRef = storageRef.child(`items/${Date.now()}-${file.name}`);

    try {
      await fileRef.put(file);
      const downloadURL = await fileRef.getDownloadURL();
      setFormData((prev) => ({ ...prev, image: downloadURL }));
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const itemObj = {
      ...formData,
      price: parseFloat(formData.price),
    };

    try {
      const response = await fetch("http://localhost:5001/api/menu-items/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(itemObj),
      });

      if (response.ok) {
        toast.success("Item added successfully!");
        navigate("/shopOwner/dashboard/view-items");
      } else {
        toast.error("Failed to add item.");
      }
    } catch (err) {
      toast.error("Server error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      <Navbar />
      <div className="max-w-4xl mx-auto mt-16 p-8 bg-white shadow rounded-3xl">
        <h2 className="text-2xl font-bold mb-6">Add New Item</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="name"
            placeholder="Item Name"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            required
          />
          {errors.name && <p className="text-red-500">{errors.name}</p>}

          <input
            type="text"
            name="preparationTime"
            placeholder="Preparation Time"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            required
          />
          {errors.preparationTime && <p className="text-red-500">{errors.preparationTime}</p>}

          <textarea
            name="description"
            rows={4}
            placeholder="Description"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            required
          />
          {errors.description && <p className="text-red-500">{errors.description}</p>}

          <input
            type="number"
            name="price"
            placeholder="Price"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            required
          />
          {errors.price && <p className="text-red-500">{errors.price}</p>}

          <select
            name="category"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            value={formData.category}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="availability"
              checked={formData.availability}
              onChange={handleCheckboxChange}
            />
            <span>Available</span>
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full"
          />
          {uploading && (
            <div className="flex items-center gap-2">
              <Spinner size="sm" /> Uploading...
            </div>
          )}

          <button
            type="submit"
            disabled={uploading || loading || !formData.image}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Item"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItem;
