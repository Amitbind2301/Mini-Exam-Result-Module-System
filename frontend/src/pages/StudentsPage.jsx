import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ Fetch Students (FIXED)
  const fetchStudents = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/students", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("API RESPONSE:", res.data);

      // ✅ FIX: handle all response types safely
      const data =
        res.data?.data ||
        res.data?.students ||
        res.data ||
        [];

      setStudents(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error("Fetch Error:", error);
      setStudents([]);
      setLoading(false);
    }
  };

  // ✅ Delete Student
  const deleteStudent = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/api/students/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchStudents();
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // ✅ Safe search
  const filteredStudents = students.filter((s) =>
    (s.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (s.rollNumber || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-indigo-100 p-8">

      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl p-8">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Students</h1>

          <button
            onClick={() => navigate("/students/add")}
            className="bg-blue-600 text-white px-5 py-2 rounded-xl"
          >
            + Add Student
          </button>
        </div>

        {/* SEARCH */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search student..."
          className="border p-3 w-full md:w-1/3 rounded-xl mb-6"
        />

        {/* LOADING */}
        {loading ? (
          <p>Loading students...</p>
        ) : (
          <table className="w-full border">

            <thead>
              <tr className="bg-blue-600 text-white">
                <th>#</th>
                <th>Name</th>
                <th>Roll</th>
                <th>Class</th>
                <th>Section</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((s, i) => (
                  <tr key={s._id}>
                    <td>{i + 1}</td>
                    <td>{s.name}</td>
                    <td>{s.rollNumber}</td>
                    <td>{s.className}</td>
                    <td>{s.section}</td>
                    <td>{s.email}</td>
                    <td>{s.phone}</td>

                    <td>
                      <button
                        onClick={() => navigate(`/students/edit/${s._id}`)}
                        className="bg-green-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteStudent(s._id)}
                        className="bg-red-500 text-white px-3 py-1 ml-2 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center p-5">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        )}

      </div>
    </div>
  );
}