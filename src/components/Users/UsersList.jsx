import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/users");
        setUsers(res.data.data);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || "Error fetching users");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(`/users/${userId}`, { role: newRole });

      setUsers(
        users.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch (error) {
      setError(error.response?.data?.message || "Error updating user role");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      await axios.delete(`/users/${userId}`);

      setUsers(users.filter((u) => u.id !== userId));
    } catch (error) {
      setError(error.response?.data?.message || "Error deleting user");
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>User Management</h1>

      {error && <div style={styles.errorAlert}>{error}</div>}

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={styles.tr}>
                <td style={styles.td}>{user.name}</td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    disabled={user.id === currentUser.id}
                    style={styles.select}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td style={styles.td}>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    disabled={user.id === currentUser.id}
                    style={
                      user.id === currentUser.id
                        ? { ...styles.deleteButton, ...styles.disabledButton }
                        : styles.deleteButton
                    }
                    title={
                      user.id === currentUser.id
                        ? "You cannot delete your own account"
                        : "Delete user"
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "50vh",
    fontSize: "20px",
    fontWeight: "bold",
  },
  title: {
    fontSize: "28px",
    color: "#333",
    marginBottom: "30px",
  },
  errorAlert: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    padding: "12px",
    borderRadius: "4px",
    marginBottom: "20px",
    textAlign: "center",
  },
  tableContainer: {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    overflow: "hidden",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "15px",
    backgroundColor: "#f5f5f5",
    borderBottom: "1px solid #ddd",
    color: "#333",
    fontWeight: "bold",
  },
  tr: {
    borderBottom: "1px solid #eee",
  },
  td: {
    padding: "15px",
    verticalAlign: "middle",
  },
  select: {
    padding: "8px 12px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    backgroundColor: "white",
    fontSize: "14px",
  },
  deleteButton: {
    padding: "8px 12px",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  disabledButton: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
};

export default UsersList;
