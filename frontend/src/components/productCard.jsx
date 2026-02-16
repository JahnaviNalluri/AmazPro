import { Link } from "react-router-dom";
import "../styles/productcard.css";

function ProductCard({ product }) {
  return (
    <Link to={`/product/${product._id}`} className="product-link">
      <div className="card">

        <img
          src={product.images?.[0] || "https://via.placeholder.com/200"}
          alt={product.productName}
          className="product-img"
        />

        <h3>{product.productName}</h3>

        <div className="rating">
          {"⭐".repeat(Math.round(product.rating || 4))}
          <span> ({product.rating || 4})</span>
        </div>

        <p className="price">₹ {product.price}</p>

      </div>
    </Link>
  );
}

export default ProductCard;
