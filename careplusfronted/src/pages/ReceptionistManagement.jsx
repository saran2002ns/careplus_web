import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddReceptionistForm from '../components/receptionist/AddReceptionistForm';
import RemoveReceptionistForm from '../components/receptionist/RemoveReceptionistForm';




export default function ReceptionistManagement() {
  const [activeTab, setActiveTab] = useState("add");
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Receptionist Management</h1>
        <button
          onClick={() => navigate("/admin-dashboard")}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Back
        </button>
      </div>

      {/* Tabs */}
      <div className="flex justify-center space-x-4 mb-6">
        <button onClick={() => setActiveTab("add")} className={tabStyle(activeTab === "add")}>
          Add Receptionist
        </button>
        <button onClick={() => setActiveTab("remove")} className={tabStyle(activeTab === "remove")}>
          Remove Receptionist
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white p-6 rounded shadow">
        {activeTab === "add" && <AddReceptionistForm />}
        {activeTab === "remove" && <RemoveReceptionistForm />}
      </div>
    </div>
  );
}

function tabStyle(active) {
  return `px-4 py-2 rounded ${active ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`;
}
