import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

function Results() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    const res = await API.get("/results");
    setResults(res.data);
  };

  return (
    <>
      <Navbar />

      <h2>Results</h2>

      <Link to="/add-result">Add Result</Link>

      {results.map((r) => (
        <p key={r._id}>
          {r.student.name} - {r.subject} - {r.marks}
        </p>
      ))}
    </>
  );
}

export default Results;