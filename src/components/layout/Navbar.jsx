import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b flex justify-between items-center px-6">
      <h1 className="font-semibold text-xl">
        Inventory Management
      </h1>

      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </header>
  );
}

export default Navbar;