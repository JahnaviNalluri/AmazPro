import { useEffect, useState } from "react";
import API from "../api/axios";
import "../styles/dashboard.css";

function VendorPanel() {
  const [activeTab, setActiveTab] = useState("home");

  const [products, setProducts] = useState([]);
  const [vendorProducts, setVendorProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [cart, setCart] = useState([]);
  const [liked, setLiked] = useState([]);
  const [search, setSearch] = useState("");

  const [stats, setStats] = useState({
    totalRevenue: 0,
    mostSelling: null,
    leastSelling: null
  });

  /* ---------------- FETCH DATA ---------------- */

  const fetchAllProducts = async () => {
    const res = await API.get("/products");
    setProducts(res.data);
  };

  const fetchVendorProducts = async () => {
    const res = await API.get("/products/vendor");
    setVendorProducts(res.data);
  };

  const fetchOrders = async () => {
    const res = await API.get("/orders/vendor");
    setOrders(res.data);
    calculateStats(res.data);
  };

  /* ---------------- CALCULATE STATS ---------------- */

  const calculateStats = (ordersData) => {
    let revenue = 0;
    const productSales = {};

    ordersData.forEach(order => {
      revenue += order.totalAmt;

      order.products.forEach(item => {
        revenue += 0;
        if (!productSales[item.productId]) {
          productSales[item.productId] = 0;
        }
        productSales[item.productId] += item.quantity;
      });
    });

    const sorted = Object.entries(productSales).sort(
      (a, b) => b[1] - a[1]
    );

    setStats({
      totalRevenue: revenue,
      mostSelling: sorted[0],
      leastSelling: sorted[sorted.length - 1]
    });
  };

  /* ---------------- PRODUCT ACTIONS ---------------- */

  const deleteProduct = async (id) => {
    await API.delete(`/products/${id}`);
    fetchVendorProducts();
  };

  const updateStatus = async (id, status) => {
    await API.put(`/orders/vendor/${id}`, { status });
    fetchOrders();
  };

  const applyOffer = async (id) => {
    const discount = prompt("Enter discount %");
    await API.put(`/products/${id}`, { discount });
    fetchVendorProducts();
  };

  /* ---------------- CART + LIKE ---------------- */

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const likeProduct = (product) => {
    if (!liked.find(p => p._id === product._id)) {
      setLiked([...liked, product]);
    }
  };

  /* ---------------- SEARCH FILTER ---------------- */

  const filteredProducts = products.filter(p =>
    p.productName.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------------- LOAD ---------------- */

  useEffect(() => {
    fetchAllProducts();
    fetchVendorProducts();
    fetchOrders();
  }, []);

  return (
    <div className="dashboard container">

      {/* =================== NAVBAR =================== */}
      <div className="top-navbar">

        <div className="nav-left">
          <h2 className="logo">AmazPro</h2>

          <button onClick={() => setActiveTab("home")}>Home</button>
          <button onClick={() => setActiveTab("cart")}>
            Cart ({cart.length})
          </button>
          <button onClick={() => setActiveTab("liked")}>
            Liked ({liked.length})
          </button>
          <button onClick={() => setActiveTab("myProducts")}>
            MyProducts
          </button>
          <button onClick={() => setActiveTab("orders")}>
            Orders
          </button>
          <button onClick={() => setActiveTab("status")}>
            Status
          </button>
        </div>

        <div className="nav-right">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-box"
          />
          <button className="logout-btn">Logout</button>
        </div>

      </div>

      {/* =================== HOME =================== */}
      {activeTab === "home" && (
        <div className="dashboard-grid">
          {filteredProducts.map(product => (
            <div key={product._id} className="dashboard-card">
              <img src={product.images?.[0]} alt="" height="150" />
              <h4>{product.productName}</h4>
              <p>₹ {product.price}</p>

              <button onClick={() => addToCart(product)}>Add to Cart</button>
              <button onClick={() => likeProduct(product)}>❤️ Like</button>
            </div>
          ))}
        </div>
      )}

      {/* =================== CART =================== */}
      {activeTab === "cart" && (
        <>
          <h3>Your Cart</h3>
          {cart.map(p => (
            <div key={p._id}>{p.productName} - ₹{p.price}</div>
          ))}
        </>
      )}

      {/* =================== LIKED =================== */}
      {activeTab === "liked" && (
        <>
          <h3>Liked Products</h3>
          {liked.map(p => (
            <div key={p._id}>{p.productName}</div>
          ))}
        </>
      )}

      {/* =================== MY PRODUCTS =================== */}
      {activeTab === "myProducts" && (
        <div className="dashboard-grid">
          {vendorProducts.map(product => (
            <div key={product._id} className="dashboard-card">
              <img src={product.images?.[0]} height="150" alt="" />
              <h4>{product.productName}</h4>
              <p>₹ {product.price}</p>

              <button onClick={() => applyOffer(product._id)}>
                Add Offer
              </button>

              <button onClick={() => deleteProduct(product._id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* =================== ORDERS =================== */}
      {activeTab === "orders" && (
        <>
          {orders.map(order => (
            <div key={order._id} className="dashboard-card">
              <p>Order ID: {order._id}</p>
              <p>Status: {order.status}</p>

              <button onClick={() => updateStatus(order._id, "processing")}>
                Processing
              </button>
              <button onClick={() => updateStatus(order._id, "shipped")}>
                Shipped
              </button>
              <button onClick={() => updateStatus(order._id, "delivered")}>
                Delivered
              </button>
            </div>
          ))}
        </>
      )}

      {/* =================== STATUS =================== */}
      {activeTab === "status" && (
        <>
          <h3>Sales Analytics</h3>

          <p>Total Revenue: ₹ {stats.totalRevenue}</p>

          <p>
            Most Selling Product ID:{" "}
            {stats.mostSelling ? stats.mostSelling[0] : "N/A"}
          </p>

          <p>
            Least Selling Product ID:{" "}
            {stats.leastSelling ? stats.leastSelling[0] : "N/A"}
          </p>

          <h4>Orders Per Product</h4>

          {vendorProducts.map(product => {
            const count = orders.reduce((acc, order) => {
              return (
                acc +
                order.products.filter(
                  item => item.productId === product._id
                ).length
              );
            }, 0);

            return (
              <div key={product._id}>
                {product.productName} → {count} orders
              </div>
            );
          })}
        </>
      )}

    </div>
  );
}

export default VendorPanel;
