import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import AddPatientForm from '../components/Patient/AddPatientForm';
import UpdatePatientForm from '../components/Patient/UpdatePatientForm';
import SearchPatientForm from '../components/Patient/SearchPatientForm';
import DeletePatientForm from '../components/Patient/DeletePatientForm';

export default function ReceptionistDashboard() {
  const [activeTab, setActiveTab] = useState("add");
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      navigate("/"); 
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto relative">
     
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-center">Receptionist Dashboard</h1>
        <button 
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      
      <div className="flex justify-center space-x-4 mb-6">
        <button onClick={() => setActiveTab("add")} className={tabStyle(activeTab === "add")}>
          Add Patient
        </button>
        <button onClick={() => setActiveTab("update")} className={tabStyle(activeTab === "update")}>
          Update Patient
        </button>
        <button onClick={() => setActiveTab("search")} className={tabStyle(activeTab === "search")}>
          Search Patient
        </button>
        <button onClick={() => setActiveTab("delete")} className={tabStyle(activeTab === "delete")}>
          Delete Patient
        </button>
      </div>

      
      <div className="bg-white p-6 rounded shadow">
        {activeTab === "add" && <AddPatientForm />}
        {activeTab === "update" && <UpdatePatientForm />}
        {activeTab === "search" && <SearchPatientForm />}
        {activeTab === "delete" && <DeletePatientForm />}
      </div>
    </div>
  );
}

function tabStyle(active) {
  return `px-4 py-2 rounded ${active ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`;
}
