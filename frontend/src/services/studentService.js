import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// ======================
// STUDENT APIs
// ======================

// Add Student
export const addStudent = async (data) => {
  const res = await API.post("/students", data);
  return res.data;
};

// Get All Students
export const getStudents = async () => {
  const res = await API.get("/students");
  return res.data;
};

// Get Single Student
export const getStudentById = async (id) => {
  const res = await API.get(`/students/${id}`);
  return res.data;
};

// Update Student
export const updateStudent = async (id, data) => {
  const res = await API.put(`/students/${id}`, data);
  return res.data;
};

// Delete Student
export const deleteStudent = async (id) => {
  const res = await API.delete(`/students/${id}`);
  return res.data;
};