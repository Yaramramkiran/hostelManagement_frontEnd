import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ClipLoader } from "react-spinners";



const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const { login, isAuthenticated, clearError, authLoading } = useAuth();
  console.log(authLoading);

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }

    clearError();
  }, [isAuthenticated, navigate, clearError]);

  const validateForm = () => {
    const errors = {};

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const success = await login(formData);
      if (success) {
        navigate("/dashboard");
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h2 style={styles.title}>Login to Your Account</h2>



        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={
                formErrors.email
                  ? { ...styles.input, ...styles.inputError }
                  : styles.input
              }
              placeholder="Enter your email"
            />
            {formErrors.email && (
              <span style={styles.errorText}>{formErrors.email}</span>
            )}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={
                formErrors.password
                  ? { ...styles.input, ...styles.inputError }
                  : styles.input
              }
              placeholder="Enter your password"
            />
            {formErrors.password && (
              <span style={styles.errorText}>{formErrors.password}</span>
            )}
          </div>

          <button type="submit" style={styles.submitBtn} disabled={authLoading}>
            {authLoading ? (
              <ClipLoader size={"20"} />
            ) : (
              "Login"
            )}
          </button>

        </form>

        <div style={styles.formFooter}>
          Don't have an account?{" "}
          <Link to="/register" style={styles.link}>
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "calc(100vh - 100px)",
  },
  formCard: {
    width: "100%",
    maxWidth: "550px",
    padding: "30px",
    borderRadius: "8px",
    backgroundColor: "white",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    margin: "0 auto",
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "500",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    fontSize: "16px",
    transition: "border-color 0.3s",
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    padding: "12px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    fontSize: "16px",
    backgroundColor: "white",
  },
  inputError: {
    borderColor: "#e74c3c",
  },
  errorText: {
    color: "#e74c3c",
    fontSize: "14px",
    marginTop: "5px",
    display: "block",
  },
  submitBtn: {
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: "4px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s",
    marginTop: "10px",
  },
  formFooter: {
    textAlign: "center",
    marginTop: "25px",
    fontSize: "15px",
    color: "#555",
  },
  link: {
    color: "#3498db",
    textDecoration: "none",
    fontWeight: "500",
  },
  errorAlert: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    padding: "12px",
    borderRadius: "4px",
    marginBottom: "20px",
    textAlign: "center",
  },
  spinner: {
    width: "18px",
    height: "18px",
    border: "3px solid #fff",
    borderTop: "3px solid transparent",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    display: "inline-block",
  },
};

export default Login;
