import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ViewStudentsPage() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // FETCH STUDENTS
  const fetchStudents = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/students", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStudents(res.data || []);
      setLoading(false);
    } catch (error) {
      console.log("Fetch error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // DELETE STUDENT
  const deleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/api/students/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchStudents();
    } catch (error) {
      console.log(error);
    }
  };

  // FILTER
  const filteredStudents = students.filter(
    (student) =>
      (student.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (student.rollNumber || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-2xl rounded-3xl p-8">

          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">

            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                Students Management
              </h1>
              <p className="text-gray-500 mt-2">
                View and manage all registered students
              </p>
            </div>

            <div className="flex gap-3 flex-wrap">

              {/* SEARCH */}
              <input
                type="text"
                placeholder="Search student..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-4 py-3 border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-72"
              />

              {/* DASHBOARD BUTTON */}
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-2xl"
              >
                ⬅ Dashboard
              </button>

              {/* ADD BUTTON */}
              <button
                onClick={() => navigate("/students/add")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-2xl"
              >
                + Add Student
              </button>

            </div>
          </div>

          {/* LOADING */}
          {loading && (
            <p className="text-center text-gray-500">Loading students...</p>
          )}

          {/* TABLE */}
          <div className="overflow-x-auto rounded-2xl">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <th className="p-4">#</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Roll No</th>
                  <th className="p-4">Class</th>
                  <th className="p-4">Section</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student, index) => (
                    <tr
                      key={student._id}
                      className="border-b hover:bg-blue-50 transition"
                    >
                      <td className="p-4">{index + 1}</td>
                      <td className="p-4 font-semibold">{student.name}</td>
                      <td className="p-4">{student.rollNumber}</td>
                      <td className="p-4">{student.className}</td>
                      <td className="p-4">{student.section}</td>
                      <td className="p-4 text-blue-600">{student.email}</td>

                      <td className="p-4 flex gap-2">
                        <button
                          onClick={() =>
                            navigate(`/students/edit/${student._id}`)
                          }
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deleteStudent(student._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center p-6 text-gray-500">
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* FOOTER */}
          <div className="mt-6 text-sm text-gray-500 flex justify-between">
            <p>Total Students: {filteredStudents.length}</p>
          </div>

        </div>
      </div>
    </div>
  );
  <button
  onClick={() => navigate(`/result/${student._id}`)}
  className="bg-purple-500 text-white px-4 py-2 rounded"
>
  View Result
</button>
}
<button
  onClick={() => navigate(`/result/${student._id}`)}
  className="bg-purple-500 text-white px-4 py-2 rounded"
>
  View Result
</button>
