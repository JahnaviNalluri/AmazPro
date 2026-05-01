import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../styles/checkout.css";
import { useEffect, useState } from "react";

function Checkout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const placeOrder = async () => {
    try {
      // 1. get cart first
      const cartRes = await API.get("/cart");

      const cart = cartRes.data;

      if (!cart.items.length) {
        alert("Cart is empty");
        navigate("/cart");
        return;
      }

      // 2. create order
      await API.post("/orders", {
        products: cart.items.map((item) => ({
          productId: item.productId._id || item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: "Default Address",
      });

      // 3. optional: clear cart (if backend supports)
      await API.delete("/cart/clear");

      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Order failed");
    }
  };

  useEffect(() => {
    placeOrder();
  }, []);

  if (loading) {
    return (
      <div className="checkout-page container">
        <h2>Placing your order...</h2>
      </div>
    );
  }

  return (
    <div className="checkout-page container">
      <h2>Order Confirmed 🎉</h2>
      <p>Your order has been placed successfully.</p>

      <button onClick={() => navigate("/orders")}>
        View Orders
      </button>
    </div>
  );
}

export default Checkout;