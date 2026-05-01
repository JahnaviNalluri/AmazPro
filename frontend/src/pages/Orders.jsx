import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../styles/orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [ratings, setRatings] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/orders/my-orders")
      .then((res) => setOrders(res.data))
      .catch((err) => console.log(err));
  }, []);

  // ⭐ handle star rating selection
  const handleRating = (productId, star) => {
    setRatings((prev) => ({
      ...prev,
      [productId]: star,
    }));
  };

  // ⭐ submit review
  const submitReview = async (productId) => {
    try {
      await API.post("/reviews", {
        productId,
        rating: ratings[productId],
        comment: "Good product",
      });

      alert("Review submitted!");
    } catch (err) {
      console.error(err);
    }
  };

  if (!orders.length) {
    return (
      <div className="orders-page">
        <h2>Your Orders</h2>
        <p>No orders found.</p>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h2>Your Orders</h2>

      {orders.map((order) => (
        <div className="order-card" key={order._id}>

          {/* ORDER HEADER */}
          <div className="order-header">
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Total:</strong> ₹ {order.totalAmt}</p>
            <p>
              <strong>Delivered on:</strong>{" "}
              {order.deliveredAt
                ? new Date(order.deliveredAt).toDateString()
                : "Not delivered yet"}
            </p>
          </div>

          {/* PRODUCTS */}
          <div className="order-products">

            {order.products?.map((prod) => {
              const product = prod.productId;

              return (
                <div className="order-product-modern" key={product._id}>

                  {/* IMAGE */}
                  <img
                    src={product?.images?.[0] || "/placeholder.png"}
                    alt={product?.productName}
                    className="order-img"
                  />

                  {/* INFO */}
                  <div className="order-info">
                    <h4>{product.productName}</h4>
                    <p>Qty: {prod.quantity}</p>
                    <p>₹ {prod.price}</p>

                    {/* ⭐ RATING */}
                    <div className="stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          style={{
                            cursor: "pointer",
                            color:
                              ratings[product._id] >= star
                                ? "gold"
                                : "gray",
                          }}
                          onClick={() =>
                            handleRating(product._id, star)
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>

                    {/* SUBMIT REVIEW */}
                    <button
                      onClick={() => submitReview(product._id)}
                      className="review-btn"
                    >
                      Submit Review
                    </button>
                  </div>

                  {/* ➜ GO TO PRODUCT */}
                  <div
                    className="go-product"
                    onClick={() =>
                      navigate(`/product/${product._id}`)
                    }
                  >
                    ➜
                  </div>

                </div>
              );
            })}

          </div>
        </div>
      ))}
    </div>
  );
}

export default Orders;