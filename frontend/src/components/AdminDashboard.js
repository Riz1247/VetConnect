import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch users and pets when component mounts
    axios.get('http://localhost:5000/api/admin/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error("Error fetching users", error));

    axios.get('http://localhost:5000/api/admin/pets')
      .then(response => setPets(response.data))
      .catch(error => console.error("Error fetching pets", error))
      .finally(() => setLoading(false));  // Set loading to false when data is fetched
  }, []);

  const handleBanUser = (userId) => {
    axios.put(`http://localhost:5000/api/admin/ban-user/${userId}`)
      .then(response => {
        alert(response.data.msg);
        setUsers(users.filter(user => user._id !== userId)); // Remove banned user from list
      })
      .catch(error => console.error("Error banning user", error));
  };

  const handleApprovePet = (petId) => {
    axios.put(`http://localhost:5000/api/admin/approve-pet/${petId}`)
      .then(response => {
        alert(response.data.msg);
        setPets(pets.filter(pet => pet._id !== petId)); // Remove approved pet from list
      })
      .catch(error => console.error("Error approving pet", error));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h1>Admin Dashboard</h1>

      <h2>Users</h2>
      <ul>
        {users.map(user => (
          <li key={user._id}>
            {user.name} - {user.userType}
            <button onClick={() => handleBanUser(user._id)}>Ban</button>
          </li>
        ))}
      </ul>

      <h2>Pet Listings</h2>
      <ul>
        {pets.map(pet => (
          <li key={pet._id}>
            {pet.name} - {pet.isApproved ? 'Approved' : 'Pending'}
            <button onClick={() => handleApprovePet(pet._id)}>Approve</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f4f4f4',
    borderRadius: '8px',
    margin: '20px',
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  button: {
    padding: '5px 10px',
    backgroundColor: '#2196f3',
    color: '#fff',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default AdminDashboard;
