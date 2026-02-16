import { useEffect, useState } from "react";
import API from "../api/axios";
import "../styles/customer.css";

function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("home");

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [liked, setLiked] = useState([]);
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState(null);
  const [editProfile, setEditProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({});

  /* ---------------- FETCH DATA ---------------- */

  const fetchAllProducts = async () => {
    const res = await API.get("/products");
    setProducts(res.data);
  };

  const fetchOrders = async () => {
    const res = await API.get("/orders/my-orders");
    setOrders(res.data);
  };

  const fetchProfile = async () => {
    const res = await API.get("/users/profile");
    setProfile(res.data);
    setProfileForm(res.data);
  };

  /* ---------------- CART & LIKED ---------------- */

  const addToCart = (product) => {
    if (!cart.find(p => p._id === product._id)) {
      setCart([...cart, product]);
    }
  };

  const likeProduct = (product) => {
    if (!liked.find(p => p._id === product._id)) {
      setLiked([...liked, product]);
    }
  };

  /* ---------------- PROFILE HANDLING ---------------- */

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const saveProfile = async () => {
    await API.put("/users/profile", profileForm);
    setProfile(profileForm);
    setEditProfile(false);
  };

  /* ---------------- LOGOUT ---------------- */
  const handleLogout = () => {
    // Clear user session / token
    localStorage.removeItem("token");
    window.location.href = "/login"; // redirect to login
  };

  /* ---------------- INITIAL DATA ---------------- */
  useEffect(() => {
    fetchAllProducts();
    fetchOrders();
    fetchProfile();
  }, []);

  return (
    <div className="customer-dashboard">

      {/* ---------------- FULL-WIDTH HEADER + NAVBAR ---------------- */}
      <div className="full-width-navbar">
  <div className="customer-header-navbar">
    <div className="logo">
      <h1>AmazPro</h1>
    </div>

    <div className="customer-tabs">
      {[
        { name: "Home", key: "home" },
        { name: "Cart", key: "cart" },
        { name: "Liked", key: "liked" },
        { name: "Orders", key: "orders" },
        { name: "Profile", key: "profile" },
        { name: "Logout", key: "logout" },
      ].map(tab => (
        <button
          key={tab.key}
          className={activeTab === tab.key ? "tab active-tab" : "tab"}
          onClick={() => {
            if (tab.key === "logout") handleLogout();
            else setActiveTab(tab.key);
          }}
        >
          {tab.name}
        </button>
      ))}
    </div>
  </div>
</div>


      {/* ---------------- HOME ---------------- */}
      {activeTab === "home" && (
        <div className="dashboard-grid">
          {products.map(product => (
            <div key={product._id} className="dashboard-card">
              <img src={product.images?.[0]} alt={product.productName} />
              <h4>{product.productName}</h4>
              <p>₹ {product.price}</p>
              <p>{product.description?.slice(0, 50)}...</p>
              <button onClick={() => addToCart(product)}>Add to Cart</button>
              <button onClick={() => likeProduct(product)}>❤️ Like</button>
            </div>
          ))}
        </div>
      )}

      {/* ---------------- CART ---------------- */}
      {activeTab === "cart" && (
        <>
          <h3>Your Cart</h3>
          {cart.length === 0 && <p>Your cart is empty.</p>}
          <div className="dashboard-grid">
            {cart.map(p => (
              <div key={p._id} className="dashboard-card">
                <img src={p.images?.[0]} alt={p.productName} />
                <h4>{p.productName}</h4>
                <p>₹ {p.price}</p>
                <p>{p.description?.slice(0, 50)}...</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ---------------- LIKED ---------------- */}
      {activeTab === "liked" && (
        <>
          <h3>Liked Products</h3>
          {liked.length === 0 && <p>You have not liked any products yet.</p>}
          <div className="dashboard-grid">
            {liked.map(p => (
              <div key={p._id} className="dashboard-card">
                <img src={p.images?.[0]} alt={p.productName} />
                <h4>{p.productName}</h4>
                <p>₹ {p.price}</p>
                <p>{p.description?.slice(0, 50)}...</p>
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
          <div className="dashboard-grid">
            {orders.map(order => (
              <div key={order._id} className="dashboard-card">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Placed:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                <p><strong>Will arrive in:</strong> 3-7 days</p>
                {order.products?.map(prod => (
                  <div key={prod._id} className="order-product">
                    <img src={prod.images?.[0]} alt={prod.productName} />
                    <h5>{prod.productName}</h5>
                    <p>₹ {prod.price}</p>
                  </div>
                ))}
                <p><strong>Total:</strong> ₹ {order.totalAmt}</p>
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
              <input type="text" name="name" value={profileForm.name} onChange={handleProfileChange} />
              <label>Email:</label>
              <input type="email" name="email" value={profileForm.email} onChange={handleProfileChange} />
              <label>Phone:</label>
              <input type="text" name="phoneno" value={profileForm.phoneno} onChange={handleProfileChange} />
              <label>Address:</label>
              <textarea name="address" value={profileForm.address} onChange={handleProfileChange}></textarea>
              <button onClick={saveProfile}>Save</button>
              <button onClick={() => setEditProfile(false)}>Cancel</button>
            </>
          ) : (
            <>
              <h3>Profile</h3>
              <p><strong>Name:</strong> {profile.name}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Phone:</strong> {profile.phoneno}</p>
              <p><strong>Address:</strong> {profile.address}</p>
              <button onClick={() => setEditProfile(true)}>Edit Profile</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default CustomerDashboard;
