import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SubjectsPage() {
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // ======================
  // FETCH SUBJECTS
  // ======================
  const fetchSubjects = async () => {
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

      console.log("Subjects API Response:", res.data);

      if (res.data?.data) {
        setSubjects(
          Array.isArray(res.data.data)
            ? res.data.data
            : []
        );
      } else {
        setSubjects(
          Array.isArray(res.data)
            ? res.data
            : []
        );
      }

    } catch (error) {
      console.log(
        "Fetch Subjects Error:",
        error
      );
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // ======================
  // DELETE SUBJECT
  // ======================
  const deleteSubject = async (id) => {
    const token = localStorage.getItem("token");

    if (!window.confirm("Delete this subject?"))
      return;

    try {
      await axios.delete(
        `http://localhost:5000/api/subjects/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Subject deleted successfully");

      fetchSubjects();

    } catch (error) {
      console.log(
        "Delete Subject Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Delete failed"
      );
    }
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            📚 Subject Management
          </h1>
          <p style={styles.subtitle}>
            View, edit and manage all subjects
          </p>
        </div>

        <button
          style={styles.addButton}
          onClick={() =>
            navigate("/subjects/add")
          }
        >
          + Add Subject
        </button>
      </div>

      {/* SUBJECT TABLE */}
      <div style={styles.card}>
        {loading ? (
          <p>Loading subjects...</p>
        ) : subjects.length === 0 ? (
          <p>No subjects found</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.headRow}>
                <th>Subject Name</th>
                <th>Code</th>
                <th>Full Marks</th>
                <th>Pass Marks</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {subjects.map((subject) => (
                <tr
                  key={subject._id}
                  style={styles.row}
                >
                  <td>{subject.subjectName}</td>
                  <td>{subject.subjectCode}</td>
                  <td>{subject.fullMarks}</td>
                  <td>{subject.passMarks}</td>

                  <td>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        justifyContent:
                          "center",
                      }}
                    >
                      {/* EDIT BUTTON */}
                      <button
                        style={
                          styles.editBtn
                        }
                        onClick={() =>
                          navigate(
                            `/subjects/edit/${subject._id}`
                          )
                        }
                      >
                        Edit
                      </button>

                      {/* DELETE BUTTON */}
                      <button
                        style={
                          styles.deleteBtn
                        }
                        onClick={() =>
                          deleteSubject(
                            subject._id
                          )
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ======================
   STYLES
====================== */
const styles = {
  container: {
    padding: "30px",
    minHeight: "100vh",
    background: "#f4f6fb",
  },

  header: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },

  title: {
    fontSize: "30px",
    fontWeight: "bold",
  },

  subtitle: {
    color: "gray",
  },

  addButton: {
    padding: "12px 20px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  card: {
    background: "white",
    padding: "25px",
    borderRadius: "15px",
    boxShadow:
      "0 8px 20px rgba(0,0,0,0.08)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  headRow: {
    background: "#4f46e5",
    color: "white",
  },

  row: {
    textAlign: "center",
    borderBottom:
      "1px solid #eee",
  },

  editBtn: {
    background: "#f59e0b",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  deleteBtn: {
    background: "red",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};