import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Header from "./Header";
import "../styles/liked.css";
const Liked = () => {
  const [likedItems, setLikedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchLiked = async () => {
    try {
      const res = await axios.get("/liked");
      setLikedItems(res.data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId) => {
  try {
   await axios.delete(`/liked/remove/${productId}`);
  const res = await axios.get("/liked");
  setLikedItems(res.data.items || []);
  } catch (err) {
    console.error(err);
  }
};

  useEffect(() => {
    fetchLiked();
  }, []);

  if (loading) return <p>Loading wishlist...</p>;

  return (
    <>
      

      <div className="liked-page">
        <h2>❤️ My Wishlist</h2>

        {likedItems.length === 0 ? (
          <p>No items in wishlist</p>
        ) : (
          <div className="liked-grid">
            {likedItems.map((item) => {
              const product = item.productId;

              return (
                <div
                  key={product._id}
                  className="dashboard-card"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  <img
                    src={product.images?.[0] || "/placeholder.png"}
                    alt={product.productName}
                  />

                  <h3>{product.productName}</h3>
                  <p>₹ {product.price}</p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // prevent card click
                      removeItem(product._id);
                    }}
                    className="remove-btn"
                  >
                    Remove ❤️
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Liked;