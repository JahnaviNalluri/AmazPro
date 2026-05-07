// src/pages/VendorStatus.js
import { useEffect, useState } from "react";
import API from "../api/axios";

function VendorStatus() {
  const [revenue, setRevenue] = useState(0); // Total revenue
  const [income, setIncome] = useState(0);   // Vendor's income
  const [orders, setOrders] = useState([]);

  // Fetch orders and calculate revenue/income
  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders/my-orders");
      setOrders(res.data);
      calculateRevenue(res.data); // Calculate revenue and income
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const calculateRevenue = (orders) => {
    let totalRevenue = 0;
    let vendorIncome = 0;

    // Loop through all orders and calculate total revenue and vendor income
    orders.forEach((order) => {
      order.products.forEach((product) => {
        totalRevenue += product.price * product.quantity; // Total revenue for the vendor
        vendorIncome += product.vendorShare * product.quantity; // Vendor income based on their share
      });
    });

    setRevenue(totalRevenue);
    setIncome(vendorIncome);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="status-page" style={{ padding: "20px", backgroundColor: "pink" }}>
      <h3>Vendor Status</h3>
      <p><strong>Total Revenue:</strong> ₹ {revenue.toFixed(2)}</p>
      <p><strong>Total Income (Vendor's Share):</strong> ₹ {income.toFixed(2)}</p>
      <div>
        <h4>Order Details</h4>
        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-item">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Total Amount:</strong> ₹ {order.totalAmt}</p>
                <p><strong>Placed on:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default VendorStatus;