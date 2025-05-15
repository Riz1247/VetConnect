import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPets: 0,
    pendingApprovals: 0,
    bannedUsers: 0,
    totalAppointments: 0,
    totalBookings: 0
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, petRes] = await Promise.all([
          axios.get("http://localhost:5000/api/auth/admin/users", {
            headers: { "x-auth-token": token },
          }),
          axios.get("http://localhost:5000/api/auth/admin/pets", {
            headers: { "x-auth-token": token },
          }),
        ]);

        const users = userRes.data;
        const pets = petRes.data;

        setUsers(users);
        setPets(pets);

        // Calculate enhanced stats
        const totalAppointments = users.reduce((sum, user) => sum + (user.appointments?.length || 0), 0);
        const totalBookings = users.reduce((sum, user) => sum + (user.shelterBookings?.length || 0), 0);

        setStats({
          totalUsers: users.length,
          totalPets: pets.length,
          pendingApprovals: pets.filter(pet => !pet.isApproved).length,
          bannedUsers: users.filter(user => user.isBanned).length,
          totalAppointments,
          totalBookings
        });

        setLoading(false);
      } catch (error) {
        console.error("Admin fetch error:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const toggleBanUser = async (userId) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/auth/admin/toggle-ban/${userId}`, {}, {
        headers: { "x-auth-token": token },
      });
      
      // Update users list and stats
      setUsers(prev => prev.map(u => u._id === userId ? res.data.user : u));
      setStats(prev => ({
        ...prev,
        bannedUsers: prev.bannedUsers + (res.data.user.isBanned ? 1 : -1)
      }));

      alert(res.data.message);
    } catch (err) {
      alert("Failed to toggle ban status: " + err.message);
    }
  };

  const approvePet = async (petId) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/auth/admin/approve-pet/${petId}`, {}, {
        headers: { "x-auth-token": token },
      });
      
      // Update pets list and stats
      setPets(prev => prev.map(p => p._id === petId ? res.data.pet : p));
      setStats(prev => ({
        ...prev,
        pendingApprovals: prev.pendingApprovals - 1
      }));

      alert("Pet listing has been approved successfully");
    } catch (err) {
      alert("Failed to approve pet: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="admin-profile-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-profile-container">
      <h2 className="dashboard-title">🔐 Admin Dashboard</h2>

      {/* Statistics Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.totalUsers}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalPets}</div>
          <div className="stat-label">Total Pets</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalAppointments}</div>
          <div className="stat-label">Total Appointments</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalBookings}</div>
          <div className="stat-label">Shelter Bookings</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.pendingApprovals}</div>
          <div className="stat-label">Pending Approvals</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.bannedUsers}</div>
          <div className="stat-label">Banned Users</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="admin-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button 
          className={`tab-button ${activeTab === 'pets' ? 'active' : ''}`}
          onClick={() => setActiveTab('pets')}
        >
          Pets
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Users Section */}
      <div className={`admin-section ${activeTab === 'users' ? '' : 'hidden'}`}>
        <h3>👥 User Management</h3>
        {filteredUsers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👤</div>
            <p>No users found</p>
          </div>
        ) : (
          <div className="user-list">
            {filteredUsers.map(user => (
              <div key={user._id} className="user-card">
                <div className="user-info">
                  <span className="user-name">{user.name}</span>
                  <span className="user-email">{user.email}</span>
                  <span className="user-type">{user.userType}</span>
                  <div className="user-activity">
                    <span>Appointments: {user.appointments?.length || 0}</span>
                    <span>Shelter Bookings: {user.shelterBookings?.length || 0}</span>
                  </div>
                </div>
                <div className="action-buttons">
                  <button 
                    className={user.isBanned ? 'unban-button' : 'ban-button'}
                    onClick={() => toggleBanUser(user._id)}
                  >
                    {user.isBanned ? '✓ Unban User' : '🚫 Ban User'}
                  </button>
                  <button 
                    className="view-details-button"
                    onClick={() => setActiveTab('details')}
                  >
                    📋 View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="admin-section">
        <h3>🐾 Pet Listings</h3>
        {pets.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🐾</div>
            <p>No pet listings found</p>
          </div>
        ) : (
          <div className="pet-list">
            {pets.map(pet => (
              <div key={pet._id} className="pet-card">
                <div className="pet-info">
                  <span className="pet-name">{pet.name}</span>
                  <span className="breed">{pet.breed}</span>
                  <span className="pet-status">
                    {pet.isApproved ? 'Approved' : 'Pending'}
                  </span>
                </div>
                <div className="action-buttons">
                  {!pet.isApproved && (
                    <button 
                      className="approve-button" 
                      onClick={() => approvePet(pet._id)}
                    >
                      ✓ Approve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
