import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useHostel } from "../../context/HostelContext";

const AddEditHostelForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;

  const { hostel, getHostel, addHostel, updateHostel, loading, error } =
    useHostel();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    capacity: "",
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      getHostel(id);
    }
  }, [id]);

  useEffect(() => {
    if (isEditMode && hostel) {
      setFormData({
        name: hostel.name || "",
        location: hostel.location || "",
        capacity: hostel.capacity || "",
      });
    }
  }, [isEditMode, hostel]);

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Hostel name is required";
    }

    if (!formData.location.trim()) {
      errors.location = "Location is required";
    }

    if (!formData.capacity) {
      errors.capacity = "Capacity is required";
    } else if (isNaN(formData.capacity) || parseInt(formData.capacity) < 1) {
      errors.capacity = "Capacity must be a positive number";
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
      const hostelData = {
        ...formData,
        capacity: parseInt(formData.capacity),
      };

      let success;

      if (isEditMode) {
        success = await updateHostel(id, hostelData);
      } else {
        success = await addHostel(hostelData);
      }

      if (success) {
        navigate("/hostels");
      } else {
        window.scrollTo(0, 0);
      }
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
      <div style={styles.formCard}>
        <h2 style={styles.title}>
          {isEditMode ? "Edit Hostel" : "Add New Hostel"}
        </h2>

        {error && <div style={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="name" style={styles.label}>
              Hostel Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={
                formErrors.name
                  ? { ...styles.input, ...styles.inputError }
                  : styles.input
              }
              placeholder="Enter hostel name"
            />
            {formErrors.name && (
              <span style={styles.errorText}>{formErrors.name}</span>
            )}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="location" style={styles.label}>
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              style={
                formErrors.location
                  ? { ...styles.input, ...styles.inputError }
                  : styles.input
              }
              placeholder="Enter hostel location"
            />
            {formErrors.location && (
              <span style={styles.errorText}>{formErrors.location}</span>
            )}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="capacity" style={styles.label}>
              Capacity
            </label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              style={
                formErrors.capacity
                  ? { ...styles.input, ...styles.inputError }
                  : styles.input
              }
              placeholder="Enter bed capacity"
              min="1"
            />
            {formErrors.capacity && (
              <span style={styles.errorText}>{formErrors.capacity}</span>
            )}
          </div>

          <div style={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => navigate("/hostels")}
              style={styles.cancelBtn}
            >
              Cancel
            </button>
            <button type="submit" style={styles.submitBtn}>
              {isEditMode ? "Update Hostel" : "Add Hostel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
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
  formCard: {
    width: "100%",
    maxWidth: "600px",
    padding: "30px",
    borderRadius: "8px",
    backgroundColor: "white",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
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
  inputError: {
    borderColor: "#e74c3c",
  },
  errorText: {
    color: "#e74c3c",
    fontSize: "14px",
    marginTop: "5px",
    display: "block",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  cancelBtn: {
    backgroundColor: "#95a5a6",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "4px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  submitBtn: {
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "4px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s",
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

export default AddEditHostelForm;
