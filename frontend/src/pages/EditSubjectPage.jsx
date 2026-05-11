import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function EditSubjectPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    subjectName: "",
    subjectCode: "",
    fullMarks: "",
    passMarks: "",
  });

  const [loading, setLoading] = useState(false);

  // ======================
  // FETCH SUBJECT BY ID
  // ======================
  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/subjects",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const subjects =
          res.data?.data || res.data || [];

        const subject = subjects.find(
          (s) => s._id === id
        );

        if (!subject) {
          return alert(
            "Subject not found"
          );
        }

        setForm({
          subjectName:
            subject.subjectName,
          subjectCode:
            subject.subjectCode,
          fullMarks:
            subject.fullMarks,
          passMarks:
            subject.passMarks,
        });

      } catch (error) {
        console.log(error);
        alert(
          "Error fetching subject"
        );
      }
    };

    fetchSubject();
  }, [id]);

  // ======================
  // HANDLE INPUT
  // ======================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  // ======================
  // UPDATE SUBJECT
  // ======================
  const updateSubject = async (e) => {
    e.preventDefault();

    const token =
      localStorage.getItem(
        "token"
      );

    if (
      Number(form.fullMarks) <=
      Number(form.passMarks)
    ) {
      return alert(
        "Full marks must be greater than pass marks"
      );
    }

    try {
      setLoading(true);

      await axios.put(
        `http://localhost:5000/api/subjects/${id}`,
        {
          subjectName:
            form.subjectName.trim(),
          subjectCode:
            form.subjectCode
              .trim()
              .toUpperCase(),
          fullMarks: Number(
            form.fullMarks
          ),
          passMarks: Number(
            form.passMarks
          ),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },
        }
      );

      alert(
        "Subject updated successfully"
      );

      navigate("/subjects");

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data
          ?.message ||
          "Update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          ✏ Edit Subject
        </h1>

        <form
          onSubmit={
            updateSubject
          }
          style={styles.form}
        >
          <input
            type="text"
            name="subjectName"
            value={
              form.subjectName
            }
            onChange={
              handleChange
            }
            placeholder="Subject Name"
            style={
              styles.input
            }
          />

          <input
            type="text"
            name="subjectCode"
            value={
              form.subjectCode
            }
            onChange={
              handleChange
            }
            placeholder="Subject Code"
            style={
              styles.input
            }
          />

          <input
            type="number"
            name="fullMarks"
            value={
              form.fullMarks
            }
            onChange={
              handleChange
            }
            placeholder="Full Marks"
            style={
              styles.input
            }
          />

          <input
            type="number"
            name="passMarks"
            value={
              form.passMarks
            }
            onChange={
              handleChange
            }
            placeholder="Pass Marks"
            style={
              styles.input
            }
          />

          <button
            type="submit"
            disabled={
              loading
            }
            style={
              styles.button
            }
          >
            {loading
              ? "Updating..."
              : "Update Subject"}
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
    justifyContent:
      "center",
    alignItems: "center",
    background: "#f4f6fb",
  },

  card: {
    background: "white",
    padding: "35px",
    borderRadius: "15px",
    width: "500px",
    boxShadow:
      "0 8px 25px rgba(0,0,0,0.1)",
  },

  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "20px",
  },

  form: {
    display: "flex",
    flexDirection:
      "column",
    gap: "15px",
  },

  input: {
    padding: "12px",
    border:
      "1px solid #ccc",
    borderRadius: "8px",
  },

  button: {
    padding: "14px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};