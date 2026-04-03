// src/components/Header.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/header.css"; // optional, for styling

function Header({ activeTab, setActiveTab, handleLogout }) {
  const navigate = useNavigate();

  const tabs = [
    { name: "Home", key: "home" },
    { name: "Cart", key: "cart" },
    { name: "Liked", key: "liked" },
    { name: "Orders", key: "orders" },
    { name: "Profile", key: "profile" },
    { name: "Logout", key: "logout" },
  ];

  return (
    <div className="full-width-navbar">
      <div className="customer-header-navbar">
        <div className="logo">
          <h1>AmazPro</h1>
        </div>
        <div className="customer-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={activeTab === tab.key ? "tab active-tab" : "tab"}
              onClick={() => {
                if (tab.key === "logout") handleLogout();
                else if (tab.key === "cart") navigate("/cart");
                else setActiveTab(tab.key);
              }}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Header;