import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getDashboardData } from "../../api/dashboardApi";

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      const result = await getDashboardData();
      setData(result);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 text-red-500">
        No dashboard data found
      </div>
    );
  }

  const cards = [
    {
      title: "Total Products",
      value: data.total_products,
    },
    {
      title: "Total Customers",
      value: data.total_customers,
    },
    {
      title: "Total Orders",
      value: data.total_orders,
    },
    {
      title: "Low Stock Products",
      value: data.low_stock_products?.length || 0,
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Dashboard
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-xl shadow p-6"
          >
            <h3 className="text-gray-500 text-sm">
              {card.title}
            </h3>

            <p className="text-3xl font-bold mt-3">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* LOW STOCK */}
      <div className="mt-8 bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">
          Low Stock Products (<span className="text-red-600">5</span> items)
        </h2>

        {data.low_stock_products?.length ? (
          <div className="space-y-2">
            {data.low_stock_products.map((item) => (
              <li key={item.id} className="flex justify-between border-b pb-2">
                <span>{item.name}</span>
                <span className="text-red-600 font-semibold">
                  {item.quantity_in_stock}
                </span>
              </li>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            No low stock products
          </p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;