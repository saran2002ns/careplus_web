import React, { useState } from 'react';
import axios from 'axios';

function ViewByPatient() {
  const [searchType, setSearchType] = useState('id');
  const [searchInput, setSearchInput] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/appointments');
      const data = response.data;

      const filtered = searchType === 'id'
        ? data.filter(app => app.patient.id.toString() === searchInput.trim())
        : data.filter(app => app.patient.name.toLowerCase().includes(searchInput.toLowerCase()));

      setResults(filtered);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setResults([]);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Search Appointments by Patient</h2>

      <div className="flex gap-2">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="border p-2"
        >
          <option value="id">Patient ID</option>
          <option value="name">Patient Name</option>
        </select>
        <input
          type="text"
          placeholder={`Enter ${searchType === 'id' ? 'Patient ID' : 'Patient Name'}`}
          className="border p-2 flex-1"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {results.length > 0 ? (
        <div className="grid gap-4">
          {results.map((appt) => (
            <div key={appt.id} className="border rounded-lg p-4 shadow">
              <h3 className="text-lg font-semibold mb-2">Appointment ID: {appt.id}</h3>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-1">Patient Info</h4>
                  <p><strong>Name:</strong> {appt.patient.name}</p>
                  <p><strong>ID:</strong> {appt.patient.id}</p>
                  <p><strong>Phone:</strong> {appt.patient.number}</p>
                  <p><strong>Gender:</strong> {appt.patient.gender}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Doctor Info</h4>
                  <p><strong>Name:</strong> {appt.docter.doctor.name}</p>
                  <p><strong>ID:</strong> {appt.docter.doctor.doctorId}</p>
                  <p><strong>Phone:</strong> {appt.docter.doctor.number}</p>
                  <p><strong>Specialist:</strong> {appt.docter.doctor.specialist}</p>
                </div>
              </div>

              <div className="mt-2 text-sm">
                <p><strong>Date:</strong> {appt.date}</p>
                <p><strong>Time:</strong> {appt.time}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No appointments found.</p>
      )}
    </div>
  );
}

export default ViewByPatient;
