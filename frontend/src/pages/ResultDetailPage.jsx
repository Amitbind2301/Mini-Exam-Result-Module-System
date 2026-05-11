import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function ResultDetailPage() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const resultRef = useRef(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const stu = await axios.get(
          "http://localhost:5000/api/students",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const res = await axios.get(
          "http://localhost:5000/api/results",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setStudents(stu.data?.data || stu.data || []);
        setResults(res.data?.data || res.data || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const getStudentResult = (id) =>
    results.filter((r) => r.studentId?._id === id);

  const calculateTotal = (subjects) =>
    subjects.reduce((sum, s) => sum + Number(s.marksObtained || 0), 0);

  const calculatePercentage = (subjects) => {
    const total = calculateTotal(subjects);
    const max = subjects.reduce(
      (sum, s) => sum + Number(s.subjectId?.fullMarks || 100),
      0
    );
    return max ? ((total / max) * 100).toFixed(2) : 0;
  };

  const getGrade = (p) => {
    if (p >= 90) return "A+";
    if (p >= 80) return "A";
    if (p >= 70) return "B";
    if (p >= 60) return "C";
    if (p >= 50) return "D";
    return "F";
  };

  const isPass = (r) =>
    r.subjects.every(
      (s) => Number(s.marksObtained) >= Number(s.subjectId?.passMarks)
    );

  // 📄 PDF DOWNLOAD
  const downloadPDF = async () => {
    const input = resultRef.current;

    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("result-marksheet.pdf");
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <h2>Loading Results...</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📄 Student Result System</h1>

      {/* SELECT */}
      <div style={styles.selectBox}>
        <label>Select Student:</label>

        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          style={styles.select}
        >
          <option value="">-- Select Student --</option>
          {students.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name} ({s.rollNumber})
            </option>
          ))}
        </select>
      </div>

      {/* RESULT */}
      {selectedStudent &&
        getStudentResult(selectedStudent).map((r, i) => {
          const total = calculateTotal(r.subjects);
          const percent = calculatePercentage(r.subjects);
          const grade = getGrade(percent);
          const pass = isPass(r);

          return (
            <div key={i} style={styles.card} ref={resultRef}>
              {/* HEADER */}
              <div style={styles.header}>
                <h2>🎓 OFFICIAL MARKSHEET</h2>

                <button style={styles.btn} onClick={downloadPDF}>
                  📄 Download PDF
                </button>
              </div>

              <div style={styles.infoBox}>
                <p><b>Name:</b> {r.studentId?.name}</p>
                <p><b>Roll No:</b> {r.studentId?.rollNumber}</p>
                <p><b>Exam:</b> {r.examName}</p>
              </div>

              {/* TABLE */}
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Marks</th>
                    <th>Pass</th>
                    <th>Full</th>
                  </tr>
                </thead>

                <tbody>
                  {r.subjects.map((s, idx) => (
                    <tr key={idx}>
                      <td>{s.subjectId?.subjectName}</td>
                      <td>{s.marksObtained}</td>
                      <td>{s.subjectId?.passMarks}</td>
                      <td>{s.subjectId?.fullMarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* SUMMARY */}
              <div style={styles.summary}>
                <h3>Total: {total}</h3>
                <h3>Percentage: {percent}%</h3>

                <h3 style={{ color: grade === "A+" || grade === "A" ? "green" : "orange" }}>
                  Grade: {grade}
                </h3>

                <div style={{
                  ...styles.status,
                  background: pass ? "#d4edda" : "#f8d7da",
                  color: pass ? "green" : "red",
                }}>
                  {pass ? "PASS" : "FAIL"}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}

/* ================= STYLE ================= */
const styles = {
  container: {
    padding: "20px",
    background: "#eef2f7",
    minHeight: "100vh",
  },

  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "20px",
  },

  selectBox: {
    marginBottom: "20px",
  },

  select: {
    padding: "10px",
    width: "300px",
    borderRadius: "8px",
  },

  card: {
    background: "white",
    padding: "25px",
    borderRadius: "15px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    marginTop: "20px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "2px solid #eee",
    marginBottom: "15px",
  },

  btn: {
    padding: "8px 12px",
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  infoBox: {
    marginBottom: "15px",
    lineHeight: "1.8",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  summary: {
    marginTop: "15px",
  },

  status: {
    padding: "10px",
    marginTop: "10px",
    borderRadius: "8px",
    fontWeight: "bold",
    textAlign: "center",
  },

  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
};