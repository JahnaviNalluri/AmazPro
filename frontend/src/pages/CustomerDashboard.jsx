import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../styles/customer.css";
import Header from "./Header";
import Cart from "./Cart"
function CustomerDashboard() {
  const navigate = useNavigate();

  // ---------------- STATES ----------------
  const [activeTab, setActiveTab] = useState("home");
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [liked, setLiked] = useState([]);
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState(null);
  const [editProfile, setEditProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({});
 
  // ---------------- FETCH DATA ----------------
  const fetchAllProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders/my-orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await API.get("/users/profile");
      setProfile(res.data);
      setProfileForm(res.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const fetchCart = async () => {
    try {
      const res = await API.get("/cart");
      setCart(res.data.items || []);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCart([]);
    }
  };

  // ---------------- CART ----------------
  const addToCart = async (product) => {
  try {
    // optional: instant UI feedback (if you want)
    // setCart(prev => ...)

    await API.post("/cart", {
      productId: product._id,
      quantity: 1,
    });

    // refresh cart AFTER update
    await fetchCart();
  } catch (err) {
    console.error("Error adding to cart:", err.response?.data || err.message);
  }
};

  const updateCartQty = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      await API.put("/cart", { productId, quantity });
      fetchCart();
    } catch (err) {
      console.error("Error updating cart:", err);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await API.delete(`/cart/${productId}`);
      fetchCart();
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };

  // ---------------- LIKED ----------------
const likeProduct = async (product) => {
  try {
    await API.post("/liked/add", {
      productId: product._id,
    });

    // refresh liked list from backend
    const res = await API.get("/liked");
    setLiked(res.data.items || []);
  } catch (err) {
    console.error("Error liking product:", err);
  }
};
const fetchLiked = async () => {
  try {
    const res = await API.get("/liked");
    setLiked(res.data.items || []);
  } catch (err) {
    console.error(err);
  }
};
  // ---------------- PROFILE ----------------
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfile = async () => {
    try {
      await API.put("/users/profile", profileForm);
      setProfile(profileForm);
      setEditProfile(false);
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  };

  // ---------------- LOGOUT ----------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // ---------------- INITIAL DATA ----------------
  useEffect(() => {
  fetchAllProducts();
  fetchOrders();
  fetchProfile();
  fetchCart();
  fetchLiked(); // 👈 ADD THIS
}, []);

  return (
    <div className="customer-dashboard" style={{ backgroundColor: "pink"}}>
      {/* ---------------- HEADER ---------------- */}
       

      {/* ---------------- PRODUCT DETAILS MODAL ---------------- */}
     

      {/* ---------------- HOME ---------------- */}
      {activeTab === "home" && (
        <div className="dashboard-grid">
          {products.map((product) => (
            <div
              key={product._id}
              className="dashboard-card"
               onClick={() => navigate(`/product/${product._id}`)}
            >
              <img src={product.images?.[0] || "/placeholder.png"} alt={product.productName} />
              <h4>{product.productName}</h4>
              <p>₹ {product.price}</p>
              
              <button
  onClick={(e) => {
    e.stopPropagation(); // This will stop the event from propagating to parent elements
    addToCart(product);
  }}
  className="add-to-cart" // Apply class here
>
  Add to Cart
</button>

<button
  onClick={(e) => {
    e.stopPropagation();
    likeProduct(product);
  }}
  className="like-button" // Apply class here
>
  ❤️ Like
</button>
            </div>
          ))}
        </div>
      )}

      {/* ---------------- CART ---------------- */}
    {activeTab === "cart" && (
        <Cart cart={cart} fetchCart={fetchCart} />
      )}

      {/* ---------------- LIKED ---------------- */}
      {activeTab === "liked" && (
        <>
          <h3>Liked Products</h3>
          {liked.length === 0 && <p>You have not liked any products yet.</p>}
          <div className="dashboard-grid" style={{ backgroundColor: "pink"}}>
            {liked.map((p) => (
              <div key={p._id} className="dashboard-card">
                <img src={p.images?.[0] || "/placeholder.png"} alt={p.productName} />
                <h4>{p.productName}</h4>
                <p>₹ {p.price}</p>
                <p>{p.productDescription?.slice(0, 50)}...</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ---------------- ORDERS ---------------- */}
      {activeTab === "orders" && (
        <>
          <h3>My Orders</h3>
          {orders.length === 0 && <p>No orders found.</p>}
          <div className="dashboard-grid" style={{ backgroundColor: "pink"}}>
            {orders.map((order) => (
              <div key={order._id} className="dashboard-card">
                <p>
                  <strong>Order ID:</strong> {order._id}
                </p>
                <p>
                  <strong>Status:</strong> {order.status}
                </p>
                <p>
                  <strong>Placed:</strong>{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Will arrive in:</strong> 3-7 days
                </p>
                {order.products?.map((prod) => (
  <div key={prod._id} className="order-product">

    <img
      src={prod.productId?.images?.[0]}
      alt={prod.productId?.productName}
    />

    <h5>{prod.productId?.productName}</h5>

    <p>Qty: {prod.quantity}</p>
    <p>₹ {prod.price}</p>

  </div>
))}
                <p>
                  <strong>Total:</strong> ₹ {order.totalAmt}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ---------------- PROFILE ---------------- */}
      {activeTab === "profile" && profile && (
        <div className="profile-card">
          {editProfile ? (
            <>
              <h3>Edit Profile</h3>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={profileForm.name}
                onChange={handleProfileChange}
              />
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={profileForm.email}
                onChange={handleProfileChange}
              />
              <label>Phone:</label>
              <input
                type="text"
                name="phoneno"
                value={profileForm.phoneno}
                onChange={handleProfileChange}
              />
              <label>Address:</label>
              <textarea
                name="address"
                value={profileForm.address}
                onChange={handleProfileChange}
              ></textarea>
              <button onClick={saveProfile}>Save</button>
              <button onClick={() => setEditProfile(false)}>Cancel</button>
            </>
          ) : (
            <>
              <h3>Profile</h3>
              <p>
                <strong>Name:</strong> {profile.name}
              </p>
              <p>
                <strong>Email:</strong> {profile.email}
              </p>
              <p>
                <strong>Phone:</strong> {profile.phoneno}
              </p>
              <p>
                <strong>Address:</strong> {profile.address}
              </p>
              <button onClick={() => setEditProfile(true)}>Edit Profile</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default CustomerDashboard;