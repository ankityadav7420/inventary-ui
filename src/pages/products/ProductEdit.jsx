import {
    useEffect,
    useState,
  } from "react";
  
  import {
    useNavigate,
    useParams,
  } from "react-router-dom";
  
  import {
    getProductById,
    updateProduct,
  } from "../../api/productApi";
  
  import toast from "react-hot-toast";
  
  function ProductEdit() {
    const { id } = useParams();
  
    const navigate = useNavigate();
  
    const [formData, setFormData] =
      useState({
        name: "",
        description: "",
        price: "",
        stock: "",
      });
  
    useEffect(() => {
      loadProduct();
    }, []);
  
    const loadProduct =
      async () => {
        try {
          const data =
            await getProductById(id);
  
          setFormData(data);
        } catch {
          toast.error(
            "Failed to load product"
          );
        }
      };
  
    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]:
          e.target.value,
      });
    };
  
    const handleSubmit = async (
      e
    ) => {
      e.preventDefault();
  
      try {
        await updateProduct(
          id,
          formData
        );
  
        toast.success(
          "Product updated"
        );
  
        navigate("/products");
      } catch {
        toast.error(
          "Failed to update product"
        );
      }
    };
  
    return (
      <div className="max-w-xl">
        <h1 className="text-2xl font-bold mb-5">
          Edit Product
        </h1>
  
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow"
        >
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-3 mb-4"
          />
  
          <textarea
            name="description"
            value={
              formData.description
            }
            onChange={handleChange}
            className="w-full border p-3 mb-4"
          />
  
          <input
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border p-3 mb-4"
          />
  
          <input
            name="quantity_in_stock"
            value={formData.quantity_in_stock}
            onChange={handleChange}
            className="w-full border p-3 mb-4"
          />
  
          <button className="bg-green-600 text-white px-5 py-3 rounded">
            Update Product
          </button>
        </form>
      </div>
    );
  }
  
  export default ProductEdit;