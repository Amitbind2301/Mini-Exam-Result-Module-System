import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddResultPage() {
  const navigate = useNavigate();

  // ======================
  // STATES
  // ======================
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [selectedStudent, setSelectedStudent] = useState("");
  const [examName, setExamName] = useState("");
  const [marksData, setMarksData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const token = localStorage.getItem("token");

  // ======================
  // FETCH STUDENTS FROM DB
  // ======================
  const fetchStudents = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/students",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const studentData =
        res.data?.data || res.data || [];

      setStudents(
        Array.isArray(studentData)
          ? studentData
          : []
      );
    } catch (err) {
      console.log(
        "Student Fetch Error:",
        err
      );
      setStudents([]);
    }
  };

  // ======================
  // FETCH SUBJECTS FROM DB
  // ======================
  const fetchSubjects = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/subjects",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const subjectData =
        res.data?.data || res.data || [];

      const safeSubjects =
        Array.isArray(subjectData)
          ? subjectData
          : [];

      setSubjects(safeSubjects);

      // PREPARE MARKS ENTRY
      setMarksData(
        safeSubjects.map((subject) => ({
          subjectId: subject._id,
          subjectName:
            subject.subjectName,
          subjectCode:
            subject.subjectCode,
          fullMarks:
            subject.fullMarks,
          passMarks:
            subject.passMarks,
          marksObtained: "",
        }))
      );
    } catch (err) {
      console.log(
        "Subject Fetch Error:",
        err
      );
      setSubjects([]);
      setMarksData([]);
    }
  };

  // ======================
  // LOAD INITIAL DATA
  // ======================
  useEffect(() => {
    const loadData = async () => {
      setFetchLoading(true);

      await Promise.all([
        fetchStudents(),
        fetchSubjects(),
      ]);

      setFetchLoading(false);
    };

    loadData();
  }, []);

  // ======================
  // HANDLE MARKS CHANGE
  // ======================
  const handleMarksChange = (
    index,
    value
  ) => {
    const updated =
      [...marksData];

    const subject =
      updated[index];

    if (
      Number(value) >
      Number(subject.fullMarks)
    ) {
      return alert(
        `${subject.subjectName}: Marks cannot exceed Full Marks (${subject.fullMarks})`
      );
    }

    updated[index].marksObtained =
      value;

    setMarksData(updated);
  };

  // ======================
  // SUBMIT RESULT
  // ======================
  const submitResult = async (
    e
  ) => {
    e.preventDefault();

    if (!selectedStudent) {
      return alert(
        "Please select student"
      );
    }

    if (!examName.trim()) {
      return alert(
        "Exam name required"
      );
    }

    const validSubjects =
      marksData.filter(
        (s) =>
          s.marksObtained !== ""
      );

    if (
      validSubjects.length === 0
    ) {
      return alert(
        "Enter marks for subjects"
      );
    }

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:5000/api/results",
        {
          studentId:
            selectedStudent,
          examName:
            examName.trim(),
          subjects:
            validSubjects.map(
              (subject) => ({
                subjectId:
                  subject.subjectId,
                marksObtained:
                  Number(
                    subject.marksObtained
                  ),
              })
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
        "Result Added Successfully"
      );

      navigate("/results");
    } catch (err) {
      console.log(
        "Result Save Error:",
        err
      );

      alert(
        err.response?.data
          ?.message ||
          "Error saving result"
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // LOADING SCREEN
  // ======================
  if (fetchLoading) {
    return (
      <div
        style={
          styles.loadingContainer
        }
      >
        <h2>
          Loading Students &
          Subjects...
        </h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* HEADER */}
        <h1 style={styles.title}>
          📝 Marks Entry
        </h1>

        <p
          style={styles.subtitle}
        >
          Enter subject-wise
          marks for each
          student and exam
        </p>

        <form
          onSubmit={
            submitResult
          }
          style={styles.form}
        >
          {/* STUDENT SELECT */}
          <label>
            Select Student
          </label>

          <select
            value={
              selectedStudent
            }
            onChange={(e) =>
              setSelectedStudent(
                e.target.value
              )
            }
            style={
              styles.input
            }
          >
            <option value="">
              -- Select Student
              --
            </option>

            {students.map(
              (student) => (
                <option
                  key={
                    student._id
                  }
                  value={
                    student._id
                  }
                >
                  {
                    student.name
                  }{" "}
                  (
                  {
                    student.rollNumber
                  }
                  )
                </option>
              )
            )}
          </select>

          {/* EXAM NAME */}
          <label>
            Exam Name
          </label>

          <input
            type="text"
            placeholder="e.g. Mid Term / Final Exam"
            value={examName}
            onChange={(e) =>
              setExamName(
                e.target.value
              )
            }
            style={
              styles.input
            }
          />

          {/* SUBJECT MARKS */}
          <h3>
            Subject-wise
            Marks Entry
          </h3>

          {marksData.map(
            (
              subject,
              index
            ) => (
              <div
                key={
                  subject.subjectId
                }
                style={
                  styles.subjectCard
                }
              >
                <div>
                  <strong>
                    {
                      subject.subjectName
                    }
                  </strong>
                  <p>
                    Code:{" "}
                    {
                      subject.subjectCode
                    }{" "}
                    | Full
                    Marks:{" "}
                    {
                      subject.fullMarks
                    }{" "}
                    | Pass
                    Marks:{" "}
                    {
                      subject.passMarks
                    }
                  </p>
                </div>

                <input
                  type="number"
                  min="0"
                  max={
                    subject.fullMarks
                  }
                  placeholder={`Enter marks (0-${subject.fullMarks})`}
                  value={
                    subject.marksObtained
                  }
                  onChange={(
                    e
                  ) =>
                    handleMarksChange(
                      index,
                      e.target
                        .value
                    )
                  }
                  style={
                    styles.input
                  }
                />
              </div>
            )
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            style={
              styles.button
            }
          >
            {loading
              ? "Saving..."
              : "Submit Result"}
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
  loadingContainer: {
    minHeight: "100vh",
    display: "flex",
    justifyContent:
      "center",
    alignItems:
      "center",
    background:
      "#f4f6fb",
  },

  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent:
      "center",
    alignItems:
      "center",
    background:
      "#f4f6fb",
    padding: "30px",
  },

  card: {
    width: "900px",
    background:
      "white",
    padding: "30px",
    borderRadius:
      "15px",
    boxShadow:
      "0 5px 15px rgba(0,0,0,0.1)",
  },

  title: {
    fontSize: "32px",
    fontWeight: "bold",
  },

  subtitle: {
    color: "gray",
    marginBottom: "20px",
  },

  form: {
    display: "flex",
    flexDirection:
      "column",
    gap: "15px",
  },

  input: {
    width: "100%",
    padding: "12px",
    border:
      "1px solid #ccc",
    borderRadius:
      "8px",
  },

  subjectCard: {
    padding: "15px",
    border:
      "1px solid #ddd",
    borderRadius:
      "10px",
    background:
      "#fafafa",
    marginBottom: "10px",
  },

  button: {
    padding: "14px",
    background:
      "#4f46e5",
    color: "white",
    border: "none",
    borderRadius:
      "8px",
    fontSize: "16px",
    fontWeight:
      "bold",
    cursor: "pointer",
  },
};