import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import "../styles/cart.css";
import Header from "./Header";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // ---------------- FETCH CART ----------------
  const fetchCart = async () => {
    if (!user) return;

    if (!cart) setLoading(true);

    try {
      const res = await API.get("/cart");
      setCart(res.data);
    } catch (err) {
      console.error("Cart fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  // ---------------- UPDATE QUANTITY ----------------
  const updateQty = async (productId, quantity) => {
    if (quantity < 0) return;

    // optimistic UI
    setCart((prev) => ({
      ...prev,
      items: prev.items
        .map((item) => {
          const id = item.productId?._id || item.productId;

          if (id === productId) {
            return { ...item, quantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0),
    }));

    try {
      await API.put("/cart", { productId, quantity });
    } catch (err) {
      console.error("Update cart error:", err);
      fetchCart(); // rollback
    }
  };

  // ---------------- LOADING / EMPTY STATES ----------------
  if (loading) return <p>Loading cart...</p>;

  if (!cart || cart.items.length === 0)
    return <p>Your cart is empty.</p>;

  // ---------------- TOTAL ----------------
  const total = cart.items.reduce(
    (acc, item) =>
      acc + (item.productId?.price || item.price) * item.quantity,
    0
  );

  // ---------------- UI ----------------
  return (
    <div className="cart-page">
      <div className="cart-left">
        <h2>Your Shopping Cart</h2>

        {cart.items.map((item) => {
          const product = item.productId || {};

          return (
            <div
              className="cart-card"
              key={item._id || product._id}
            >
              {/* IMAGE FIXED */}
              <div className="cart-image">
                <img
                  src={product.images?.[0] || "/placeholder.png"}
                  alt={product.productName}
                />
              </div>

              {/* DETAILS */}
              <div className="cart-details">
                <h3>{product.productName}</h3>
                <p>{product.productDescription}</p>
                <p>Price: ₹ {item.price}</p>

                {product.stock === 0 && (
                  <p className="out-of-stock">Out of Stock</p>
                )}

                {/* QUANTITY CONTROLS */}
                <div className="qty-controls">
                  <button
                    onClick={() =>
                      updateQty(
                        item.productId?._id || item.productId,
                        item.quantity - 1
                      )
                    }
                    disabled={product.stock === 0}
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      updateQty(
                        item.productId?._id || item.productId,
                        item.quantity + 1
                      )
                    }
                    disabled={product.stock === 0}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* SUMMARY */}
      <div className="cart-summary">
        <h3>Order Summary</h3>
        <p>Total Items: {cart.items.length}</p>
        <h2>₹ {total}</h2>

        <button
          className="checkout-btn"
          onClick={() => navigate("/checkout")}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default Cart;