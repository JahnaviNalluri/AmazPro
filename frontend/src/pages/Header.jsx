import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/header.css";

function Header({ activeTab, setActiveTab, handleLogout }) {
  const navigate = useNavigate();
//chey
  const tabs = [
    { name: "Home", key: "home", path: "/customer" },
    { name: "Cart", key: "cart", path: "/cart" },
    { name: "Liked", key: "liked", path: "/liked" },
    { name: "Orders", key: "orders", path: "/orders" },
    { name: "Profile", key: "profile", path: "/profile" },
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
                if (tab.key === "logout") {
                  handleLogout && handleLogout();
                  return;
                }

                // update active tab safely
                setActiveTab && setActiveTab(tab.key);

                // navigate if path exists
                if (tab.path) {
                  navigate(tab.path);
                }
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