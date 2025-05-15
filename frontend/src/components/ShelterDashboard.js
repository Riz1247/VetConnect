import React from "react";

const ShelterDashboard = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🏠 Shelter Dashboard</h2>
      <p>Welcome to your VetConnect dashboard!</p>
      <ul>
        <li>📩 View and manage adoption requests</li>
        <li>📋 Update pet medical history</li>
        <li>🐾 Add or edit adoptable pet listings</li>
        <li>⚙️ Manage shelter profile info</li>
      </ul>
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    maxWidth: "600px",
    margin: "auto",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    marginBottom: "20px",
    color: "#4caf50",
  },
};

export default ShelterDashboard;
