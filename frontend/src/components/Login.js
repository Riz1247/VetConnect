import React, { useState } from "react";
import axios from "axios";
import GoogleButton from "./GoogleButton";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { email, password } = formData;

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
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/login`,
        formData
      );

      const { token, userType, userId, name: userName, email: userEmail } = response.data;

      // Store user data
      localStorage.setItem("token", token);
      localStorage.setItem("userType", userType);
      localStorage.setItem("userId", userId);
      localStorage.setItem("userName", userName);
      localStorage.setItem("email", userEmail);

      // Configure axios defaults for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Close the modal
      window.dispatchEvent(new CustomEvent('closeModals'));
      
      // Navigate based on user type
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
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.data?.msg) {
        setError(error.response.data.msg);
      } else if (error.response?.status === 403) {
        setError("Your account is suspended. Please contact support.");
      } else if (error.response?.status === 401) {
        setError("Invalid email or password");
      } else if (!error.response) {
        setError("Network error. Please check your connection.");
      } else {
        setError("An error occurred. Please try again.");
      }
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
          placeholder="Password"
          required
          className="modal-input"
          disabled={loading}
        />
        <button 
          type="submit" 
          className="modal-button"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div className="divider">or</div>
      <GoogleButton disabled={loading} />
    </div>
  );
};

export default Login;
