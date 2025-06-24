import { useState } from "react";
import { UNSAFE_withHydrateFallbackProps, useNavigate } from "react-router-dom";
import axios from "axios";

const API = 'http://localhost:8080/api/admins/login';

export default function AdminLogin() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(API, {
        identifier,
        password
      });
      console.log(response);
      console.log(response.data);

      if (response.status === 200) {
        navigate("/admin-dashboard");
      }
    } catch (err) {
      setError("Invalid ID/Number or Password");
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center gap-4 bg-white">
      <h2 className="text-2xl font-semibold">Admin Login</h2>
      <input
        className="border p-2"
        placeholder="Admin ID or Number"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
      />
      <input
        className="border p-2"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <div className="text-red-500">{error}</div>}
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Login
      </button>
    </div>
  );
}
