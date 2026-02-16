import { useEffect, useState } from "react";
import API from "../api/axios";
import "../styles/admin.css";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const productRes = await API.get("/products");
      const orderRes = await API.get("/orders/my-orders");
      setProducts(productRes.data);
      setOrders(orderRes.data);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const approveProduct = async (id) => {
    try {
      await API.put(`/products/approve/${id}`);

      // Update locally without full refetch
      setProducts(prev =>
        prev.map(p =>
          p._id === id ? { ...p, isApproved: true } : p
        )
      );

      alert("Product Approved");
    } catch (err) {
      alert("Approval failed");
    }
  };

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/products/${id}`);

      setProducts(prev =>
        prev.filter(p => p._id !== id)
      );

      alert("Product Deleted");
    } catch (err) {
      alert("Delete failed");
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await API.put(`/orders/status/${id}`, { status });

      setOrders(prev =>
        prev.map(order =>
          order._id === id ? { ...order, status } : order
        )
      );

      alert("Order status updated");
    } catch (err) {
      alert("Failed to update order");
    }
  };

  const totalRevenue = orders.reduce(
    (acc, order) => acc + order.totalAmt,
    0
  );

  if (loading) return <p style={{ padding: "40px" }}>Loading Admin Panel...</p>;

  return (
    <div className="admin-container container">

      <h2>Admin Dashboard</h2>

      {/* Analytics */}
      <div className="analytics">
        <div className="card-analytics">
          <h3>Total Products</h3>
          <p>{products.length}</p>
        </div>

        <div className="card-analytics">
          <h3>Total Orders</h3>
          <p>{orders.length}</p>
        </div>

        <div className="card-analytics">
          <h3>Total Revenue</h3>
          <p>₹ {totalRevenue}</p>
        </div>
      </div>

      {/* Manage Products */}
      <h3>Manage Products</h3>

      <div className="admin-grid">
        {products.map((product) => (
          <div key={product._id} className="admin-card">

            <img
              src={product.images?.[0] || "https://via.placeholder.com/150"}
              alt={product.productName}
            />

            <h4>{product.productName}</h4>
            <p>₹ {product.price}</p>
            <p>Status: {product.isApproved ? "Approved" : "Pending"}</p>

            {!product.isApproved && (
              <button
                className="primary-btn"
                onClick={() => approveProduct(product._id)}
              >
                Approve
              </button>
            )}

            <button
              className="danger-btn"
              onClick={() => deleteProduct(product._id)}
            >
              Delete
            </button>

          </div>
        ))}
      </div>

      {/* Manage Orders */}
      <h3 style={{ marginTop: "40px" }}>Manage Orders</h3>

      {orders.map((order) => (
        <div key={order._id} className="order-admin-card">

          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Total:</strong> ₹ {order.totalAmt}</p>
          <p><strong>Status:</strong> {order.status}</p>

          <select
            value={order.status}
            onChange={(e) =>
              updateOrderStatus(order._id, e.target.value)
            }
          >
            <option value="pending">Pending</option>
            <option value="shipping">Shipping</option>
            <option value="paid">Paid</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

        </div>
      ))}

    </div>
  );
}

export default AdminDashboard;
