import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      navigate("/"); 
    }
  };

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => navigate("/doctor-dashboard")}
          className="bg-blue-600 text-white py-3 px-6 rounded shadow hover:bg-blue-700"
        >
          Doctor Management
        </button>

        <button
          onClick={() => navigate("/receptionist-management")}
          className="bg-green-600 text-white py-3 px-6 rounded shadow hover:bg-green-700"
        >
          Receptionist Management
        </button>

        <button
          onClick={() => navigate("/appointment-oversight")}
          className="bg-purple-600 text-white py-3 px-6 rounded shadow hover:bg-purple-700"
        >
          Appointment Oversight
        </button>
      </div>
    </div>
  );
}
