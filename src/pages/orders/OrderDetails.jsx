import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { getOrderById } from "../../api/orderApi";

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, []);

  const loadOrder = async () => {
    try {
      const data = await getOrderById(id);
      setOrder(data);
    } catch {
      toast.error("Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-3">
        <div className="h-6 w-52 bg-gray-200 animate-pulse rounded" />
        <div className="h-40 w-full bg-gray-200 animate-pulse rounded" />
      </div>
    );
  }

  if (!order) {
    return <div className="p-6 text-red-600">Order not found</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Order Details
          </h1>
          <p className="text-gray-500">
            Full order breakdown and items
          </p>
        </div>

        <Link
          to="/orders"
          className="border px-4 py-2 rounded-lg hover:bg-gray-100"
        >
          Back
        </Link>
      </div>

      {/* Order Summary Card */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">
                Order #{order.id.slice(0, 8)}
              </h2>

              <p className="opacity-90">
                Customer ID: {order.customer_id}
              </p>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                order.status
              )} bg-white`}
            >
              {order.status}
            </span>
          </div>
        </div>

        {/* Summary */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-xl p-4">
            <p className="text-sm text-gray-500">
              Total Amount
            </p>
            <p className="text-xl font-bold text-green-600">
              ₹{Number(order.total_amount).toLocaleString("en-IN")}
            </p>
          </div>

          <div className="border rounded-xl p-4">
            <p className="text-sm text-gray-500">
              Created At
            </p>
            <p className="font-medium">
              {formatDate(order.created_at)}
            </p>
          </div>

          <div className="border rounded-xl p-4">
            <p className="text-sm text-gray-500">
              Updated At
            </p>
            <p className="font-medium">
              {formatDate(order.updated_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white shadow rounded-2xl overflow-hidden">
        <div className="p-4 border-b font-semibold text-gray-700">
          Order Items
        </div>

        <table className="w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-4">Product ID</th>
              <th className="p-4">Quantity</th>
              <th className="p-4">Unit Price</th>
              <th className="p-4">Line Total</th>
            </tr>
          </thead>

          <tbody>
            {order.items?.length > 0 ? (
              order.items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-4 text-sm">
                    {item.product_id.slice(0, 8)}...
                  </td>

                  <td className="p-4">
                    {item.quantity}
                  </td>

                  <td className="p-4 text-green-600 font-medium">
                    ₹{Number(item.unit_price).toLocaleString("en-IN")}
                  </td>

                  <td className="p-4 font-semibold">
                    ₹{Number(item.line_total).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  No items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderDetails;