import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import "../styles/productdetails.css";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [liked, setLiked] = useState([]);

  // review form
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");

  // ---------------- FETCH DATA ----------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, reviewsRes, likedRes] = await Promise.all([
          API.get(`/products/${id}`),
          API.get(`/reviews/${id}`),
          API.get(`/liked`),
        ]);

        setProduct(productRes.data);
        setReviews(reviewsRes.data);
        setLiked(likedRes.data.items || []);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();
  }, [id]);

  // ---------------- CART ----------------
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

  // ---------------- LIKE (FIXED) ----------------
  const likeProduct = async () => {
    try {
      await API.post("/liked/add", {
        productId: id,
      });

      const res = await API.get("/liked");
      setLiked(res.data.items || []);

      alert("Added to wishlist ❤️");
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  // ---------------- REVIEW SUBMIT ----------------
  const submitReview = async () => {
    try {
      await API.post("/reviews", {
        productId: id,
        rating,
        feedback,
      });

      const res = await API.get(`/reviews/${id}`);
      setReviews(res.data);

      setFeedback("");
      setRating(5);
    } catch (err) {
      console.error("Review error:", err);
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="details-container">

      {/* TOP SECTION */}
      <div className="details-top">

        <div className="details-image">
          <img
            src={product.images?.[0] || "https://via.placeholder.com/300"}
            alt={product.productName}
          />
        </div>

        <div className="details-info">
          <h2>{product.productName}</h2>

          <h3 className="price">₹ {product.price}</h3>

          <p>{product.productDescription}</p>

          {product.stock === 0 && (
            <p className="out-of-stock">Out of Stock</p>
          )}

          <div className="product-actions">
            <button onClick={addToCart}>Add to Cart</button>

            <button onClick={likeProduct}>
              ❤️ Like
            </button>
          </div>
        </div>
      </div>

      {/* ---------------- REVIEW FORM ---------------- */}
      <div className="review-form">
        <h3>Write a Review</h3>

        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          <option value={5}>5 ⭐</option>
          <option value={4}>4 ⭐</option>
          <option value={3}>3 ⭐</option>
          <option value={2}>2 ⭐</option>
          <option value={1}>1 ⭐</option>
        </select>

        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Write your feedback..."
        />

        <button onClick={submitReview}>
          Submit Review
        </button>
      </div>

      {/* ---------------- REVIEWS ---------------- */}
      <div className="reviews-section">
        <h3>Customer Reviews</h3>

        {reviews.length === 0 && <p>No reviews yet.</p>}

        {reviews.map((rev) => (
          <div key={rev._id} className="review-card">
            <p>{"⭐".repeat(rev.rating)}</p>
            <p>{rev.feedback}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

export default ProductDetails;