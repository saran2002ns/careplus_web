import React, { useState } from 'react';
import axios from 'axios';

function ViewByPatient() {
  const [searchType, setSearchType] = useState('id');
  const [searchInput, setSearchInput] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/appointments');
      const data = response.data;

      let filtered = data;

      if (searchInput.trim()) {
        filtered = searchType === 'id'
          ? data.filter(app => app.patient?.id?.toString() === searchInput.trim())
          : data.filter(app => app.patient?.name?.toLowerCase().includes(searchInput.toLowerCase()));
      }

      setResults(filtered);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setResults([]);
      alert("Unable to fetch appointments.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-xl font-semibold">Search Appointments by Patient</h2>

      {/* Search Input */}
      <div className="flex gap-2">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="border border-orange-600 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="id">Patient ID</option>
          <option value="name">Patient Name</option>
        </select>
        <input
          type="text"
          placeholder={`Enter ${searchType === 'id' ? 'Patient ID' : 'Patient Name'}`}
          className="border border-orange-600 px-3 py-2 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 rounded border border-blue-600 text-blue-700 font-semibold hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        >
          Search
        </button>
      </div>


      {/* Appointment Cards */}
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : results.length > 0 ? (
        <div className="grid gap-4">
          {results.map((appt) => (
            <div key={appt.id} className="border rounded-lg p-4 shadow bg-white">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Appointment ID: {appt.id}</h3>
                {/* <button
                  className="px-4 py-1 rounded border border-green-600 text-green-700 font-semibold hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                  onClick={() => alert(`Selected Appointment ID: ${appt.id}`)}
                >
                  Select
                </button> */}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-1">Patient Info</h4>
                  <p><strong>Name:</strong> {appt.patient?.name || 'N/A'}</p>
                  <p><strong>ID:</strong> {appt.patient?.id || 'N/A'}</p>
                  <p><strong>Phone:</strong> {appt.patient?.number || 'N/A'}</p>
                  <p><strong>Gender:</strong> {appt.patient?.gender || 'N/A'}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Doctor Info</h4>
                  <p><strong>Name:</strong> {appt.docter?.doctor?.name || 'N/A'}</p>
                  <p><strong>ID:</strong> {appt.docter?.doctor?.doctorId || 'N/A'}</p>
                  <p><strong>Phone:</strong> {appt.docter?.doctor?.number || 'N/A'}</p>
                  <p><strong>Specialist:</strong> {appt.docter?.doctor?.specialist || 'N/A'}</p>
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
