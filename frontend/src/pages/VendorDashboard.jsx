import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../styles/vendor.css";
import Cart from "./Cart";

function VendorDashboard() {
  const user =
  JSON.parse(
    localStorage.getItem("user")
  );

  const navigate = useNavigate();

  // ---------------- STATES ----------------

  const [activeTab, setActiveTab] = useState("home");

  const [products, setProducts] = useState([]);
  const [vendorProducts, setVendorProducts] = useState([]);
  const [vendorOrders, setVendorOrders] = useState([]);
  const [selectedProduct,
  setSelectedProduct] =
  useState(null);

const [productReviews,
  setProductReviews] =
  useState([]);
  const [cart, setCart] = useState([]);
  const [liked, setLiked] = useState([]);

  const [profile, setProfile] = useState(null);

  const [editProfile, setEditProfile] = useState(false);

  const [profileForm, setProfileForm] = useState({});

  const [incomeStats, setIncomeStats] = useState({
    totalIncome: 0,
    totalProductsSold: 0,
    totalOrders: 0,
    mostSellingProduct: "",
  });
{/* ---------------- STATES ---------------- */}

const [showAddProduct, setShowAddProduct] =
  useState(false);

const [newProduct, setNewProduct] =
  useState({
    productName: "",
    productDescription: "",
    price: "",
    stock: "",
    image: "",
  });

/* ---------------- HANDLE PRODUCT INPUT ---------------- */

const handleProductChange = (e) => {

  const { name, value } = e.target;

  setNewProduct((prev) => ({
    ...prev,
    [name]: value,
  }));
};
const openProduct =
  async (product) => {

    try {

      setSelectedProduct(
        product
      );

      const res =
        await API.get(
          `/reviews/${product._id}`
        );

      setProductReviews(
        res.data
      );

      window.scrollTo({
        top:
          document.body.scrollHeight,

        behavior: "smooth",
      });

    } catch (err) {

      console.error(err);

    }
  };
/* ---------------- ADD PRODUCT ---------------- */

const addProduct = async () => {

  try {

    await API.post("/products", {
      productName:
        newProduct.productName,

      productDescription:
        newProduct.productDescription,

      price: Number(newProduct.price),

      stock: Number(newProduct.stock),

      images: [newProduct.image],
    });

    alert("Product Added");

    setShowAddProduct(false);

    setNewProduct({
      productName: "",
      productDescription: "",
      price: "",
      stock: "",
      image: "",
    });

    fetchVendorProducts();

    fetchAllProducts();

  } catch (err) {

    console.error(err);

    alert("Failed to add product");

  }
};
  // ---------------- FETCH PRODUCTS ----------------

  const fetchAllProducts = async () => {
    try {

      const res = await API.get("/products");

      setProducts(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- FETCH VENDOR PRODUCTS ----------------

  const fetchVendorProducts = async () => {
    try {

      const res = await API.get("/products/vendor");

      setVendorProducts(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- FETCH VENDOR ORDERS ----------------

  const fetchVendorOrders = async () => {
    try {

      const res = await API.get("/orders/vendor-orders");

      setVendorOrders(res.data);

      calculateIncomeStats(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- FETCH PROFILE ----------------

  const fetchProfile = async () => {
    try {

      const res = await API.get("/users/profile");

      setProfile(res.data);

      setProfileForm(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- FETCH CART ----------------

  const fetchCart = async () => {
    try {

      const res = await API.get("/cart");

      setCart(res.data.items || []);

    } catch (err) {

      console.error(err);

      setCart([]);

    }
  };

  // ---------------- FETCH LIKED ----------------

  const fetchLiked = async () => {
    try {

      const res = await API.get("/liked");

      const productsOnly =
        res.data.items?.map((i) => i.productId) || [];

      setLiked(productsOnly);

    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- CALCULATE INCOME ----------------

  const calculateIncomeStats = (orders) => {

    let totalIncome = 0;

    let totalProductsSold = 0;

    const salesMap = {};

    orders.forEach((order) => {

      totalIncome += order.totalAmt;

      order.products?.forEach((item) => {

        totalProductsSold += item.quantity;

        const productName =
          item.productId?.productName || "Unknown";

        if (!salesMap[productName]) {
          salesMap[productName] = 0;
        }

        salesMap[productName] += item.quantity;

      });

    });

    let max = 0;

    let bestProduct = "";

    for (let key in salesMap) {

      if (salesMap[key] > max) {

        max = salesMap[key];

        bestProduct = key;

      }
    }

    setIncomeStats({
      totalIncome,
      totalProductsSold,
      totalOrders: orders.length,
      mostSellingProduct: bestProduct,
    });
  };

  // ---------------- ADD TO CART ----------------

  const addToCart = async (product) => {
    try {

      await API.post("/cart", {
        productId: product._id,
        quantity: 1,
      });

      fetchCart();

    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- LIKE PRODUCT ----------------

  const likeProduct = async (product) => {
    try {

      await API.post("/liked/add", {
        productId: product._id,
      });

      fetchLiked();

    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- UPDATE ORDER STATUS ----------------

  const updateStatus = async (id, status) => {
    try {

      await API.put(`/orders/vendor/${id}`, {
        status,
      });

      fetchVendorOrders();

    } catch (err) {
      console.error(err);
    }
  };


  const updateStock =
  async (
    productId,
    newStock
  ) => {

    try {

      await API.put(
        `/products/${productId}`,
        {
          stock: newStock,
        }
      );

      setVendorProducts(
        (prev) =>

          prev.map((p) =>

            p._id === productId

              ? {
                  ...p,
                  stock: newStock,
                }

              : p
          )
      );

    } catch (err) {

      console.error(err);

      alert(
        "Failed to update stock"
      );
    }
  };


  

  // ---------------- DELETE PRODUCT ----------------

  const deleteProduct = async (id) => {
    try {

      await API.delete(`/products/${id}`);

      fetchVendorProducts();

    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- APPLY OFFER ----------------

  const applyOffer = async (id) => {

    const discount = prompt("Enter discount %");

    if (!discount) return;

    try {

      await API.put(`/products/${id}`, {
        discount,
      });

      fetchVendorProducts();

    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- PROFILE ----------------

  const handleProfileChange = (e) => {

    const { name, value } = e.target;

    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveProfile = async () => {
    try {

      await API.put("/users/profile", profileForm);

      setProfile(profileForm);

      setEditProfile(false);

    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- LOGOUT ----------------
const handleLogout = () => {

  // CLEAR EVERYTHING

  localStorage.clear();

  // REDIRECT CLEANLY

  navigate("/login", {
    replace: true,
  });

};

  // ---------------- FILTER ----------------

  const filteredProducts = products.filter((p) =>
    p.productName
      .toLowerCase()
      .includes("")
  );

  // ---------------- INITIAL LOAD ----------------

  useEffect(() => {

    fetchAllProducts();

    fetchVendorProducts();

    fetchVendorOrders();

    fetchProfile();

    fetchCart();

    fetchLiked();

  }, []);

  return (

    <div
      className="customer-dashboard"
      style={{ backgroundColor: "pink" }}
    >

      {/* ---------------- NAVBAR ---------------- */}

      <div className="top-navbar">

        <div className="nav-left">

          <h2 className="logo">
            Vendor Dashboard
          </h2>

          <button
            onClick={() => setActiveTab("home")}
          >
            Home
          </button>

          

          <button
            onClick={() => setActiveTab("orders")}
          >
            Orders
          </button>

          <button
            onClick={() => setActiveTab("myProducts")}
          >
            My Products
          </button>

          <button
            onClick={() => setActiveTab("income")}
          >
            Income Stats
          </button>

          <button
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>

        </div>

        <div className="nav-right">

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>
      </div>

      {/* ---------------- HOME ---------------- */}

    {activeTab === "home" && (

  <>
    <div className="dashboard-grid">

      {filteredProducts
        .filter(
          (product) =>
            product.isApproved === true
        )
        .map((product) => (

          <div
            key={product._id}
            className="dashboard-card"
            onClick={() =>
              openProduct(product)
            }
          >

            <img
              src={
                product.images?.[0] ||
                "/placeholder.png"
              }
              alt={
                product.productName
              }
            />

            <h4>
              {
                product.productName
              }
            </h4>

            <p>
              ₹ {product.price}
            </p>

            <button
              onClick={(e) => {

                e.stopPropagation();

                addToCart(product);

              }}
            >
              Add To Cart
            </button>

            <button
              onClick={(e) => {

                e.stopPropagation();

                likeProduct(product);

              }}
            >
              ❤️ Like
            </button>

          </div>
        ))}

    </div>

    {/* PRODUCT DETAILS */}

    {selectedProduct && (

      <div className="inline-product-details">

        <button
          className="close-details-btn"
          onClick={() =>
            setSelectedProduct(
              null
            )
          }
        >
          ✖
        </button>

        <div className="inline-product-top">

          <img
            src={
              selectedProduct
                ?.images?.[0]
            }
            alt={
              selectedProduct
                ?.productName
            }
          />

          <div>

            <h2>
              {
                selectedProduct
                  ?.productName
              }
            </h2>

            <h3>
              ₹
              {" "}
              {
                selectedProduct
                  ?.price
              }
            </h3>

            <p>
              {
                selectedProduct
                  ?.productDescription
              }
            </p>

            <p>
              <strong>
                Stock:
              </strong>
              {" "}
              {
                selectedProduct
                  ?.stock
              }
            </p>

            <div className="inline-actions">

              

            </div>

          </div>

        </div>

        {/* REVIEWS */}

        <div className="inline-reviews">

          <h3>
            Reviews
          </h3>

          {productReviews
            .length === 0 && (

            <p>
              No reviews yet
            </p>
          )}

          {productReviews.map(
            (review) => (

              <div
                key={
                  review._id
                }
                className="inline-review-card"
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

  </>
)}
      {/* ---------------- CART ---------------- */}

      {activeTab === "cart" && (
        <Cart
          cart={cart}
          fetchCart={fetchCart}
        />
      )}

      {/* ---------------- LIKED ---------------- */}

      {activeTab === "liked" && (
        <>
          <h3>Liked Products</h3>

          {liked.length === 0 && (
            <p>No liked products</p>
          )}

          <div className="dashboard-grid">

            {liked.map((p) => (

              <div
                key={p._id}
                className="dashboard-card"
              >

                <img
                  src={
                    p.images?.[0] ||
                    "/placeholder.png"
                  }
                  alt={p.productName}
                />

                <h4>{p.productName}</h4>

                <p>₹ {p.price}</p>

              </div>
            ))}
          </div>
        </>
      )}

      {/* ---------------- VENDOR ORDERS ---------------- */}

      {activeTab === "orders" && (

  <>
    <h3>
      Vendor Orders
    </h3>

    {vendorOrders.length === 0 && (
      <p>
        No orders found
      </p>
    )}

    <div className="vendor-orders-container">

      {vendorOrders.map((order) => {

        // ONLY VENDOR PRODUCTS

        const vendorProducts =
  order.products?.filter(
    (prod) =>

      prod.productId
        ?.vendorId ===
        user?._id ||

      prod.productId
        ?.vendorId?._id ===
        user?._id
  );
        // SKIP EMPTY

        if (
          !vendorProducts ||
          vendorProducts.length === 0
        ) {
          return null;
        }

        // VENDOR TOTAL

        const vendorTotal =
          vendorProducts.reduce(
            (acc, item) =>
              acc +
              item.price *
                item.quantity,
            0
          );

        return (

          <div
            key={order._id}
            className="vendor-order-card"
          >

            {/* ORDER HEADER */}

            <div className="vendor-order-header">

              <div>

                <p>
                  <strong>
                    Order ID:
                  </strong>
                  {" "}
                  {order._id}
                </p>

                <p>
                  <strong>
                    Customer:
                  </strong>
                  {" "}
                  {
                    order.customerId
                      ?.name
                  }
                </p>

                <p>
                  <strong>
                    Email:
                  </strong>
                  {" "}
                  {
                    order.customerId
                      ?.email
                  }
                </p>

              </div>

              <div>

                <p>
                  <strong>
                    Status:
                  </strong>
                  {" "}
                  {order.status}
                </p>

                <p>
                  <strong>
                    Date:
                  </strong>
                  {" "}
                  {order.createdAt
                    ? new Date(
                        order.createdAt
                      ).toLocaleDateString()
                    : "No Date"}
                </p>

              </div>

            </div>

            {/* PRODUCTS */}

            <div className="vendor-products-list">

              {vendorProducts.map(
                (prod) => (

                  <div
                    key={prod._id}
                    className="vendor-product-item"
                  >

                    <img
                      src={
                        prod
                          .productId
                          ?.images?.[0] ||
                        "/placeholder.png"
                      }
                      alt={
                        prod
                          .productId
                          ?.productName
                      }
                    />

                    <div>

                      <h4>
                        {
                          prod
                            .productId
                            ?.productName
                        }
                      </h4>

                      <p>
                        Quantity:
                        {" "}
                        {
                          prod.quantity
                        }
                      </p>

                      <p>
                        ₹
                        {" "}
                        {
                          prod.price
                        }
                      </p>
          <p>
  <strong>
    Stock Left:
  </strong>
  {" "}
  {
    prod.productId?.stock
  }
</p>

<p>
  <strong>
    Sold:
  </strong>
  {" "}
  {
    prod.productId?.sold || 0
  }
</p>

                    </div>

                  </div>
                )
              )}

            </div>

            {/* TOTAL */}

            <div className="vendor-order-footer">

              <h3>
                Vendor Total:
                {" "}
                ₹ {vendorTotal}
              </h3>

              <select
                value={order.status}
                onChange={(e) =>
                  updateStatus(
                    order._id,
                    e.target.value
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
        );
      })}

    </div>
  </>
)}

      {/* ---------------- MY PRODUCTS ---------------- */}

{activeTab === "myProducts" && (

  <>
    <div className="my-products-header">

      <h3>
        My Products
      </h3>

      <button
        className="add-product-btn"
        onClick={() =>
          navigate("/add-product")
        }
      >
        + Add Product
      </button>

    </div>

    {vendorProducts.length === 0 && (

      <p>
        No products added
      </p>
    )}

    <div className="dashboard-grid">

      {vendorProducts.map(
        (product) => (

          <div
            key={product._id}
            className="dashboard-card"
          >

            {/* IMAGE */}

            <img
              src={
                product.images?.[0] ||
                "/placeholder.png"
              }
              alt={
                product.productName
              }
            />

            {/* INFO */}

            <h4>
              {
                product.productName
              }
            </h4>

            <p>
              ₹ {product.price}
            </p>

            <p>
              <strong>
                Sold:
              </strong>
              {" "}
              {
                product.sold || 0
              }
            </p>

            {/* STOCK */}

            <div className="stock-controls">

              <p>
                <strong>
                  Stock:
                </strong>
                {" "}
                {product.stock}
              </p>

              <div className="stock-buttons">

                {/* INCREASE */}

                <button
                  className="stock-btn"
                  onClick={(e) => {

                    e.stopPropagation();

                    updateStock(
                      product._id,
                      product.stock + 1
                    );

                  }}
                >
                  +
                </button>

                {/* DECREASE */}

                <button
                  className="stock-btn"
                  onClick={(e) => {

                    e.stopPropagation();

                    if (
                      product.stock > 0
                    ) {

                      updateStock(
                        product._id,
                        product.stock - 1
                      );

                    }

                  }}
                >
                  -
                </button>

              </div>

            </div>

            {/* STATUS */}

            <p>
              <strong>
                Status:
              </strong>
              {" "}
              {product.isApproved
                ? "Approved"
                : "Pending"}
            </p>

            {/* ACTIONS */}

            <div className="vendor-product-actions">

              <button
                className="offer-btn"
                onClick={() =>
                  applyOffer(
                    product._id
                  )
                }
              >
                Apply Offer
              </button>

              <button
                className="delete-btn"
                onClick={() =>
                  deleteProduct(
                    product._id
                  )
                }
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
      {/* ---------------- INCOME STATS ---------------- */}

      {/* ---------------- INCOME STATS ---------------- */}

{/* ---------------- INCOME STATS ---------------- */}

{activeTab === "income" && (() => {

  let totalIncome = 0;

  let totalProductsSold = 0;

  let totalOrders = 0;

  const productSales = {};

  vendorOrders.forEach((order) => {

    let vendorOrderFound = false;

    order.products?.forEach((item) => {

      // order stores productId
      const orderedProductId =
        item.productId?._id;

      // find matching vendor product
      const vendorProduct =
        vendorProducts.find(
          (p) =>
            p._id === orderedProductId
        );

      // only calculate this vendor products
      if (vendorProduct) {

        vendorOrderFound = true;

        const qty = item.quantity;

        const price = item.price;

        const income = qty * price;

        totalIncome += income;

        totalProductsSold += qty;

        // product wise stats
        if (
          !productSales[
            vendorProduct.productName
          ]
        ) {

          productSales[
            vendorProduct.productName
          ] = {
            qty: 0,
            income: 0,
          };
        }

        productSales[
          vendorProduct.productName
        ].qty += qty;

        productSales[
          vendorProduct.productName
        ].income += income;
      }
    });

    if (vendorOrderFound) {
      totalOrders++;
    }
  });

  // most selling
  let mostSellingProduct = "N/A";

  let maxQty = 0;

  Object.entries(productSales).forEach(
    ([name, data]) => {

      if (data.qty > maxQty) {

        maxQty = data.qty;

        mostSellingProduct = name;
      }
    }
  );

  return (

    <div className="profile-card">

      <h2>Income Statistics</h2>

      <p>
        <strong>Total Income:</strong>
        {" "}
        ₹ {totalIncome}
      </p>

      <p>
        <strong>Total Orders:</strong>
        {" "}
        {totalOrders}
      </p>

      <p>
        <strong>Total Products Sold:</strong>
        {" "}
        {totalProductsSold}
      </p>

      <p>
        <strong>Most Selling Product:</strong>
        {" "}
        {mostSellingProduct}
      </p>

      {/* ---------------- PRODUCT WISE ---------------- */}

      <h3 style={{ marginTop: "25px" }}>
        Product Wise Statistics
      </h3>

      {Object.entries(productSales).map(
        ([name, data]) => (

          <div
            key={name}
            style={{
              backgroundColor: "#fff0f3",
              padding: "15px",
              borderRadius: "12px",
              marginTop: "15px",
            }}
          >

            <p>
              <strong>Product:</strong>
              {" "}
              {name}
            </p>

            <p>
              <strong>Quantity Sold:</strong>
              {" "}
              {data.qty}
            </p>

            <p>
              <strong>Income:</strong>
              {" "}
              ₹ {data.income}
            </p>

          </div>
        )
      )}

    </div>
  );

})()}
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

              <button onClick={saveProfile}>
                Save
              </button>

              <button
                onClick={() =>
                  setEditProfile(false)
                }
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <h3>Profile</h3>

              <p>
                <strong>Name:</strong>
                {" "}
                {profile.name}
              </p>

              <p>
                <strong>Email:</strong>
                {" "}
                {profile.email}
              </p>

              <p>
                <strong>Phone:</strong>
                {" "}
                {profile.phoneno}
              </p>

              <p>
                <strong>Address:</strong>
                {" "}
                {profile.address}
              </p>

              <button
                onClick={() =>
                  setEditProfile(true)
                }
              >
                Edit Profile
              </button>
            </>
          )}
        </div>
      )}

    </div>
  );
}

export default VendorDashboard;