import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/navbar.css";

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="navbar">

      <div className="logo">
        <Link to="/">AmazPro</Link>
      </div>

      <div className="search-bar">
        <input type="text" placeholder="Search products..." />
        <button>Search</button>
      </div>

      <div className="nav-links">
        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {user && (
          <>
            <Link to="/cart">Cart</Link>
            <Link to="/orders">Orders</Link>
            <button onClick={logout}>Logout</button>
          </>
        )}
      </div>

    </div>
  );
}

export default Navbar;
