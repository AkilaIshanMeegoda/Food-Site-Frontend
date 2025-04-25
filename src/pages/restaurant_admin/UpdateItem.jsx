import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateItem = () => {
  const { user } = useAuthContext();
  const { id } = useParams();
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" replace />;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Burger",
    isAvailable: true,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
    "Burger",
    "Pizza",
    "Pasta",
    "Salad",
    "Drinks",
    "Dessert",
    "Fried Rice",
    "BBQ",
  ];

  useEffect(() => {
    const fetchItem = async () => {
      if (!user) return;
      try {
        const res = await fetch(`http://localhost:5001/api/menu-items/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch item");
        const data = await res.json();
        setFormData({
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category,
          isAvailable: data.isAvailable ?? true,
        });
      } catch (err) {
        toast.error("Failed to load item data");
      }
    };
    fetchItem();
  }, [id, user]);

  // Correct handleChange to support checkbox toggling
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    if (type !== "checkbox") validateField(name, newValue);
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "name":
        if (!value.trim()) error = "Name is required";
        else if (value.length < 3) error = "Name must be at least 3 characters";
        break;
      case "description":
        if (!value.trim()) error = "Description is required";
        break;
      case "price":
        const num = parseFloat(value);
        if (isNaN(num) || num <= 0) error = "Price must be a positive number";
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.entries(formData).forEach(([field, val]) => {
      if (field !== "isAvailable") {
        const err = validateField(field, val);
        if (err) newErrors[field] = err;
      }
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length) {
      toast.error("Please fix errors before submitting");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5001/api/menu-items/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      });
      if (!res.ok) throw new Error("Update failed");
      toast.success("Item updated successfully!");
      navigate("/restaurant_admin/dashboard/manage-items");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-4xl font-extrabold mt-10 ml-5">Update Item</h1>
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Update Menu Item</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>
            {/* Description */}
            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows={3}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description}</p>
              )}
            </div>
            {/* Price & Category */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Price (Rs.)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  step="0.01"
                  min="0"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm">{errors.price}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* Availability */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isAvailable"
                id="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
                className="h-4 w-4"
              />
              <label htmlFor="isAvailable" className="ml-2 text-sm">
                Available for order
              </label>
            </div>
            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || Object.values(errors).some(Boolean)}
                className="px-4 py-2 bg-green-600 text-white rounded disabled:bg-green-300"
              >
                {loading ? "Updating..." : "Update Item"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateItem;
