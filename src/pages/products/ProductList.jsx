import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getProducts,
  deleteProduct,
} from "../../api/productApi";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    try {
      const data = await getProducts();

      setProducts(data);
    } catch (error) {
      toast.error("Failed to load products");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      await deleteProduct(id);

      toast.success("Product deleted successfully");

      setProducts((prevProducts) =>
        prevProducts.filter(
          (product) => product.id !== id
        )
      );
    } catch (error) {
      toast.error("Failed to delete product");
      console.error(error);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      product.sku
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <h2 className="text-lg font-medium">
          Loading products...
        </h2>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">
          Product Management
        </h1>

        <div className="flex gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by SKU or Product Name..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="border rounded-lg px-4 py-2 w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <Link
            to="/products/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg whitespace-nowrap"
          >
            Add Product
          </Link>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-4 text-left">
                SKU
              </th>

              <th className="p-4 text-left">
                Product Name
              </th>

              <th className="p-4 text-left">
                Description
              </th>

              <th className="p-4 text-left">
                Price
              </th>

              <th className="p-4 text-left">
                Stock
              </th>

              <th className="p-4 text-left">
                Created
              </th>

              <th className="p-4 text-left">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map(
                (product) => (
                  <tr
                    key={product.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-4 font-medium">
                      {product.sku}
                    </td>

                    <td className="p-4">
                      {product.name}
                    </td>

                    <td className="p-4 max-w-xs truncate">
                      {product.description ||
                        "-"}
                    </td>

                    <td className="p-4">
                      ₹
                      {Number(
                        product.price
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          product.quantity_in_stock <
                          10
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {
                          product.quantity_in_stock
                        }
                      </span>
                    </td>

                    <td className="p-4">
                      {new Date(
                        product.created_at
                      ).toLocaleDateString()}
                    </td>

                    <td className="p-4">
                      <div className="flex gap-3">
                        <Link
                          to={`/products/${product.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View
                        </Link>

                        <Link
                          to={`/products/edit/${product.id}`}
                          className="text-green-600 hover:text-green-800"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() =>
                            handleDelete(
                              product.id
                            )
                          }
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-8 text-gray-500"
                >
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-4 text-sm text-gray-600">
        Total Products:{" "}
        <strong>
          {filteredProducts.length}
        </strong>
      </div>
    </div>
  );
}

export default ProductList;