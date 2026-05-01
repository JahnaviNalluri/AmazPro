import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/navbar.css";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const tabs = [
    { name: "Home", key: "home", path: "/customer" },
    { name: "Cart", key: "cart", path: "/cart" },
    { name: "Liked", key: "liked", path: "/liked" },
    { name: "Orders", key: "orders", path: "/orders" },
    { name: "Profile", key: "profile", path: "/profile" },
  ];

  return (

    <div className="navbar">
     <div className="navbar-inner">
      {/* Logo */}
      <div className="logo">
        <Link to="/home">AmazPro</Link>
      </div>

      {/* Search Bar (only when logged in if you want, or always visible) */}
      {user && (
        <div className="search-bar">
          <input type="text" placeholder="Search products..." />
          <button>Search</button>
        </div>
      )}

      {/* Nav Links */}
      <div className="nav-links">

        {/* NOT LOGGED IN */}
        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            {/* Tabs */}
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={activeTab === tab.key ? "active-tab" : ""}
                onClick={() => {
                  setActiveTab(tab.key);
                  navigate(tab.path);
                }}
              >
                {tab.name}
              </button>
            ))}

            {/* Logout */}
            <button onClick={handleLogout}>Logout</button>
          </>
        )}

      </div>
      </div>
    </div>
  );
}

export default Navbar;