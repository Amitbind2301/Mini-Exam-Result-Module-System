import React, { useEffect, useState } from "react";
import { getStudentById, updateStudent } from "../services/studentService";
import { useNavigate, useParams } from "react-router-dom";

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    rollNumber: "",
    className: "",
    section: "",
    email: "",
    phone: "",
  });

  // ======================
  // FETCH STUDENT
  // ======================
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const res = await getStudentById(id);
        setFormData(res.data || {});
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch student details");
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  // ======================
  // HANDLE CHANGE
  // ======================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ======================
  // VALIDATION
  // ======================
  const validateForm = () => {
    if (!formData.name || !formData.rollNumber || !formData.className) {
      return "Name, Roll Number, and Class are required";
    }

    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      return "Invalid email format";
    }

    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) {
      return "Phone must be 10 digits";
    }

    return "";
  };

  // ======================
  // SUBMIT
  // ======================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);
      await updateStudent(id, formData);
      setSaving(false);
      navigate("/students");
    } catch (err) {
      setSaving(false);
      setError(err.response?.data?.message || "Failed to update student");
    }
  };

  // ======================
  // UI
  // ======================
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-indigo-100 p-6">

      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-3xl p-8">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            ✏️ Edit Student Details
          </h2>

          <button
            onClick={() => navigate("/students")}
            className="bg-gray-500 text-white px-4 py-2 rounded-xl"
          >
            Back
          </button>
        </div>

        {/* LOADING */}
        {loading && (
          <p className="text-center text-gray-500 mb-4">
            Loading student data...
          </p>
        )}

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-5">

          {/* NAME */}
          <div>
            <label className="font-semibold text-gray-700">Name *</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter student name"
              className="border p-3 rounded-xl w-full mt-1"
            />
          </div>

          {/* ROLL NUMBER */}
          <div>
            <label className="font-semibold text-gray-700">Roll Number *</label>
            <input
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleChange}
              placeholder="Enter roll number"
              className="border p-3 rounded-xl w-full mt-1"
            />
          </div>

          {/* CLASS */}
          <div>
            <label className="font-semibold text-gray-700">Class *</label>
            <input
              name="className"
              value={formData.className}
              onChange={handleChange}
              placeholder="Enter class"
              className="border p-3 rounded-xl w-full mt-1"
            />
          </div>

          {/* SECTION */}
          <div>
            <label className="font-semibold text-gray-700">Section</label>
            <input
              name="section"
              value={formData.section}
              onChange={handleChange}
              placeholder="Enter section"
              className="border p-3 rounded-xl w-full mt-1"
            />
          </div>

          {/* EMAIL */}
          <div className="col-span-2">
            <label className="font-semibold text-gray-700">Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="border p-3 rounded-xl w-full mt-1"
            />
          </div>

          {/* PHONE */}
          <div className="col-span-2">
            <label className="font-semibold text-gray-700">Phone</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="border p-3 rounded-xl w-full mt-1"
            />
          </div>

          {/* BUTTONS */}
          <div className="col-span-2 flex gap-4 mt-4">

            <button
              type="submit"
              disabled={saving}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl w-full"
            >
              {saving ? "Updating..." : "Update Student"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/students")}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl w-full"
            >
              Cancel
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default EditStudent;