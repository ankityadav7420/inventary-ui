import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { createCustomer } from "../../api/customerApi";
import { getUserRole } from "../../utils/auth";

function CustomerCreate() {
  const navigate = useNavigate();

  const role = getUserRole();
  const isAdmin = role === "admin";

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
  });

  // -----------------------------
  // BLOCK NON-ADMIN USERS
  // -----------------------------
  useEffect(() => {
    if (!isAdmin) {
      toast.error("Access denied: Admin only page");
      navigate("/dashboard");
    }
  }, [isAdmin, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // HARD GUARD (security layer)
    if (!isAdmin) {
      toast.error("Unauthorized");
      return;
    }

    // validation
    if (!formData.full_name.trim()) {
      return toast.error("Full name is required");
    }

    if (!formData.email.trim()) {
      return toast.error("Email is required");
    }

    if (!formData.phone.trim()) {
      return toast.error("Phone is required");
    }

    try {
      setLoading(true);

      const payload = {
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim() || null,
      };

      await createCustomer(payload);

      toast.success("Customer created successfully");

      navigate("/customers");
    } catch (error) {
      console.error(error?.response?.data);

      const detail = error?.response?.data?.detail;

      if (Array.isArray(detail)) {
        detail.forEach((err) => toast.error(err.msg));
      } else {
        toast.error(detail || "Failed to create customer");
      }
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // OPTIONAL: LOADING GUARD
  // -----------------------------
  if (!isAdmin) {
    return (
      <div className="p-6 text-red-600 font-semibold">
        Redirecting... Admin access required.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white shadow rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-6">
          Create Customer (Admin Only)
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full Name */}
          <div>
            <label className="block mb-2 font-medium">
              Full Name
            </label>

            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-2 font-medium">
              Phone
            </label>

            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              required
            />
          </div>

          {/* Address */}
          <div>
            <label className="block mb-2 font-medium">
              Address
            </label>

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              rows={3}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg disabled:bg-blue-400"
            >
              {loading ? "Saving..." : "Save Customer"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/customers")}
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

export default CustomerCreate;