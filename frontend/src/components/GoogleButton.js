import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GoogleButton = ({ disabled }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      console.error("No credential received from Google");
      return;
    }

    setIsLoading(true);
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const { name: userName, email, sub: googleId } = decoded;

      console.log("Google user:", { userName, email, googleId });

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/google-login`,
        {
          name: userName,
          email: email,
          googleId: googleId
        }
      );

      const { token, userType, userId } = response.data;

      if (!userId || !token || !userType) {
        throw new Error("Invalid response from server");
      }

      // Store user data
      localStorage.setItem("token", token);
      localStorage.setItem("userType", userType);
      localStorage.setItem("userId", userId);
      localStorage.setItem("userName", userName);
      localStorage.setItem("email", email);

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

    } catch (err) {
      console.error("Google login error:", err);
      const errorMessage = err.response?.data?.msg || err.message || "Google login failed";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div style={styles.wrapper}>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => {
          console.log("Google Login Failed");
          alert("Google Login Failed. Please try again.");
        }}
        width="100%"
        theme="outline"
        size="large"
        shape="rectangular"
        disabled={disabled || isLoading}

      />
    </div>
  );
};

const styles = {
  wrapper: {
    marginTop: "10px",
    display: "flex",
    justifyContent: "center",
  },
};

export default GoogleButton;
