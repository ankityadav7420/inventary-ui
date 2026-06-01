import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";

import { getProductById } from "../../api/productApi";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {
    try {
      const data =
        await getProductById(id);

      setProduct(data);
    } catch {
      toast.error(
        "Failed to load product"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg font-medium">
          Loading Product...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
        Product not found.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Product Details
          </h1>

          <p className="text-gray-500 mt-1">
            View complete product
            information
          </p>
        </div>

        <div className="flex gap-3 mt-4 md:mt-0">
          <Link
            to="/products"
            className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            Back
          </Link>

          <Link
            to={`/products/edit/${product.id}`}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            Edit Product
          </Link>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Top Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <h2 className="text-2xl font-bold">
            {product.name}
          </h2>

          <p className="mt-2 opacity-90">
            SKU: {product.sku}
          </p>
        </div>

        {/* Details */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-xl p-4">
            <p className="text-sm text-gray-500">
              Product ID
            </p>

            <p className="font-medium break-all mt-1">
              {product.id}
            </p>
          </div>

          <div className="border rounded-xl p-4">
            <p className="text-sm text-gray-500">
              SKU
            </p>

            <p className="font-medium mt-1">
              {product.sku}
            </p>
          </div>

          <div className="border rounded-xl p-4">
            <p className="text-sm text-gray-500">
              Price
            </p>

            <p className="text-2xl font-bold text-green-600 mt-1">
              ₹
              {Number(
                product.price
              ).toLocaleString(
                "en-IN"
              )}
            </p>
          </div>

          <div className="border rounded-xl p-4">
            <p className="text-sm text-gray-500">
              Stock Available
            </p>

            <p
              className={`text-2xl font-bold mt-1 ${
                product.quantity_in_stock <
                10
                  ? "text-red-600"
                  : "text-blue-600"
              }`}
            >
              {
                product.quantity_in_stock
              }
            </p>
          </div>

          <div className="md:col-span-2 border rounded-xl p-4">
            <p className="text-sm text-gray-500 mb-2">
              Description
            </p>

            <p className="text-gray-700">
              {product.description ||
                "No description available."}
            </p>
          </div>

          <div className="border rounded-xl p-4">
            <p className="text-sm text-gray-500">
              Created At
            </p>

            <p className="font-medium mt-1">
              {new Date(
                product.created_at
              ).toLocaleString()}
            </p>
          </div>

          <div className="border rounded-xl p-4">
            <p className="text-sm text-gray-500">
              Last Update
            </p>

            <p className="font-medium mt-1">
              {new Date(
                product.updated_at
              ).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;