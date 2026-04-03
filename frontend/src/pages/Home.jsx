import { useEffect, useState } from "react";
import API from "../api/axios";
import ProductCard from "../components/productCard";
import Header from "../pages/Header"; // make sure the path is correct
import "../styles/home.css";

function Home() {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("home"); // track active tab

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
      />
      <div className="container">
        <h2 className="page-title">All Products</h2>
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;