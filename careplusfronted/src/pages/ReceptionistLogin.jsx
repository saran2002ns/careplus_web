import { useNavigate } from "react-router-dom";

export default function ReceptionistLogin() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/receptionist-dashboard");
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center gap-4 bg-white">
      <h2 className="text-2xl font-semibold">Receptionist Login</h2>
      <input className="border p-2" placeholder="Receptionist Username" />
      <input className="border p-2" placeholder="Password" type="password" />
      <button onClick={handleLogin} className="bg-green-500 text-white px-4 py-2 rounded">
        Login
      </button>
    </div>
  );
}
