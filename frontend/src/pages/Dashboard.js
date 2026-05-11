import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalSubjects: 0,
    totalResults: 0,
    passedStudents: 0,
    failedStudents: 0,
  });

  const [loading, setLoading] = useState(true);

  // FETCH LIVE DASHBOARD DATA FROM YOUR DB
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats({
        totalStudents: response.data.totalStudents || 0,
        totalSubjects: response.data.totalSubjects || 0,
        totalResults: response.data.totalResults || 0,
        passedStudents: response.data.passedStudents || 0,
        failedStudents: response.data.failedStudents || 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const actionButtons = [
    {
      title: "Add Student",
      icon: "➕",
      route: "/students/add",
    },
    {
      title: "View Students",
      icon: "📋",
      route: "/students",
    },
    {
      title: "Add Subject",
      icon: "📘",
      route: "/subjects/add",
    },
    {
      title: "View Subjects",
      icon: "📚",
      route: "/subjects",
    },
    {
      title: "Add Result",
      icon: "📝",
      route: "/results/add",
    },
    {
      title: "View Results",
      icon: "📄",
      route: "/results",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-indigo-100">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-5 flex justify-between items-center shadow-lg rounded-b-2xl">
        <h1 className="text-3xl font-bold">Mini Exam Result Module System
        </h1>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-xl font-semibold transition"
        >
          Logout
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 p-8">

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-gray-600">Total Students</h2>
          <p className="text-3xl font-bold text-blue-700 mt-2">
            {stats.totalStudents}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-gray-600">Total Subjects</h2>
          <p className="text-3xl font-bold text-indigo-700 mt-2">
            {stats.totalSubjects}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-gray-600">Total Results</h2>
          <p className="text-3xl font-bold text-purple-700 mt-2">
            {stats.totalResults}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-gray-600">Passed</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {stats.passedStudents}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-gray-600">Failed</h2>
          <p className="text-3xl font-bold text-red-600 mt-2">
            {stats.failedStudents}
          </p>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-8 pb-12 mt-6">
        {actionButtons.map((button, index) => (
          <button
            key={index}
            onClick={() => navigate(button.route)}
            className="bg-white shadow-2xl p-8 rounded-3xl hover:scale-105 transition duration-300"
          >
            <div className="text-6xl">{button.icon}</div>
            <h3 className="text-2xl font-bold mt-4 text-gray-800">
              {button.title}
            </h3>
          </button>
        ))}
      </div>
    </div>
  );
}