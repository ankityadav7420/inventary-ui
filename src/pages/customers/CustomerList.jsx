import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getCustomers,
  deleteCustomer,
} from "../../api/customerApi";

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");



  const fetchCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch {
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);
  
  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this customer?");
    if (!ok) return;

    try {
      await deleteCustomer(id);
      toast.success("Customer deleted");

      setCustomers((prev) =>
        prev.filter((c) => c.id !== id)
      );
    } catch {
      toast.error("Delete failed");
    }
  };

  const filtered = customers.filter((c) => {
    const query = search.toLowerCase();

    return (
      c.full_name?.toLowerCase().includes(query) ||
      c.email?.toLowerCase().includes(query) ||
      c.phone?.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-6 w-48 bg-gray-200 animate-pulse rounded" />
        <div className="h-10 w-full bg-gray-200 animate-pulse rounded" />
        <div className="h-64 w-full bg-gray-200 animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Customers
        </h1>

        <div className="flex gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers..."
            className="border px-4 py-2 rounded-lg w-64 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <Link
            to="/customers/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
          >
            Add Customer
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-4">Customer</th>
              <th className="p-4">Contact</th>
              <th className="p-4">Address</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length > 0 ? (
              filtered.map((c) => (
                <tr
                  key={c.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  {/* NAME */}
                  <td className="p-4">
                    <div className="font-semibold text-gray-800">
                      {c.full_name}
                    </div>

                    <div className="text-xs text-gray-400">
                      ID: {c.id.slice(0, 8)}...
                    </div>
                  </td>

                  {/* CONTACT */}
                  <td className="p-4 space-y-1">
                    <div className="text-blue-600">
                      {c.email}
                    </div>

                    <div className="text-sm bg-gray-100 inline-block px-2 py-1 rounded">
                      {c.phone}
                    </div>
                  </td>

                  {/* ADDRESS */}
                  <td className="p-4 text-gray-600">
                    {c.address || (
                      <span className="text-gray-400">
                        No address
                      </span>
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td className="p-4">
                    <div className="flex gap-4">
                      <Link
                        to={`/customers/${c.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </Link>

                      <button
                        onClick={() => handleDelete(c.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-10 text-gray-500"
                >
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-4 text-sm text-gray-500">
        Total:{" "}
        <span className="font-semibold">
          {filtered.length}
        </span>
      </div>
    </div>
  );
}

export default CustomerList;