import React, { useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import Navbar from "../../components/home/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner } from "flowbite-react";
import { storage } from "./../../utils/firebaseConfig"; // Your firebase config should export `storage`
import imageCompression from 'browser-image-compression';

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
  
    try {
      // Compress the image if larger than 256KB
      let compressedFile = file;
      if (file.size > 256 * 1024) {
        const options = {
          maxSizeMB: 0.25, // max 256KB
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        compressedFile = await imageCompression(file, options);
      }
  
      const metadata = {
        contentType: compressedFile.type,
      };
  
      const storageRef = storage.ref();
      const fileRef = storageRef.child(`items/${Date.now()}-${compressedFile.name}`);
  
      await fileRef.put(compressedFile, metadata); // Add metadata to avoid CORS issues
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
      const response = await fetch("http://localhost:8000/restaurantApi/menu-items/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(itemObj),
      });

      if (response.ok) {
        toast.success("Item added successfully!");
        navigate("/restaurant_admin/dashboard/manage-items");
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
    <div className="min-h-screen pb-16 bg-gray-100">
      <Navbar />
      <div className="max-w-4xl p-8 mx-auto mt-16 bg-white shadow rounded-3xl">
        <h2 className="mb-6 text-2xl font-bold">Add New Item</h2>
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
              name="isAvailable"
              checked={formData.isAvailable}
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
            className="px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Item"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItem;
