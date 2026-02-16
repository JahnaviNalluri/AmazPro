import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import "../styles/productdetails.css";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    API.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.log(err));

    API.get(`/reviews/${id}`)
      .then(res => setReviews(res.data))
      .catch(err => console.log(err));
  }, [id]);

  const addToCart = async () => {
    try {
      await API.post("/cart", {
        productId: id,
        quantity: 1
      });
      alert("Added to cart");
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="details-container container">

      <div className="details-top">

        <div className="details-image">
          <img
            src={product.images?.[0] || "https://via.placeholder.com/300"}
            alt={product.productName}
          />
        </div>

        <div className="details-info">
          <h2>{product.productName}</h2>

          <div className="rating">
            {"⭐".repeat(Math.round(product.rating || 4))}
          </div>

          <h3 className="price">₹ {product.price}</h3>

          <p>{product.productDescription}</p>

          <button className="add-btn" onClick={addToCart}>
            Add to Cart
          </button>
        </div>

      </div>

      <div className="reviews-section">
        <h3>Customer Reviews</h3>

        {reviews.length === 0 && <p>No reviews yet</p>}

        {reviews.map((rev) => (
          <div key={rev._id} className="review-card">
            <p>⭐ {rev.rating}/5</p>
            <p>{rev.feedback}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

export default ProductDetails;
