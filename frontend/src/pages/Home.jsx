import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../styles/home.css";

function Home() {
  const [products, setProducts] = useState([]);
  const [activeTab] = useState("home");

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const addToCart = () => {

  navigate("/login");
};

const likeProduct = () => {

  navigate("/login");
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
    
      <div className="container">
        <h2 className="page-title">All Products</h2>

        {activeTab === "home" && (
          <div className="dashboard-grid">
            {products.map((product) => (
              <div
                key={product._id}
                className="dashboard-card"
                   >
                <img
                  src={product.images?.[0] || "/placeholder.png"}
                  alt={product.productName}
                />

                <h4>{product.productName}</h4>

                <p className="price">₹ {product.price}</p>

                <div className="card-actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                  >
                    Add to Cart
                  </button>

                  <button
                    className="like-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      likeProduct(product);
                    }}
                  >
                    ❤️ Like
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    
  );
}

export default Home;