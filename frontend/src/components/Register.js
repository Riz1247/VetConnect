import GoogleButton from "./GoogleButton";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    userType: "user", // Default to regular user
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { name, email, password } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/register`,
        formData
      );

      const { token, userType, userId, name: userName, email: userEmail } = response.data;

      // Store user data
      localStorage.setItem("token", token);
      localStorage.setItem("userType", userType);
      localStorage.setItem("userId", userId);
      localStorage.setItem("userName", userName);
      localStorage.setItem("email", userEmail);

      // Configure axios defaults
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Close any open modals
      window.dispatchEvent(new CustomEvent('closeModals'));

      // Navigate based on user type
      if (userType === "Pending") {
        navigate("/select-user-type");
      } else {
        switch(userType) {
          case 'admin':
            navigate("/admin-dashboard");
            break;
          case 'shelter':
            navigate("/shelter-dashboard");
            break;
          default:
            navigate("/user-dashboard");
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMsg = error.response?.data?.msg || "Registration failed. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="modal-form">
        {error && (
          <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
            {error}
          </div>
        )}
        <input
          type="text"
          name="name"
          value={name}
          onChange={handleChange}
          placeholder="Full Name"
          required
          className="modal-input"
          disabled={loading}
        />
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="modal-input"
          disabled={loading}
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
          placeholder="Password (min. 6 characters)"
          required
          minLength={6}
          className="modal-input"
          disabled={loading}
        />
        <button 
          type="submit" 
          className="modal-button"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <div className="divider">or</div>
      <GoogleButton disabled={loading} />
    </div>
  );
};

export default Register;
