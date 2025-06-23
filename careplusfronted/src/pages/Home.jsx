import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col justify-center items-center gap-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Welcome to CarePlus</h1>
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/admin-login")}
          className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600"
        >
          Admin Login
        </button>
        <button
          onClick={() => navigate("/receptionist-login")}
          className="bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600"
        >
          Receptionist Login
        </button>
      </div>
    </div>
  );
}
