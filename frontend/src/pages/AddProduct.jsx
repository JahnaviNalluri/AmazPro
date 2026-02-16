import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../styles/productform.css";

function AddProduct() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    productName: "",
    productDescription: "",
    price: "",
    stock: "",
    images: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/products", {
        ...form,
        images: [form.images]
      });

      alert("Product added. Waiting for admin approval.");
      navigate("/vendor");

    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div className="form-container">
      <form className="product-form" onSubmit={handleSubmit}>

        <h2>Add New Product</h2>

        <input
          placeholder="Product Name"
          required
          onChange={(e) =>
            setForm({ ...form, productName: e.target.value })
          }
        />

        <textarea
          placeholder="Product Description"
          required
          onChange={(e) =>
            setForm({ ...form, productDescription: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Price"
          required
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Stock"
          required
          onChange={(e) =>
            setForm({ ...form, stock: e.target.value })
          }
        />

        <input
          placeholder="Image URL"
          required
          onChange={(e) =>
            setForm({ ...form, images: e.target.value })
          }
        />

        <button type="submit">Add Product</button>

      </form>
    </div>
  );
}

export default AddProduct;
