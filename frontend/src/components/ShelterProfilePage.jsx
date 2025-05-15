import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ShelterProfilePage.css";

const ShelterProfilePage = () => {
  const [activeTab, setActiveTab] = useState("info");

  const [formData, setFormData] = useState({
    email: "",
    shelterName: "",
    shelterLocation: "",
    petTypes: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
  
    axios.get(`http://localhost:5000/api/auth/profile/${userId}`)
      .then((res) => {
        const { email, shelterName, shelterLocation, petTypes } = res.data;
        setFormData(prev => ({ ...prev, email, shelterName, shelterLocation, petTypes }));
      })
      .catch(err => {
        console.error("Failed to fetch shelter profile:", err);
        alert("Error loading profile data");
      });
  }, []);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const { newPassword, confirmPassword } = formData;
    if (newPassword && newPassword !== confirmPassword) {
      alert("Passwords don’t match");
      return;
    }

    const userId = localStorage.getItem("userId");
    try {
      const payload = {
        shelterName: formData.shelterName,
        shelterLocation: formData.shelterLocation,
        petTypes: formData.petTypes,
        newPassword
      };

      await fetch(`http://localhost:5000/api/auth/update-shelter-profile/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      alert("Shelter profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error saving changes.");
    }
  };

  return (
    <div className="profile-container">
      <div className="sidebar">
        <h2>Shelter Profile</h2>
        <ul>
          <li className={activeTab === "info" ? "active" : ""} onClick={() => setActiveTab("info")}>🏠 Shelter Info</li>
          <li className={activeTab === "favorites" ? "active" : ""} onClick={() => setActiveTab("favorites")}>❤️ Favorites</li>
          <li className={activeTab === "chats" ? "active" : ""} onClick={() => setActiveTab("chats")}>💬 Chats</li>
          <li className={activeTab === "notifications" ? "active" : ""} onClick={() => setActiveTab("notifications")}>🔔 Notifications</li>
        </ul>
      </div>

      <div className="main-profile-content">
        {activeTab === "info" && (
          <>
            <h3 className="section-title">Shelter Info</h3>
            <div className="form-group">
              <label>Shelter Name</label>
              <input
                type="text"
                name="shelterName"
                value={formData.shelterName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input type="email" value={formData.email} readOnly />
            </div>

            <div className="form-group">
              <label>Shelter Location</label>
              <input
                type="text"
                name="shelterLocation"
                value={formData.shelterLocation}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Pet Types</label>
              <select name="petTypes" value={formData.petTypes} onChange={handleChange} required>
                <option value="">Select type</option>
                <option value="Dogs">Dogs</option>
                <option value="Cats">Cats</option>
                <option value="Both">Both</option>
              </select>
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <button className="save-btn" onClick={handleSave}>Save Changes</button>
          </>
        )}

        {activeTab === "favorites" && <p>❤️ Favorite listings for shelter.</p>}
        {activeTab === "chats" && <p>💬 Chat history with users appears here.</p>}
        {activeTab === "notifications" && <p>🔔 Alerts about pet requests and adoption.</p>}
      </div>
    </div>
  );
};

export default ShelterProfilePage;
