import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import "../styles/productdetails.css";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [liked, setLiked] = useState([]);

  // ------------------ FETCH PRODUCT & REVIEWS ------------------
  useEffect(() => {
    let isMounted = true; // prevent setting state on unmounted component

    const fetchData = async () => {
      try {
        const [productRes, reviewsRes] = await Promise.all([
          API.get(`/products/${id}`),
          API.get(`/reviews/${id}`)
        ]);

        if (isMounted) {
          setProduct(productRes.data);
          setReviews(reviewsRes.data);
        }
      } catch (err) {
        console.error("Error fetching product or reviews:", err);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // ------------------ CART & LIKE ------------------
  const addToCart = async () => {
    try {
      await API.post("/cart", {
        productId: id,
        quantity: 1,
      });
      alert("Added to cart!");
    } catch (err) {
      alert(err.response?.data?.message || "Error adding to cart");
    }
  };

  const likeProduct = () => {
    if (!liked.find((p) => p._id === product._id)) {
      setLiked([...liked, product]);
      alert("Added to liked products!");
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="details-container container">
      {/* ------------------ TOP SECTION ------------------ */}
      <div className="details-top">
        <div className="details-image">
          <img
            src={product.images?.[0] || "https://via.placeholder.com/300"}
            alt={product.productName}
          />
        </div>

        <div className="details-info">
          <h2>{product.productName}</h2>

          {/* Show rating only if available */}
          {product.rating && (
            <div className="rating">
              {"⭐".repeat(Math.round(product.rating))}
            </div>
          )}

          <h3 className="price">₹ {product.price}</h3>
          <p>{product.productDescription}</p>
          {/* Display "Out of Stock" only if stock is 0 */}
            {product.stock === 0 && <p className="out-of-stock">Out of Stock</p>}

          {/* Buttons with spacing */}
          <div className="product-actions">
            <button className="add-btn" onClick={addToCart}>
              Add to Cart
            </button>
            <button className="like-btn" onClick={likeProduct}>
               Like
            </button>
          </div>
        </div>
      </div>

      {/* ------------------ REVIEWS ------------------ */}
      <div className="reviews-section">
        <h3>Customer Reviews</h3>
        {reviews.length === 0 && <p>No reviews yet.</p>}

        {reviews.map((rev) => (
          <div key={rev._id} className="review-card">
            {rev.rating && <p>⭐ {rev.rating}/5</p>}
            <p>{rev.feedback}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductDetails;