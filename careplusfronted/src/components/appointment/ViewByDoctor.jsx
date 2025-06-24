import React, { useState } from 'react';
import axios from 'axios';

function ViewByDoctor() {
  const [searchType, setSearchType] = useState('id');
  const [searchInput, setSearchInput] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchInput.trim()) return;

    setLoading(true);
    try {
      let response;
      if (searchType === 'id') {
        response = await axios.get(`http://localhost:8080/api/appointments/doctor/${searchInput}`);
      } else {
        response = await axios.get(`http://localhost:8080/api/appointments/doctor/search?name=${searchInput}`);
      }
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setResults([]);
      alert("No appointments found or server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-xl font-semibold">Search Appointments by Doctor</h2>

      <div className="flex gap-2">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="border p-2"
        >
          <option value="id">Doctor ID</option>
          <option value="name">Doctor Name</option>
        </select>
        <input
          type="text"
          placeholder={`Enter ${searchType === 'id' ? 'Doctor ID' : 'Doctor Name'}`}
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

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : results.length > 0 ? (
        <div className="grid gap-4">
          {results.map((appt) => (
            <div key={appt.id} className="border rounded-lg p-4 shadow bg-white">
              <h3 className="text-lg font-semibold mb-2">Appointment ID: {appt.id}</h3>

              <div className="grid grid-cols-2 gap-4 text-sm">
                
                <div>
                  <h4 className="font-medium mb-1">Doctor Info</h4>
                  <p><strong>Name:</strong> {appt.docter?.doctor?.name || 'N/A'}</p>
                  <p><strong>ID:</strong> {appt.docter?.doctor?.doctorId || 'N/A'}</p>
                  <p><strong>Phone:</strong> {appt.docter?.doctor?.number || 'N/A'}</p>
                  <p><strong>Specialist:</strong> {appt.docter?.doctor?.specialist || 'N/A'}</p>
                </div>

              
                <div>
                  <h4 className="font-medium mb-1">Patient Info</h4>
                  <p><strong>Name:</strong> {appt.patient?.name || 'N/A'}</p>
                  <p><strong>ID:</strong> {appt.patient?.id || 'N/A'}</p>
                  <p><strong>Phone:</strong> {appt.patient?.number || 'N/A'}</p>
                  <p><strong>Gender:</strong> {appt.patient?.gender || 'N/A'}</p>
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

export default ViewByDoctor;
