import { useNavigate } from "react-router-dom";
import "../styles/checkout.css";

function Checkout() {
  const navigate = useNavigate();

  return (
    <div className="checkout-page container">
      <h2>Order Confirmed 🎉</h2>
      <p>Your order has been placed successfully.</p>

      <button onClick={() => navigate("/")}>
        Continue Shopping
      </button>
    </div>
  );
}

export default Checkout;
