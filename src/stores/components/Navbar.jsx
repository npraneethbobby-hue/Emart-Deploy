
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { cartItems } = useCart();
  const { user, logout } = useAuth();

  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  // Calculate total product quantity
  const cartCount = cartItems.reduce(
    (total, item) => total + (Number(item.quantity) || 1),
    0
  );

  const handleLogout = async () => {
    try {
      await logout();
      setShowProfile(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="navbar-section">
      <div className="navSection">

        {/* Logo */}
        <Link to="/" className="custom-link">
          <div className="title">
            <h2>E-Mart</h2>
          </div>
        </Link>

        {/* Search */}
        <div className="search">
          <input type="text" placeholder="Search..." />
        </div>

        {/* Cart */}
        <Link to="/cart" className="custom-link">
          <div className="cart">
            <span className="cart-label">🛒 Cart</span>
            <span className="cart-count">{cartCount}</span>
          </div>
        </Link>

        {/* Profile */}
        <div className="user profile-wrapper">
          <button
            className="profile-button"
            onClick={() => {
              if (!user) {
                navigate("/login");
              } else {
                setShowProfile(!showProfile);
              }
            }}
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="profile-avatar"
              />
            ) : (
              <span className="profile-icon">👤</span>
            )}

            <span>
              {user ? user.displayName || "My Profile" : "Profile"}
            </span>
          </button>

          {user && showProfile && (
            <div className="profile-dropdown">
              <p>{user.displayName || "Welcome"}</p>
              <small>{user.email}</small>

              <hr />

              <button onClick={() => navigate("/profile")}>
                My Account
              </button>

              <button onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="subMenu">
        <ul>
          <Link to="/mobiles" className="custom-link"><li>Mobiles</li></Link>
          <Link to="/computers" className="custom-link"><li>Computers</li></Link>
          <Link to="/watch" className="custom-link"><li>Watches</li></Link>
          <Link to="/men" className="custom-link"><li>Mens Wear</li></Link>
          <Link to="/woman" className="custom-link"><li>Woman Wear</li></Link>
          <Link to="/furniture" className="custom-link"><li>Furniture</li></Link>
          <Link to="/kitchen" className="custom-link"><li>Kitchen</li></Link>
          <Link to="/fridge" className="custom-link"><li>Fridge</li></Link>
          <Link to="/" className="custom-link"><li>Books</li></Link>
          <Link to="/" className="custom-link"><li>Speakers</li></Link>
          <Link to="/" className="custom-link"><li>TV's</li></Link>
          <Link to="/ac" className="custom-link"><li>AC</li></Link>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
