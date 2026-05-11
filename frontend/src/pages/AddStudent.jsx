import React, { useState } from "react";
import { addStudent } from "../services/studentService";
import { useNavigate } from "react-router-dom";

const AddStudent = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    rollNumber: "",
    className: "",
    section: "",
    email: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value || "",
    }));
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      setLoading(true);

      const res = await addStudent(formData);

      setLoading(false);

      setSuccess("Student added successfully 🎉");

      // ⛔ wait so UI shows success first
      setTimeout(() => {
        navigate("/students");
      }, 800);

    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Failed to add student");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <div style={styles.header}>
          <button onClick={handleBack} style={styles.backBtn}>
            ⬅ Back to Dashboard
          </button>

          <h2>Add Student</h2>
        </div>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input name="name" placeholder="Name" onChange={handleChange} style={styles.input} />
          <input name="rollNumber" placeholder="Roll Number" onChange={handleChange} style={styles.input} />
          <input name="className" placeholder="Class" onChange={handleChange} style={styles.input} />
          <input name="section" placeholder="Section" onChange={handleChange} style={styles.input} />
          <input name="email" placeholder="Email" onChange={handleChange} style={styles.input} />
          <input name="phone" placeholder="Phone" onChange={handleChange} style={styles.input} />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Saving..." : "Save Student"}
          </button>
        </form>

      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    padding: "30px",
    background: "#f4f6f9",
    minHeight: "100vh",
  },
  card: {
    width: "450px",
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "15px",
  },
  backBtn: {
    padding: "6px 10px",
    background: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    background: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  error: {
    background: "#f8d7da",
    color: "#721c24",
    padding: "8px",
    borderRadius: "5px",
    marginBottom: "10px",
  },
  success: {
    background: "#d4edda",
    color: "#155724",
    padding: "8px",
    borderRadius: "5px",
    marginBottom: "10px",
  },
};

export default AddStudent;