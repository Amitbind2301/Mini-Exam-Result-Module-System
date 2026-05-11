import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import StudentsPage from "./pages/StudentsPage";
import AddStudent from "./pages/AddStudent";
import EditStudent from "./pages/EditStudent";

import SubjectsPage from "./pages/SubjectsPage";
import AddSubjectPage from "./pages/AddSubjectPage";
import EditSubjectPage from "./pages/EditSubjectPage";

import ResultsPage from "./pages/ResultsPage";
import AddResultPage from "./pages/AddResultPage";
import ResultDetailPage from "./pages/ResultDetailPage";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* ROOT → LOGIN */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* PUBLIC ROUTE */}
        <Route path="/login" element={<Login />} />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* =========================
            STUDENTS MODULE
        ========================= */}
        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <StudentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/students/add"
          element={
            <ProtectedRoute>
              <AddStudent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/students/edit/:id"
          element={
            <ProtectedRoute>
              <EditStudent />
            </ProtectedRoute>
          }
        />

        {/* OLD ROUTE SUPPORT */}
        <Route
          path="/add-student"
          element={<Navigate to="/students/add" replace />}
        />

        {/* =========================
            SUBJECTS MODULE
        ========================= */}
        <Route
          path="/subjects"
          element={
            <ProtectedRoute>
              <SubjectsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/subjects/add"
          element={
            <ProtectedRoute>
              <AddSubjectPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subjects/edit/:id"
          element={
            <ProtectedRoute>
              <EditSubjectPage />
            </ProtectedRoute>
          }
        />

        {/* =========================
            RESULTS MODULE
        ========================= */}
        <Route
          path="/results"
          element={
            <ProtectedRoute>
              <ResultsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/results/add"
          element={
            <ProtectedRoute>
              <AddResultPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/results/:id"
          element={
            <ProtectedRoute>
              <ResultDetailPage />
            </ProtectedRoute>
          }
        />

        {/* OLD ROUTE SUPPORT */}
        <Route
          path="/result/:studentId"
          element={<Navigate to="/results/:studentId" replace />}
        />

        {/* =========================
            FALLBACK
        ========================= */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;