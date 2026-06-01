import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { createProduct } from "../../api/productApi";
import { getUserRole } from "../../utils/auth";

function ProductCreate() {
  const navigate = useNavigate();

  const role = getUserRole();
  const isAdmin = role === "admin";

  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    description: "",
    price: "",
    quantity_in_stock: "",
  });

  const [loading, setLoading] = useState(false);

  const skuRegex = /^[A-Z0-9._-]+$/;

  // -----------------------------
  // BLOCK NON-ADMIN ACCESS
  // -----------------------------
  useEffect(() => {
    if (!isAdmin) {
      toast.error("Access denied: Admin only");
      navigate("/dashboard");
    }
  }, [isAdmin, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "sku"
          ? value.toUpperCase()
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // HARD GUARD (security)
    if (!isAdmin) {
      toast.error("Unauthorized");
      return;
    }

    if (!formData.sku.trim()) {
      return toast.error("SKU is required");
    }

    if (!skuRegex.test(formData.sku)) {
      return toast.error(
        "Invalid SKU format (A-Z, 0-9, '.', '_' , '-')"
      );
    }

    if (!formData.name.trim()) {
      return toast.error("Product name is required");
    }

    if (!formData.price || Number(formData.price) <= 0) {
      return toast.error("Price must be greater than 0");
    }

    if (
      formData.quantity_in_stock === "" ||
      Number(formData.quantity_in_stock) < 0
    ) {
      return toast.error("Invalid stock quantity");
    }

    try {
      setLoading(true);

      const payload = {
        sku: formData.sku.trim(),
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        price: Number(formData.price),
        quantity_in_stock: Number(formData.quantity_in_stock),
      };

      await createProduct(payload);

      toast.success("Product created successfully");

      navigate("/products");
    } catch (error) {
      console.error(error?.response?.data);

      const detail = error?.response?.data?.detail;

      if (Array.isArray(detail)) {
        detail.forEach((err) => toast.error(err.msg));
      } else {
        toast.error(detail || "Failed to create product");
      }
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // BLOCK UI FOR NON-ADMIN
  // -----------------------------
  if (!isAdmin) {
    return (
      <div className="p-6 text-red-600 font-semibold">
        Redirecting... Admin access required.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">
          Create Product (Admin Only)
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* SKU */}
          <div>
            <label className="block text-sm font-medium mb-2">
              SKU
            </label>

            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              placeholder="SKU-001"
              required
            />
          </div>

          {/* NAME */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Product Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>

            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* PRICE */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Price
            </label>

            <input
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              required
            />
          </div>

          {/* STOCK */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Quantity In Stock
            </label>

            <input
              type="number"
              name="quantity_in_stock"
              value={formData.quantity_in_stock}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              required
            />
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg disabled:bg-blue-400"
            >
              {loading ? "Creating..." : "Create Product"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/products")}
              className="border px-6 py-3 rounded-lg"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default ProductCreate;