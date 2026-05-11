import { useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function AddResult() {
  const [studentId, setStudentId] = useState("");
  const [subject, setSubject] = useState("");
  const [marks, setMarks] = useState("");

  const navigate = useNavigate();

  const submit = async () => {
    await API.post("/results", {
      studentId,
      subject,
      marks,
    });

    navigate("/results");
  };

  return (
    <>
      <Navbar />

      <h2>Add Result</h2>

      <input placeholder="Student ID" onChange={(e)=>setStudentId(e.target.value)} />
      <input placeholder="Subject" onChange={(e)=>setSubject(e.target.value)} />
      <input placeholder="Marks" onChange={(e)=>setMarks(e.target.value)} />

      <button onClick={submit}>Save</button>
    </>
  );
}

export default AddResult;