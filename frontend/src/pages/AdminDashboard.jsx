import { useEffect, useState } from "react";
import API from "../api/axios";
import "../styles/admin.css";

function AdminDashboard() {

  const [products, setProducts] =
    useState([]);

  const [orders, setOrders] =
    useState([]);

  const [users, setUsers] =
    useState([]);

  const [vendors, setVendors] =
    useState([]);

  const [reviews, setReviews] =
    useState([]);

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [activeTab, setActiveTab] =
    useState("products");

  // ---------------- FETCH ----------------

  const fetchData = async () => {

    try {

      setLoading(true);

      const [
        productRes,
        orderRes,
        userRes,
      ] = await Promise.all([

        API.get("/products"),

        API.get("/orders/allorders"),

        API.get("/users/all"),

      ]);

      setProducts(productRes.data);

      setOrders(orderRes.data);

      setUsers(
        userRes.data.filter(
          (u) =>
            u.role === "user" ||
            u.role === "customer"
        )
      );

      setVendors(
        userRes.data.filter(
          (u) =>
            u.role === "vendor"
        )
      );

    } catch (err) {

      console.error(err);

      alert("Failed to load admin data");

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    fetchData();

  }, []);

  // ---------------- LOGOUT ----------------

  const handleLogout = () => {

    localStorage.removeItem("token");

    window.location.href = "/login";

  };

  // ---------------- PRODUCT DETAILS ----------------

  const openProductDetails =
    async (product) => {

      try {

        setSelectedProduct(product);

        const res =
          await API.get(
            `/reviews/${product._id}`
          );

        setReviews(res.data);

      } catch (err) {

        console.error(err);

      }
    };

  // ---------------- APPROVE ----------------

  const approveProduct =
    async (id) => {

      try {

        await API.put(
          `/products/approve/${id}`
        );

        setProducts((prev) =>
          prev.map((p) =>
            p._id === id
              ? {
                  ...p,
                  isApproved: true,
                }
              : p
          )
        );

      } catch (err) {

        console.error(err);

      }
    };

  // ---------------- DELETE PRODUCT ----------------

  const deleteProduct =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete this product?"
        );

      if (!confirmDelete) return;

      try {

        await API.delete(
          `/products/${id}`
        );

        setProducts((prev) =>
          prev.filter(
            (p) => p._id !== id
          )
        );

      } catch (err) {

        console.error(err);

      }
    };

  // ---------------- DELETE USER ----------------

  const deleteUser =
    async (id) => {

      try {

        await API.delete(
          `/users/${id}`
        );

        setUsers((prev) =>
          prev.filter(
            (u) => u._id !== id
          )
        );

      } catch (err) {

        console.error(err);

      }
    };

  // ---------------- DELETE VENDOR ----------------

  const deleteVendor =
    async (id) => {

      try {

        await API.delete(
          `/users/${id}`
        );

        setVendors((prev) =>
          prev.filter(
            (v) => v._id !== id
          )
        );

      } catch (err) {

        console.error(err);

      }
    };

  // ---------------- UPDATE ORDER ----------------

  const updateOrderStatus =
    async (id, status) => {

      try {

        await API.put(
          `/orders/status/${id}`,
          { status }
        );

        setOrders((prev) =>
          prev.map((order) =>
            order._id === id
              ? {
                  ...order,
                  status,
                }
              : order
          )
        );

      } catch (err) {

        console.error(err);

      }
    };

  // ---------------- FILTER ORDERS ----------------

  const currentOrders =
    orders.filter(
      (o) =>
        o.status !== "delivered"
    );

  const completedOrders =
    orders.filter(
      (o) =>
        o.status === "delivered"
    );

  // ---------------- LOADING ----------------

  if (loading) {

    return (
      <div className="loading-box">

        <h2>
          Loading Admin Dashboard...
        </h2>

      </div>
    );
  }

  return (

    <div className="admin-container">

      {/* ---------------- NAVBAR ---------------- */}

      <div className="admin-navbar">

        <div className="admin-nav-left">

          <h2>
            Admin Dashboard
          </h2>

          <button
            onClick={() =>
              setActiveTab(
                "products"
              )
            }
          >
            Products
          </button>

          <button
            onClick={() =>
              setActiveTab(
                "orders"
              )
            }
          >
            Orders
          </button>

          <button
            onClick={() =>
              setActiveTab(
                "productStats"
              )
            }
          >
            Product Stats
          </button>

          <button
            onClick={() =>
              setActiveTab(
                "vendorStats"
              )
            }
          >
            Vendor Stats
          </button>

          <button
            onClick={() =>
              setActiveTab(
                "users"
              )
            }
          >
            Users
          </button>

          <button
            onClick={() =>
              setActiveTab(
                "vendors"
              )
            }
          >
            Vendors
          </button>

        </div>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

      {/* ---------------- PRODUCTS ---------------- */}

      {activeTab ===
        "products" && (

        <>
          <div className="section-title">

            <h2>
              Products
            </h2>

          </div>

          <div className="admin-grid">

            {products.map(
              (product) => (

                <div
                  key={
                    product._id
                  }
                  className="admin-card"
                  onClick={() =>
                    openProductDetails(
                      product
                    )
                  }
                >

                  <img
                    src={
                      product
                        .images?.[0] ||
                      "/placeholder.png"
                    }
                    alt={
                      product.productName
                    }
                  />

                  <div className="card-content">

                    <h3>
                      {
                        product.productName
                      }
                    </h3>

                    <p>
                      ₹{" "}
                      {
                        product.price
                      }
                    </p>

                    <p>
                      Vendor:
                      {" "}
                      {
                        product
                          .vendorId
                          ?.name
                      }
                    </p>

                    <p>
                      Stock:
                      {" "}
                      {
                        product.stock
                      }
                    </p>

                    <p>
                      Status:
                      {" "}
                      {product.isApproved
                        ? "Approved"
                        : "Pending"}
                    </p>

                    {!product.isApproved && (

                      <button
                        className="approve-btn"
                        onClick={(e) => {

                          e.stopPropagation();

                          approveProduct(
                            product._id
                          );

                        }}
                      >
                        Approve
                      </button>

                    )}

                    <button
                      className="delete-btn"
                      onClick={(e) => {

                        e.stopPropagation();

                        deleteProduct(
                          product._id
                        );

                      }}
                    >
                      Delete
                    </button>

                  </div>

                </div>
              )
            )}

          </div>
        </>
      )}

      {/* ---------------- ORDERS ---------------- */}

    {activeTab === "orders" && (() => {

  // GROUP ORDERS BY CUSTOMER

  const groupedOrders = {};

  orders.forEach((order) => {

    const customerId =
      order.customerId?._id ||
      "unknown";

    if (!groupedOrders[customerId]) {

      groupedOrders[customerId] = {

        customer:
          order.customerId,

        currentOrders: [],

        completedOrders: [],
      };
    }

    if (
      order.status ===
      "delivered"
    ) {

      groupedOrders[
        customerId
      ].completedOrders.push(
        order
      );

    } else {

      groupedOrders[
        customerId
      ].currentOrders.push(
        order
      );
    }
  });

  return (

    <div className="orders-page">

      {Object.entries(
        groupedOrders
      ).map(
        ([customerId, data]) => (

          <div
            key={customerId}
            className="customer-orders-card"
          >

            {/* CUSTOMER INFO */}

            <div className="customer-header">

              <div>

                <h2>
                  {
                    data.customer
                      ?.name
                  }
                </h2>

                <p>
                  {
                    data.customer
                      ?.email
                  }
                </p>

                <p>
                  {
                    data.customer
                      ?.phoneno
                  }
                </p>

              </div>

              <div className="customer-order-count">

                <h3>
                  Total Orders
                </h3>

                <p>
                  {
                    data
                      .currentOrders
                      .length +
                    data
                      .completedOrders
                      .length
                  }
                </p>

              </div>

            </div>

            {/* CURRENT ORDERS */}

            {data.currentOrders
              .length > 0 && (

              <div>

                <h3 className="order-section-title">
                  Current Orders
                </h3>

                {data.currentOrders.map(
                  (order) => (

                    <div
                      key={
                        order._id
                      }
                      className="single-customer-order"
                    >

                      <div className="order-top-bar">

                        <div>

                          <p>
                            <strong>
                              Order ID:
                            </strong>
                            {" "}
                            {
                              order._id
                            }
                          </p>

                          <p>
                            <strong>
                              Amount:
                            </strong>
                            {" "}
                            ₹
                            {" "}
                            {
                              order.totalAmt
                            }
                          </p>

                        </div>

                        <div>

                          <p>
                            <strong>
                              Date:
                            </strong>
                            {" "}
                            {order.createdAt
                              ? new Date(
                                  order.createdAt
                                ).toDateString()
                              : "No Date"}
                          </p>

                        </div>

                      </div>

                      {/* PRODUCTS */}

                      <div className="products-list-admin">

                        {order.products?.map(
                          (
                            item
                          ) => {

                            const product =
                              item.productId;

                            if (
                              !product
                            )
                              return null;

                            return (

                              <div
                                key={
                                  product._id
                                }
                                className="admin-product-row"
                              >

                                <img
                                  src={
                                    product
                                      ?.images?.[0]
                                  }
                                  alt={
                                    product?.productName
                                  }
                                />

                                <div>

                                  <h4>
                                    {
                                      product?.productName
                                    }
                                  </h4>

                                  <p>
                                    Quantity:
                                    {" "}
                                    {
                                      item.quantity
                                    }
                                  </p>

                                  <p>
                                    ₹
                                    {" "}
                                    {
                                      item.price
                                    }
                                  </p>

                                </div>

                              </div>
                            );
                          }
                        )}

                      </div>

                      {/* STATUS */}

                      <div className="order-status-admin">

                        <select
                          value={
                            order.status
                          }
                          onChange={(
                            e
                          ) =>
                            updateOrderStatus(
                              order._id,
                              e.target
                                .value
                            )
                          }
                        >

                          <option value="pending">
                            Pending
                          </option>

                          <option value="shipping">
                            Shipping
                          </option>

                          <option value="paid">
                            Paid
                          </option>

                          <option value="delivered">
                            Delivered
                          </option>

                          <option value="cancelled">
                            Cancelled
                          </option>

                        </select>

                      </div>

                    </div>
                  )
                )}

              </div>
            )}

            {/* COMPLETED */}

            {data.completedOrders
              .length > 0 && (

              <div>

                <h3 className="order-section-title">
                  Completed Orders
                </h3>

                {data.completedOrders.map(
                  (order) => (

                    <div
                      key={
                        order._id
                      }
                      className="single-customer-order completed-order"
                    >

                      <div className="order-top-bar">

                        <div>

                          <p>
                            <strong>
                              Order ID:
                            </strong>
                            {" "}
                            {
                              order._id
                            }
                          </p>

                          <p>
                            <strong>
                              Amount:
                            </strong>
                            {" "}
                            ₹
                            {" "}
                            {
                              order.totalAmt
                            }
                          </p>

                        </div>

                        <div>

                          <p>
                            <strong>
                              Date:
                            </strong>
                            {" "}
                            {order.createdAt
                              ? new Date(
                                  order.createdAt
                                ).toDateString()
                              : "No Date"}
                          </p>

                        </div>

                      </div>

                      <div className="products-list-admin">

                        {order.products?.map(
                          (
                            item
                          ) => {

                            const product =
                              item.productId;

                            if (
                              !product
                            )
                              return null;

                            return (

                              <div
                                key={
                                  product._id
                                }
                                className="admin-product-row"
                              >

                                <img
                                  src={
                                    product
                                      ?.images?.[0]
                                  }
                                  alt={
                                    product?.productName
                                  }
                                />

                                <div>

                                  <h4>
                                    {
                                      product?.productName
                                    }
                                  </h4>

                                  <p>
                                    Quantity:
                                    {" "}
                                    {
                                      item.quantity
                                    }
                                  </p>

                                  <p>
                                    ₹
                                    {" "}
                                    {
                                      item.price
                                    }
                                  </p>

                                </div>

                              </div>
                            );
                          }
                        )}

                      </div>

                    </div>
                  )
                )}

              </div>
            )}

          </div>
        )
      )}

    </div>
  );
})()}

      {/* ---------------- PRODUCT STATS ---------------- */}

      {activeTab ===
        "productStats" && (

        <>

          <div className="section-title">

            <h2>
              Product Statistics
            </h2>

          </div>

          <div className="stats-grid">

            {products.map(
              (product) => {

                let sold = 0;

                orders.forEach(
                  (order) => {

                    order.products?.forEach(
                      (
                        item
                      ) => {

                        if (
                          item
                            .productId
                            ?._id ===
                          product._id
                        ) {

                          sold +=
                            item.quantity;

                        }
                      }
                    );
                  }
                );

                return (

                  <div
                    key={
                      product._id
                    }
                    className="stats-card"
                  >

                    <img
                      src={
                        product
                          .images?.[0]
                      }
                      alt={
                        product.productName
                      }
                      className="stats-img"
                    />

                    <h3>
                      {
                        product.productName
                      }
                    </h3>

                    <p>
                      Price:
                      {" "}
                      ₹
                      {" "}
                      {
                        product.price
                      }
                    </p>

                    <p>
                      Sold:
                      {" "}
                      {
                        sold
                      }
                    </p>

                    <p>
                      Left:
                      {" "}
                      {
                        product.stock
                      }
                    </p>

                    <div className="graph-bar-bg">

                      <div
                        className="graph-bar"
                        style={{
                          width: `${Math.min(
                            sold * 10,
                            100
                          )}%`,
                        }}
                      >

                        {sold}

                      </div>

                    </div>

                  </div>
                );
              }
            )}

          </div>

        </>
      )}

      {/* ---------------- VENDOR STATS ---------------- */}

      {activeTab ===
        "vendorStats" && (

        <>

          <div className="section-title">

            <h2>
              Vendor Statistics
            </h2>

          </div>

          <div className="stats-grid">

            {vendors.map(
              (vendor) => {

                const vendorProducts =
                  products.filter(
                    (p) =>
                      p.vendorId
                        ?._id ===
                      vendor._id
                  );

                return (

                  <div
                    key={
                      vendor._id
                    }
                    className="stats-card"
                  >

                    <h3>
                      {
                        vendor.name
                      }
                    </h3>

                    <p>
                      Email:
                      {" "}
                      {
                        vendor.email
                      }
                    </p>

                    <p>
                      Phone:
                      {" "}
                      {
                        vendor.phoneno
                      }
                    </p>

                    <p>
                      Address:
                      {" "}
                      {
                        vendor.address
                      }
                    </p>

                    <p>
                      Products:
                      {" "}
                      {
                        vendorProducts.length
                      }
                    </p>

                    <h4>
                      Product List
                    </h4>

                    {vendorProducts.map(
                      (p) => (

                        <p
                          key={
                            p._id
                          }
                        >
                          •{" "}
                          {
                            p.productName
                          }
                        </p>
                      )
                    )}

                    

                  </div>
                );
              }
            )}

          </div>

        </>
      )}

      {/* ---------------- USERS ---------------- */}

      {activeTab ===
        "users" && (

        <>

          <div className="section-title">

            <h2>
              All Users
            </h2>

          </div>

          <div className="stats-grid">

            {users.map((user) => (

              <div
                key={user._id}
                className="stats-card"
              >

                <h3>
                  {user.name}
                </h3>

                <p>
                  Email:
                  {" "}
                  {user.email}
                </p>

                <p>
                  Phone:
                  {" "}
                  {user.phoneno}
                </p>

                <p>
                  Address:
                  {" "}
                  {user.address}
                </p>

                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteUser(
                      user._id
                    )
                  }
                >
                  Delete User
                </button>

              </div>
            ))}

          </div>

        </>
      )}

      {/* ---------------- VENDORS ---------------- */}

      {activeTab ===
        "vendors" && (

        <>
          <div className="section-title">

            <h2>
              All Vendors
            </h2>

          </div>

          <div className="stats-grid">

            {vendors.map(
              (vendor) => (

                <div
                  key={
                    vendor._id
                  }
                  className="stats-card"
                >

                  <h3>
                    {
                      vendor.name
                    }
                  </h3>

                  <p>
                    Email:
                    {" "}
                    {
                      vendor.email
                    }
                  </p>

                  <p>
                    Phone:
                    {" "}
                    {
                      vendor.phoneno
                    }
                  </p>

                  <p>
                    Address:
                    {" "}
                    {
                      vendor.address
                    }
                  </p>
                  <button
                      className="delete-btn"
                      onClick={() =>
                        deleteVendor(
                          vendor._id
                        )
                      }
                    >
                      Delete Vendor
                    </button>

                </div>
              )
            )}

          </div>
        </>
      )}

      {/* ---------------- PRODUCT MODAL ---------------- */}

      {selectedProduct && (

        <div className="product-modal-overlay">

          <div className="product-modal">

            <button
              className="close-modal"
              onClick={() =>
                setSelectedProduct(
                  null
                )
              }
            >
              ✖
            </button>

            <img
              src={
                selectedProduct
                  .images?.[0]
              }
              alt={
                selectedProduct.productName
              }
            />

            <h2>
              {
                selectedProduct.productName
              }
            </h2>

            <h3>
              ₹
              {" "}
              {
                selectedProduct.price
              }
            </h3>

            <p>
              {
                selectedProduct.productDescription
              }
            </p>

            <p>
              Stock:
              {" "}
              {
                selectedProduct.stock
              }
            </p>

            <h3>
              Reviews
            </h3>

            {reviews.length === 0 && (
              <p>
                No reviews yet
              </p>
            )}

            {reviews.map(
              (review) => (

                <div
                  key={
                    review._id
                  }
                  className="review-box"
                >

                  <p>
                    {"⭐".repeat(
                      review.rating
                    )}
                  </p>

                  <p>
                    {
                      review.feedback
                    }
                  </p>

                </div>
              )
            )}

          </div>

        </div>
      )}

    </div>
  );
}

export default AdminDashboard;