// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = location.pathname;

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("email");
    alert("Logged out successfully!");
    navigate("/");
    setIsLoggedIn(false);
  };

  const handleLoginClick = () => {
    window.dispatchEvent(new CustomEvent('openLoginModal'));
  };

  const handleSignupClick = () => {
    window.dispatchEvent(new CustomEvent('openSignupModal'));
  };

  const handleDashboardRedirect = () => {
    const userType = localStorage.getItem('userType');
    if (userType === 'Admin') navigate('/admin-dashboard');
    else if (userType === 'Shelter') navigate('/shelter-dashboard');
    else if (userType === 'User') navigate('/user-dashboard');
    else navigate('/');
  };

  const handleCreateAdClick = () => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");
    const shelterName = localStorage.getItem("shelterName");
    const shelterLocation = localStorage.getItem("shelterLocation");
    const petTypes = localStorage.getItem("petTypes");
  
    if (!token) {
      alert("Please Log In First");
      return;
    }
  
    if (userType === "Shelter" && (!shelterName || !shelterLocation || !petTypes)) {
      alert("Please complete your profile before creating an ad.");
      return;
    }
  
    navigate("/create-ad");
  };
  

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <i className="fas fa-paw"></i> VetConnect
        </Link>
      </div>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/pets">Pets</Link>
        <Link to="/shelters">Shelters</Link>
        <Link to="/pet-store">Pet Store</Link>

        {/* Our Services Dropdown */}
        <div className="dropdown">
          <span className="dropbtn">Our Services</span>
          <div className="dropdown-content">
            <Link to="/pet-walking">Pet Walking</Link>
            <div className="nested-dropdown">
              <span className="nested-btn">Medical Service</span>
              <div className="nested-dropdown-content">
                <Link to="/book-appointment">Book Appointment</Link>
                <Link to="/emergency-vet">Emergency Vet Service</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Community Dropdown */}
        <div className="dropdown">
          <span className="dropbtn">Community</span>
          <div className="dropdown-content">
            <Link to="/forum">Forum</Link>
            <Link to="/chatbot">Chatbot Assistance</Link>
            <Link to="/faq">FAQ</Link>
          </div>
        </div>

        <Link to="/about">About Us</Link>

        {/* Show "Create An Ad" only if NOT on /create-ad */}
        {pathname !== "/create-ad" && (
          <button className="create-ad-btn" onClick={handleCreateAdClick}>
            Create An Ad
          </button>
        )}
      </div>

      <div className="auth-buttons">
        {!isLoggedIn ? (
          <>
            <button className="btn-login" onClick={handleLoginClick}>Login</button>
            <button className="btn-signup" onClick={handleSignupClick}>Sign Up</button>
          </>
        ) : (
          <>
            <button className="btn-dashboard" onClick={handleDashboardRedirect}>Dashboard</button>
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
            <Link to="/cart" className="icon-link"><i className="fas fa-shopping-cart"></i></Link>
            <Link to="/profile" className="icon-link"><i className="fas fa-user-circle"></i></Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
