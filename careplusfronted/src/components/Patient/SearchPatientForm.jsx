import React, { useState } from 'react';
import axios from 'axios';

function SearchPatientForm() {
  const [searchType, setSearchType] = useState('id');
  const [searchInput, setSearchInput] = useState('');
  const [patientResults, setPatientResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [status, setStatus] = useState('');

  const handleSearch = async () => {
    setPatientResults([]);
    setSelectedPatient(null);
    setStatus('');

    try {
      if (searchType === 'id') {
        const res = await axios.get(`http://localhost:8080/api/patients/${searchInput}`);
        setPatientResults([res.data]); 
      } else {
        const res = await axios.get(`http://localhost:8080/api/patients/search?name=${searchInput}`);
        setPatientResults(res.data); 
      }
    } catch (err) {
      setStatus('No patient found or error occurred.');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Search Patient</h2>

      <div className="flex gap-2 mb-4">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="border p-2"
        >
          <option value="id">Search by ID</option>
          <option value="name">Search by Name</option>
        </select>
        <input
          type="text"
          placeholder={`Enter Patient ${searchType === 'id' ? 'ID' : 'Name'}`}
          className="border p-2 flex-1"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {status && <p className="text-red-600">{status}</p>}

      {patientResults.length > 0 && (
        <ul className="space-y-2">
          {patientResults.map((p) => (
            <li key={p.id} className="flex justify-between items-center border p-2 rounded">
              <span>{p.name} (ID: {p.id})</span>
              <button
                className="bg-green-600 text-white px-3 py-1 rounded"
                onClick={() => setSelectedPatient(p)}
              >
                View
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/40">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-auto relative text-left">
            <h2 className="text-xl font-bold mb-4 text-center">Patient Details</h2>
            <div className="space-y-2 text-sm">
              <p><strong>ID:</strong> {selectedPatient.id}</p>
              <p><strong>Name:</strong> {selectedPatient.name}</p>
              <p><strong>Age:</strong> {selectedPatient.age}</p>
              <p><strong>Gender:</strong> {selectedPatient.gender}</p>
              <p><strong>Phone:</strong> {selectedPatient.number}</p>
              <p><strong>Address:</strong> {selectedPatient.address}</p>
              <p><strong>Available:</strong> {selectedPatient.date} at {selectedPatient.time}</p>
            </div>
            <button
              onClick={() => setSelectedPatient(null)}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchPatientForm;
