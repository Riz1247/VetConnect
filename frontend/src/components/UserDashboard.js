import React from "react";

const UserDashboard = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>👤 User Dashboard</h2>
      <p>Welcome to your VetConnect dashboard!</p>
      <ul>
        <li>📝 View adoption request status</li>
        <li>💉 Track vet appointments</li>
        <li>🛒 View purchase history</li>
        <li>⚙️ Manage your profile & preferences</li>
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
    color: "#2196f3",
  },
};

export default UserDashboard;
