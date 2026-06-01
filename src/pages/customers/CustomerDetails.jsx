import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";

import { getCustomerById } from "../../api/customerApi";

function CustomerDetails() {
  const { id } = useParams();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomer();
  }, []);

  const fetchCustomer = async () => {
    try {
      const data = await getCustomerById(id);
      setCustomer(data);
    } catch {
      toast.error("Failed to load customer");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="h-6 w-48 bg-gray-200 animate-pulse rounded mb-4" />
        <div className="h-40 w-full bg-gray-200 animate-pulse rounded" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-6 text-red-600">
        Customer not found
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Customer Profile
          </h1>

          <p className="text-gray-500">
            Detailed customer information
          </p>
        </div>

        <Link
          to="/customers"
          className="border px-4 py-2 rounded-lg hover:bg-gray-100"
        >
          Back
        </Link>
      </div>

      {/* Main Card */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white">
          <h2 className="text-2xl font-bold">
            {customer.full_name}
          </h2>

          <p className="opacity-90">
            Customer ID: {customer.id}
          </p>
        </div>

        {/* Details Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email */}
          <div className="border rounded-xl p-4">
            <p className="text-sm text-gray-500">
              Email
            </p>

            <p className="text-blue-600 font-medium mt-1">
              {customer.email}
            </p>
          </div>

          {/* Phone */}
          <div className="border rounded-xl p-4">
            <p className="text-sm text-gray-500">
              Phone
            </p>

            <p className="font-medium mt-1">
              {customer.phone}
            </p>
          </div>

          {/* Address */}
          <div className="border rounded-xl p-4 md:col-span-2">
            <p className="text-sm text-gray-500">
              Address
            </p>

            <p className="mt-1 text-gray-700">
              {customer.address || (
                <span className="text-gray-400">
                  No address provided
                </span>
              )}
            </p>
          </div>

          {/* Created At */}
          <div className="border rounded-xl p-4">
            <p className="text-sm text-gray-500">
              Created At
            </p>

            <p className="mt-1 text-gray-700">
              {new Date(
                customer.created_at
              ).toLocaleString()}
            </p>
          </div>

          {/* Updated At */}
          <div className="border rounded-xl p-4">
            <p className="text-sm text-gray-500">
              Updated At
            </p>

            <p className="mt-1 text-gray-700">
              {new Date(
                customer.updated_at
              ).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerDetails;