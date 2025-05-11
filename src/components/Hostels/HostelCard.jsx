import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const HostelCard = ({ hostel, onDelete }) => {
  const { user } = useAuth();
  const isAdmin = user && user.role === "admin";

  return (
    <div style={styles.card}>
      <h3 style={styles.name}>{hostel.name}</h3>

      <div style={styles.details}>
        <p style={styles.location}>
          <span style={styles.label}>Location:</span> {hostel.location}
        </p>
        <p style={styles.capacity}>
          <span style={styles.label}>Capacity:</span> {hostel.capacity} beds
        </p>
      </div>

      <div style={styles.actions}>
        <Link to={`/hostels/${hostel.id}`} style={styles.viewButton}>
          View
        </Link>

        {isAdmin && (
          <>
            <Link to={`/hostels/edit/${hostel.id}`} style={styles.editButton}>
              Edit
            </Link>

            <button
              onClick={() => onDelete(hostel.id)}
              style={styles.deleteButton}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    padding: "20px",
    marginBottom: "20px",
    transition: "transform 0.3s, box-shadow 0.3s",
  },
  name: {
    fontSize: "20px",
    color: "#333",
    marginBottom: "15px",
    borderBottom: "1px solid #eee",
    paddingBottom: "10px",
  },
  details: {
    marginBottom: "20px",
  },
  location: {
    marginBottom: "8px",
    fontSize: "16px",
    color: "#555",
  },
  capacity: {
    fontSize: "16px",
    color: "#555",
  },
  label: {
    fontWeight: "bold",
    marginRight: "5px",
  },
  actions: {
    display: "flex",
    gap: "10px",
  },
  viewButton: {
    padding: "8px 16px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "4px",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
    display: "inline-block",
  },
  editButton: {
    padding: "8px 16px",
    backgroundColor: "#f39c12",
    color: "white",
    border: "none",
    borderRadius: "4px",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
    display: "inline-block",
  },
  deleteButton: {
    padding: "8px 16px",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
  },
};

export default HostelCard;
