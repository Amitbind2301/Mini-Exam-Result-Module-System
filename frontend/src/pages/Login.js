import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        { email, password }
      );

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
      alert("Login Successful ✅");

    } catch (err) {
      console.log(err);
      alert("Login Failed ❌");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">

      <div className="bg-white shadow-xl rounded-xl p-8 w-96">

        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Mini Exam Result Portal
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              className="w-full border p-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full border p-2 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Login
          </button>

        </form>

        <p className="text-center mt-4 text-sm">
          No account? <span className="text-blue-600 cursor-pointer">Register</span>
        </p>

      </div>

    </div>
  );
}