import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        <Link to="/" style={styles.logoLink}>
          Hostel Management
        </Link>
      </div>


      <nav style={styles.nav}>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" style={styles.navLink}>
              Dashboard
            </Link>
            <Link to="/hostels" style={styles.navLink}>
              Hostels
            </Link>
            {user && user.role === "admin" && (
              <Link to="/users" style={styles.navLink}>
                Users
              </Link>
            )}
            <div style={styles.userInfo}>
              <span style={styles.username}>{user && user.name}</span>
              <span style={styles.role}>({user && user.role})</span>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.navLink}>
              Login
            </Link>
            <Link to="/register" style={styles.navLink}>
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 20px",
    backgroundColor: "#3498db",
    color: "white",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    position: "fixed",
    width: "100%"
  },
  logo: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  logoLink: {
    color: "white",
    textDecoration: "none",
  },
  nav: {
    display: "flex",
    alignItems: "center",
  },
  navLink: {
    color: "white",
    textDecoration: "none",
    margin: "0 15px",
    fontWeight: "500",
    transition: "all 0.3s ease",
    padding: "5px 0",
    borderBottom: "2px solid transparent",
    ":hover": {
      borderBottom: "2px solid white",
    },
  },
  userInfo: {
    marginLeft: "20px",
    display: "flex",
    alignItems: "center",
  },
  username: {
    fontWeight: "bold",
    marginRight: "5px",
  },
  role: {
    fontSize: "14px",
    fontStyle: "italic",
    marginRight: "15px",
  },
  logoutBtn: {
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.3s",
  },
};

export default Header;
