import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../styles/cart.css";

function Cart() {
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();

  const fetchCart = async () => {
    const res = await API.get("/cart");
    setCart(res.data);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (!cart) return <p>Loading...</p>;

  const updateQty = async (id, quantity) => {
    if (quantity < 1) return;
    await API.put("/cart", { productId: id, quantity });
    fetchCart();
  };

  const total = cart.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-page container">

      <div className="cart-left">
        <h2>Your Shopping Cart</h2>

        {cart.items.map((item) => (
          <div className="cart-card" key={item.productId}>

            <div className="cart-image"></div>

            <div className="cart-details">
              <h3>Product</h3>
              <p>₹ {item.price}</p>

              <div className="qty-controls">
                <button onClick={() => updateQty(item.productId, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQty(item.productId, item.quantity + 1)}>+</button>
              </div>
            </div>

          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>Order Summary</h3>
        <p>Total Items: {cart.items.length}</p>
        <h2>₹ {total}</h2>

        <button onClick={() => navigate("/checkout")}>
          Proceed to Checkout
        </button>
      </div>

    </div>
  );
}

export default Cart;
