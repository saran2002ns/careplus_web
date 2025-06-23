import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/admin-dashboard");
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center gap-4 bg-white">
      <h2 className="text-2xl font-semibold">Admin Login</h2>
      <input className="border p-2" placeholder="Admin Username" />
      <input className="border p-2" placeholder="Password" type="password" />
      <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded">
        Login
      </button>
    </div>
  );
}
