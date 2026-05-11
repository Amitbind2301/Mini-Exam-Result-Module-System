import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ResultsPage() {
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // ======================
  // FETCH RESULTS FROM DB
  // ======================
  const fetchResults = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/results",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const resultData = res.data?.data || res.data || [];

      setResults(Array.isArray(resultData) ? resultData : []);
    } catch (error) {
      console.log("Results Fetch Error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  // ======================
  // DELETE RESULT
  // ======================
  const deleteResult = async (id) => {
    if (!window.confirm("Delete this result?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/results/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchResults();
    } catch (error) {
      console.log(error);
      alert("Delete failed");
    }
  };

  // ======================
  // LOADING
  // ======================
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h2 className="text-2xl font-bold">Loading Results...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-3xl p-8">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              📄 Results Management
            </h1>
            <p className="text-gray-500">
              View all generated student exam results
            </p>
          </div>

          <button
            onClick={() => navigate("/results/add")}
            className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700"
          >
            + Add Result
          </button>
        </div>

        {/* RESULTS TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="p-3">Student Name</th>
                <th className="p-3">Roll No</th>
                <th className="p-3">Class</th>
                <th className="p-3">Exam Name</th>
                <th className="p-3">Total Marks</th>
                <th className="p-3">Percentage</th>
                <th className="p-3">Grade</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {results.length > 0 ? (
                results.map((result) => (
                  <tr
                    key={result._id}
                    className="text-center border-b hover:bg-gray-50"
                  >
                    <td className="p-3">
                      {result.studentId?.name || "N/A"}
                    </td>

                    <td className="p-3">
                      {result.studentId?.rollNumber || "N/A"}
                    </td>

                    <td className="p-3">
                      {result.studentId?.className || "N/A"}
                    </td>

                    <td className="p-3">{result.examName}</td>

                    <td className="p-3">{result.totalMarks}</td>

                    <td className="p-3">
                      {result.percentage?.toFixed(2)}%
                    </td>

                    <td className="p-3 font-bold">
                      {result.grade}
                    </td>

                    <td
                      className={`p-3 font-bold ${
                        result.status === "Pass"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {result.status}
                    </td>

                    <td className="p-3 flex justify-center gap-2">
                      <button
                        onClick={() =>
                          navigate(`/results/${result._id}`)
                        }
                        className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600"
                      >
                        View
                      </button>

                      <button
                        onClick={() => deleteResult(result._id)}
                        className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="text-center p-6 text-gray-500"
                  >
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}