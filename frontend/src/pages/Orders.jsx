import { useEffect, useState } from "react";
import API from "../api/axios";
import "../styles/orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get("/orders/my-orders")
      .then(res => setOrders(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="orders-page container">

      <h2>Your Orders</h2>

      {orders.map((order) => (
        <div className="order-card" key={order._id}>

          <div className="order-header">
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Total:</strong> ₹ {order.totalAmt}</p>
          </div>

          <div className="order-products">
            {order.products.map((prod, index) => (
              <div className="order-product" key={index}>
                <div className="order-image"></div>
                <div>
                  <p>Quantity: {prod.quantity}</p>
                  <p>₹ {prod.price}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      ))}

    </div>
  );
}

export default Orders;
