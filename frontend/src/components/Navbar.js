import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">

      {/* BRAND */}
      <Link className="navbar-brand" to="/dashboard">
        Exam Result System
      </Link>

      {/* MOBILE TOGGLE */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">

        {/* NAV LINKS */}
        <ul className="navbar-nav me-auto">

          <li className="nav-item">
            <Link className="nav-link" to="/dashboard">
              Dashboard
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/students">
              Students
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/students/add">
              Add Student
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/subjects">
              Subjects
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/results">
              Results
            </Link>
          </li>

        </ul>

        {/* LOGOUT */}
        <button
          onClick={logoutHandler}
          className="btn btn-outline-light"
        >
          Logout
        </button>

      </div>
    </nav>
  );
};

export default Navbar;