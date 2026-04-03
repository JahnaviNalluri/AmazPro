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
  const [activeTab, setActiveTab] = useState("home");
  const navigate = useNavigate();

  // Fetch cart from backend
  const fetchCart = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await API.get("/cart");
      setCart(res.data); // expects items.productId to be fully populated
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  // Update quantity of a cart item
  const updateQty = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      await API.put("/cart", { productId, quantity });
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading cart...</p>;
  if (!cart || cart.items.length === 0) return <p>Your cart is empty.</p>;

  const total = cart.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };
  return (
    <>
     

    <div className="cart-page container">
      <div className="cart-left">
        <h2>Your Shopping Cart</h2>

        {cart.items.map((item) => {
          const product = item.productId; // fully populated product

          return (
            <div className="cart-card" key={product._id}>
              <div className="cart-image">
                <img src={product.images?.[0]} alt={product.productName} />
              </div>

              <div className="cart-details">
                <h3>{product.productName}</h3>
                <p>{product.productDescription}</p>
                <p>Price: ₹ {item.price}</p>

                {/* Display "Out of Stock" only if stock is 0 */}
                {product.stock === 0 && (
                  <p className="out-of-stock">Out of Stock</p>
                )}

                <div className="qty-controls">
                  <button
                    onClick={() =>
                      updateQty(product._id, item.quantity - 1)
                    }
                    disabled={product.stock === 0}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQty(product._id, item.quantity + 1)
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
    </>
  );
  
}

export default Cart;