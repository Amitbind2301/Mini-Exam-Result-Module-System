import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddSubjectPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    subjectName: "",
    subjectCode: "",
    fullMarks: "",
    passMarks: "",
  });

  const [loading, setLoading] = useState(false);

  // ======================
  // HANDLE INPUT CHANGE
  // ======================
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ======================
  // ADD SUBJECT
  // ======================
  const addSubject = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Login required");
        return;
      }

      if (
        !form.subjectName.trim() ||
        !form.subjectCode.trim() ||
        !form.fullMarks ||
        !form.passMarks
      ) {
        alert("All fields are required");
        return;
      }

      if (
        Number(form.fullMarks) <= 0 ||
        Number(form.passMarks) <= 0
      ) {
        alert("Marks must be greater than 0");
        return;
      }

      if (
        Number(form.fullMarks) <= Number(form.passMarks)
      ) {
        alert("Full marks must be greater than pass marks");
        return;
      }

      setLoading(true);

      const payload = {
        subjectName: form.subjectName.trim(),
        subjectCode: form.subjectCode.trim().toUpperCase(),
        fullMarks: Number(form.fullMarks),
        passMarks: Number(form.passMarks),
      };

      const response = await axios.post(
        "http://localhost:5000/api/subjects",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Subject Added Successfully:", response.data);

      alert("Subject added successfully");

      // RESET FORM
      setForm({
        subjectName: "",
        subjectCode: "",
        fullMarks: "",
        passMarks: "",
      });

      // REDIRECT
      navigate("/subjects");

    } catch (error) {
      console.log(
        "Add Subject Error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Error adding subject"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          📚 Add New Subject
        </h1>

        <p style={styles.subtitle}>
          Save subject details into database
        </p>

        <form onSubmit={addSubject} style={styles.form}>
          <input
            type="text"
            name="subjectName"
            placeholder="Subject Name"
            value={form.subjectName}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="text"
            name="subjectCode"
            placeholder="Subject Code (e.g. ENG101)"
            value={form.subjectCode}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="number"
            name="fullMarks"
            placeholder="Full Marks"
            value={form.fullMarks}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="number"
            name="passMarks"
            placeholder="Pass Marks"
            value={form.passMarks}
            onChange={handleChange}
            style={styles.input}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Saving..." : "Add Subject"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ======================
   STYLES
====================== */
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6fb",
    padding: "20px",
  },

  card: {
    background: "white",
    padding: "35px",
    borderRadius: "15px",
    width: "500px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
  },

  title: {
    fontSize: "30px",
    fontWeight: "bold",
    marginBottom: "8px",
  },

  subtitle: {
    color: "gray",
    marginBottom: "20px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  input: {
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "15px",
  },

  button: {
    padding: "14px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
};