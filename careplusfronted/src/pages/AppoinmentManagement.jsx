import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddAppointment from '../components/appointment/AddAppointment';
import UpdateAppointment from '../components/appointment/UpdateAppointment';
import CancelAppointment from '../components/appointment/CancelAppointment';
import ViewAllAppointments from '../components/appointment/ViewAllAppointments';
import ViewByPatient from '../components/appointment/ViewByPatient';
import ViewByDoctor from '../components/appointment/ViewByDoctor';


export default function AppointmentManagement() {
  const [activeTab, setActiveTab] = useState("add");
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Appointment Oversight</h1>
        <button
          onClick={() => navigate("/admin-dashboard")}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Back
        </button>
      </div>

      
      <div className="flex gap-3 justify-start mb-6 overflow-x-auto whitespace-nowrap">
        <button onClick={() => setActiveTab("add")} className={tabStyle(activeTab === "add")}>
          Add Appointment
        </button>
        <button onClick={() => setActiveTab("update")} className={tabStyle(activeTab === "update")}>
          Update Appointment
        </button>
        {/* <button onClick={() => setActiveTab("cancel")} className={tabStyle(activeTab === "cancel")}>
          Cancel Appointment
        </button> */}
        <button onClick={() => setActiveTab("viewAll")} className={tabStyle(activeTab === "viewAll")}>
          View All
        </button>
        <button onClick={() => setActiveTab("byPatient")} className={tabStyle(activeTab === "byPatient")}>
          View by Patient
        </button>
        <button onClick={() => setActiveTab("byDoctor")} className={tabStyle(activeTab === "byDoctor")}>
          View by Doctor
        </button>
      </div>

      
      <div className="bg-white p-6 rounded shadow">
        {activeTab === "add" && <AddAppointment />}
        {activeTab === "update" && <UpdateAppointment />}
        {activeTab === "cancel" && <CancelAppointment />}
        {activeTab === "viewAll" && <ViewAllAppointments />}
        {activeTab === "byPatient" && <ViewByPatient />}
        {activeTab === "byDoctor" && <ViewByDoctor />}
      </div>
    </div>
  );
}

function tabStyle(active) {
  return `px-4 py-2 rounded ${active ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`;
}
