import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useHostel } from "../../context/HostelContext";
import { useAuth } from "../../context/AuthContext";
import HostelCard from "./HostelCard";

const HostelsList = () => {
  const { hostels, loading, error, getHostels, deleteHostel } = useHostel();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredHostels, setFilteredHostels] = useState([]);

  useEffect(() => {
    getHostels();
  }, []);

  useEffect(() => {
    if (hostels) {
      setFilteredHostels(
        hostels.filter(
          (hostel) =>
            hostel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            hostel.location.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [hostels, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this hostel?")) {
      await deleteHostel(id);
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
      <div style={styles.header}>
        <h1 style={styles.title}>Hostels</h1>

        <div style={styles.actions}>
          <div style={styles.searchBox}>
            <input
              type="text"
              placeholder="Search hostels..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={styles.searchInput}
            />
          </div>

          {user && user.role === "admin" && <Link to="/hostels/add" style={styles.addButton}>
            Add New Hostel
          </Link>}

        </div>
      </div>

      {error && <div style={styles.errorAlert}>{error}</div>}

      {filteredHostels.length === 0 ? (
        <div style={styles.noHostels}>
          <p>
            No hostels found.{" "}
            {user &&
              user.role === "admin" &&
              "Add a new hostel to get started."}
          </p>
        </div>
      ) : (
        <div style={styles.hostelsGrid}>
          {filteredHostels.map((hostel) => (
            <HostelCard
              key={hostel.id}
              hostel={hostel}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
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
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    flexWrap: "wrap",
    gap: "20px",
  },
  title: {
    fontSize: "28px",
    color: "#333",
    margin: 0,
  },
  actions: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  searchBox: {
    position: "relative",
  },
  searchInput: {
    padding: "10px 15px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    fontSize: "16px",
    width: "250px",
  },
  addButton: {
    backgroundColor: "#2ecc71",
    color: "white",
    padding: "10px 15px",
    borderRadius: "4px",
    textDecoration: "none",
    fontWeight: "500",
    display: "inline-block",
  },
  hostelsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "20px",
  },
  noHostels: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    textAlign: "center",
    color: "#666",
  },
  errorAlert: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    padding: "12px",
    borderRadius: "4px",
    marginBottom: "20px",
    textAlign: "center",
  },
};

export default HostelsList;
