import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddDoctorForm from '../components/doctor/AddDoctorForm';
import UpdateDoctorForm from '../components/doctor/UpdateDoctorForm';
import DeleteDoctorForm from '../components/doctor/DeleteDoctorForm';
import SearchDoctorForm from '../components/doctor/SearchDoctorForm';
import UpdateDoctorDateForm from '../components/doctor/UpdateDoctorDateForm';


export default function DoctorManagement() {
  const [activeTab, setActiveTab] = useState("add");
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Doctor Management</h1>
        <button
          onClick={() => navigate("/admin-dashboard")}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
           Back
        </button>
      </div>

      
      <div className="flex justify-center space-x-4 mb-6">
        <button onClick={() => setActiveTab("add")} className={tabStyle(activeTab === "add")}>
          Add Doctor
        </button>
        <button onClick={() => setActiveTab("update")} className={tabStyle(activeTab === "update")}>
          Update Doctor
        </button>
        <button onClick={() => setActiveTab("updateDate")} className={tabStyle(activeTab === "updateDate")}>
          Update Doctor Date
        </button>

        <button onClick={() => setActiveTab("search")} className={tabStyle(activeTab === "search")}>
          Search Doctor
        </button>
        <button onClick={() => setActiveTab("delete")} className={tabStyle(activeTab === "delete")}>
          Delete Doctor
        </button>
      </div>

      
      <div className="bg-white p-6 rounded shadow">
        {activeTab === "add" && <AddDoctorForm />}
        {activeTab === "update" && <UpdateDoctorForm />}
        {activeTab === "search" && <SearchDoctorForm />}
        {activeTab === "delete" && <DeleteDoctorForm />}
        {activeTab === "updateDate" && <UpdateDoctorDateForm />}

      </div>
    </div>
  );
}

function tabStyle(active) {
  return `px-4 py-2 rounded ${active ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`;
}
