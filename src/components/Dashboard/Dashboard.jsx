import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useHostel } from "../../context/HostelContext";
import { registerServiceWorker } from "../../utils/notificationService";
import NotificationSubscription from "../../components/NotificationSubscription";

const Dashboard = () => {
  const { user, token } = useAuth();
  const { hostels, getHostels, loading, userCount } = useHostel();
  console.log(userCount);

  console.log(hostels);


  useEffect(() => {
    getHostels();

    if ('serviceWorker' in navigator) {
      registerServiceWorker().catch(error => {
        console.error('Service worker registration failed:', error);
      });
    }
  }, []);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.welcomeSection}>
        <h1 style={styles.welcomeTitle}>Welcome, {user && user.name}!</h1>
        <p style={styles.welcomeText}>
          {user && user.role === "admin"
            ? "You have admin privileges. You can manage hostels and users."
            : "You can view list of hostels to the system."}
        </p>
      </div>

      <div style={styles.statsSection}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{hostels.length}</div>
          <div style={styles.statLabel}>Hostels</div>
        </div>

        {user && user.role === "admin" && (
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{userCount}</div>
            <div style={styles.statLabel}>Users</div>
          </div>
        )}
      </div>

      <NotificationSubscription token={token} />

      <div style={styles.actionSection}>
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <div style={styles.actionButtons}>
          <Link to="/hostels" style={styles.actionButton}>
            View All Hostels
          </Link>
          {user && user.role === "admin" && <Link to="/hostels/add" style={styles.actionButton}>
            Add New Hostel
          </Link>}

          {user && user.role === "admin" && (
            <Link to="/users" style={styles.actionButton}>
              Manage Users
            </Link>
          )}
        </div>
      </div>

      {hostels.length > 0 && (
        <div style={styles.recentSection}>
          <h2 style={styles.sectionTitle}>Recent Hostels</h2>
          <div style={styles.recentGrid}>
            {hostels.slice(-4).map((hostel) => (
              <div key={hostel.id} style={styles.recentCard}>
                <h3 style={styles.hostelName}>{hostel.name}</h3>
                <p style={styles.hostelDetails}>
                  <span style={styles.detailLabel}>Location:</span>{" "}
                  {hostel.location}
                </p>
                <p style={styles.hostelDetails}>
                  <span style={styles.detailLabel}>Capacity:</span>{" "}
                  {hostel.capacity} beds
                </p>
                <Link to={`/hostels/${hostel.id}`} style={styles.viewButton}>
                  View Details
                </Link>
              </div>
            ))}
          </div>
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
  welcomeSection: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    marginBottom: "30px",
  },
  welcomeTitle: {
    fontSize: "28px",
    color: "#333",
    marginBottom: "15px",
  },
  welcomeText: {
    fontSize: "16px",
    color: "#666",
    lineHeight: "1.5",
  },
  statsSection: {
    display: "flex",
    marginBottom: "30px",
    gap: "20px",
  },
  statCard: {
    flex: "1",
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  statNumber: {
    fontSize: "36px",
    fontWeight: "bold",
    color: "#3498db",
    marginBottom: "10px",
  },
  statLabel: {
    fontSize: "16px",
    color: "#666",
    textTransform: "uppercase",
  },
  actionSection: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    marginBottom: "30px",
  },
  sectionTitle: {
    fontSize: "20px",
    color: "#333",
    marginBottom: "20px",
    paddingBottom: "10px",
    borderBottom: "1px solid #eee",
  },
  actionButtons: {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
  },
  actionButton: {
    backgroundColor: "#3498db",
    color: "white",
    padding: "12px 20px",
    borderRadius: "4px",
    textDecoration: "none",
    fontWeight: "500",
    display: "inline-block",
    transition: "background-color 0.3s",
  },
  recentSection: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  recentGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },
  recentCard: {
    border: "1px solid #eee",
    borderRadius: "8px",
    padding: "20px",
    transition: "transform 0.3s, box-shadow 0.3s",
  },
  hostelName: {
    fontSize: "18px",
    color: "#333",
    marginBottom: "10px",
  },
  hostelDetails: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "5px",
  },
  detailLabel: {
    fontWeight: "bold",
    color: "#555",
  },
  viewButton: {
    display: "inline-block",
    marginTop: "15px",
    backgroundColor: "#f1f1f1",
    color: "#333",
    padding: "8px 12px",
    borderRadius: "4px",
    textDecoration: "none",
    fontSize: "14px",
    transition: "background-color 0.3s",
  },
};

export default Dashboard;