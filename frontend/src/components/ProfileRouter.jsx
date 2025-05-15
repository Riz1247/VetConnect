import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserProfilePage from "./UserProfilePage";
import ShelterProfilePage from "./ShelterProfilePage";
import AdminProfilePage from "./AdminProfilePage";

const ProfileRouter = () => {
  const navigate = useNavigate();
  const userType = localStorage.getItem("userType");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token || !userType) {
      alert("Please log in first.");
      navigate("/");
      return;
    }
  }, [token, userType, navigate]);

  if (!token || !userType) {
    return null;
  }

  switch (userType) {
    case "User":
      return <UserProfilePage />;
    case "Shelter":
      return <ShelterProfilePage />;
    case "Admin":
      return <AdminProfilePage />;
    default:
      return <p>Invalid user type.</p>;
  }
};

export default ProfileRouter;
