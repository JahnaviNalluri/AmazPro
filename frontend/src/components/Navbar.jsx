import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useContext,
  useState,
} from "react";

import {
  AuthContext
} from "../context/AuthContext";

import "../styles/navbar.css";

function Navbar() {

  const {
    user,
    logout
  } = useContext(
    AuthContext
  );

  const navigate =
    useNavigate();

  const [activeTab,
    setActiveTab] =
    useState("home");

  const handleLogout =
    () => {

      logout();

      localStorage.clear();

      navigate(
        "/login",
        {
          replace: true,
        }
      );
    };

  const tabs = [

    {
      name: "Home",
      key: "home",
      path: "/customer",
    },

    {
      name: "Cart",
      key: "cart",
      path: "/cart",
    },

    {
      name: "Liked",
      key: "liked",
      path: "/liked",
    },

    {
      name: "Orders",
      key: "orders",
      path: "/orders",
    },

    {
      name: "Profile",
      key: "profile",
      path: "/profile",
    },
  ];

  return (

    <div className="navbar">

      <div className="navbar-inner">

        {/* LOGO */}

        <div className="logo">

          <Link to="/home">
            AmazPro
          </Link>

        </div>

        {/* SEARCH ONLY FOR CUSTOMER */}

        {user?.role === "user" && (

          <div className="search-bar">

            <input
              type="text"
              placeholder="Search products..."
            />

            <button>
              Search
            </button>

          </div>
        )}

        {/* NAVIGATION */}

        <div className="nav-links">

          {/* PUBLIC */}

          {!user ? (

            <>

              <Link to="/login">
                Login
              </Link>

              <Link to="/register">
                Register
              </Link>

            </>

          ) : (

            <>

              {/* CUSTOMER TABS ONLY */}

              {user?.role ===
                "user" && (

                <>

                  {tabs.map(
                    (tab) => (

                      <button
                        key={
                          tab.key
                        }

                        className={
                          activeTab ===
                          tab.key

                            ? "active-tab"

                            : ""
                        }

                        onClick={() => {

                          setActiveTab(
                            tab.key
                          );

                          navigate(
                            tab.path
                          );
                        }}
                      >

                        {tab.name}

                      </button>
                    )
                  )}

                </>
              )}

              {/* LOGOUT */}

              <button
                onClick={
                  handleLogout
                }
              >
                Logout
              </button>

            </>
          )}

        </div>

      </div>

    </div>
  );
}

export default Navbar;