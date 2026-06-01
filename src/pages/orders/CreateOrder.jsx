import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { createOrder } from "../../api/orderApi";
import { getProducts } from "../../api/productApi";
import { getUserId, getUserRole } from "../../utils/auth";

const CART_KEY = "inventory_cart_v1";
const MAX_QTY = 5;

function CreateOrder() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const customerId = getUserId();
  const role = getUserRole();

  const isAdmin = role === "admin";

  // -----------------------------
  // LOAD DATA + RESTORE CART
  // -----------------------------
  useEffect(() => {
    loadProducts();
    hydrateCart();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch {
      toast.error("Failed to load products");
    }
  };

  const hydrateCart = () => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setCart(parsed);
      }
    } catch {
      localStorage.removeItem(CART_KEY);
    }
  };

  // -----------------------------
  // SYNC CART TO LOCALSTORAGE
  // -----------------------------
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  // -----------------------------
  // ADD TO CART (SAFE + STOCK CHECK)
  // -----------------------------
  const addToCart = (product) => {
    if (isAdmin) {
      toast.error("Admins cannot place orders");
      return;
    }

    setCart((prev) => {
      const existing = prev.find((p) => p.product_id === product.id);

      const stockLimit = product.quantity_in_stock;

      if (existing) {
        const newQty = existing.quantity + 1;

        if (newQty > MAX_QTY) {
          toast.error("Max 5 quantity allowed per product");
          return prev;
        }

        if (newQty > stockLimit) {
          toast.error("Not enough stock available");
          return prev;
        }

        return prev.map((p) =>
          p.product_id === product.id
            ? { ...p, quantity: newQty }
            : p
        );
      }

      if (stockLimit < 1) {
        toast.error("Out of stock");
        return prev;
      }

      return [
        ...prev,
        {
          product_id: product.id,
          name: product.name,
          price: Number(product.price),
          quantity: 1,
          stock_limit: stockLimit,
        },
      ];
    });
  };

  // -----------------------------
  // UPDATE QUANTITY (SAFE CLAMP)
  // -----------------------------
  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.product_id !== id) return item;

        const stockLimit = item.stock_limit || MAX_QTY;

        const newQty = item.quantity + delta;

        if (newQty < 1) {
          toast.error("Minimum quantity is 1");
          return item;
        }

        if (newQty > MAX_QTY) {
          toast.error("Max 5 quantity allowed");
          return item;
        }

        if (newQty > stockLimit) {
          toast.error("Not enough stock available");
          return item;
        }

        return { ...item, quantity: newQty };
      })
    );
  };

  const removeItem = (id) => {
    setCart((prev) =>
      prev.filter((item) => item.product_id !== id)
    );
  };

  const getTotal = () =>
    cart
      .reduce((sum, i) => sum + Number(i.price) * i.quantity, 0)
      .toFixed(3);

  // -----------------------------
  // ORDER SUBMIT (STRICT VALIDATION)
  // -----------------------------
  const handleSubmit = async () => {
    if (isAdmin) {
      toast.error("Admins cannot place orders");
      return;
    }

    if (!customerId) {
      toast.error("User not authenticated");
      return;
    }

    if (cart.length === 0) {
      toast.error("Cart is empty. Add products first.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        customer_id: customerId,
        items: cart.map((i) => ({
          product_id: i.product_id,
          quantity: i.quantity,
        })),
      };

      await createOrder(payload);

      toast.success("Order placed successfully");

      // CLEANUP
      setCart([]);
      localStorage.removeItem(CART_KEY);

      navigate("/orders");
    } catch (err) {
      console.error(err?.response?.data);
      toast.error("Order failed");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="max-w-5xl mx-auto p-6 grid md:grid-cols-2 gap-6">

      {/* BLOCK ADMIN */}
      {isAdmin && (
        <div className="col-span-2 bg-red-100 text-red-700 p-3 rounded">
          Admin users are not allowed to place orders
        </div>
      )}

      {/* PRODUCTS */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Products</h2>

        {products.map((p) => (
          <div
            key={p.id}
            className="border p-3 rounded flex justify-between items-center mb-2"
          >
            <div>
              <p className="font-medium">{p.name}</p>
              <p className="text-sm text-gray-500">
                ₹{Number(p.price).toFixed(3)}
              </p>
            </div>

            <button
              onClick={() => addToCart(p)}
              disabled={isAdmin}
              className={`px-3 py-1 rounded text-white ${
                isAdmin ? "bg-gray-400" : "bg-blue-600"
              }`}
            >
              Add
            </button>
          </div>
        ))}
      </div>

      {/* CART */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Cart</h2>

        {cart.length === 0 ? (
          <p className="text-gray-500">No products added</p>
        ) : (
          <>
            {cart.map((item) => (
              <div key={item.product_id} className="border p-3 mb-2 rounded">
                <p className="font-medium">{item.name}</p>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex gap-2 items-center">
                    <button onClick={() => updateQuantity(item.product_id, -1)}>
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button onClick={() => updateQuantity(item.product_id, 1)}>
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.product_id)}
                    className="text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {/* TOTAL */}
            <div className="border-t pt-3 mt-4">
              <p className="font-bold text-lg">
                Total: ₹{getTotal()}
              </p>

              <button
                onClick={handleSubmit}
                disabled={loading || cart.length === 0 || isAdmin}
                className={`w-full mt-3 py-2 rounded text-white ${
                  loading || cart.length === 0 || isAdmin
                    ? "bg-gray-400"
                    : "bg-green-600"
                }`}
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CreateOrder;