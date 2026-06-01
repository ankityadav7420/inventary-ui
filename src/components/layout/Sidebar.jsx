import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
} from "lucide-react";

function Sidebar() {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path;

  const linkClass = (path) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg transition ${
      isActive(path)
        ? "bg-blue-600 text-white"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

  const sectionTitle =
    "flex items-center gap-2 text-slate-400 uppercase text-xs font-semibold mt-6 mb-2";

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-5 flex flex-col">
      {/* Logo */}
      <h2 className="text-2xl font-bold mb-8 text-white">
        Inventory System
      </h2>

      <nav className="flex flex-col gap-1">

        {/* Dashboard */}
        <Link to="/dashboard" className={linkClass("/dashboard")}>
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        <div className={sectionTitle}>
          <Package size={14} />
          Product Management
        </div>

        <Link to="/products" className={linkClass("/products")}>
          Product List
        </Link>

        <Link
          to="/products/create"
          className={linkClass("/products/create")}
        >
          Add Product
        </Link>

        <div className={sectionTitle}>
          <Users size={14} />
          Customer Management
        </div>

        <Link to="/customers" className={linkClass("/customers")}>
          Customer List
        </Link>

        <Link
          to="/customers/create"
          className={linkClass("/customers/create")}
        >
          Add Customer
        </Link>

        <div className={sectionTitle}>
          <ShoppingCart size={14} />
          Order Management
        </div>

        <Link to="/orders" className={linkClass("/orders")}>
          Orders List
        </Link>

        <Link to="/orders/create" className={linkClass("/orders/create")}>
          Create Order
        </Link>
      </nav>
    </aside>
  );
}

export default Sidebar;