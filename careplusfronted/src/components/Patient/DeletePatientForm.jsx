import React, { useState } from 'react';
import axios from 'axios';

function DeletePatientForm() {
  const [searchType, setSearchType] = useState('id');
  const [searchInput, setSearchInput] = useState('');
  const [patientResults, setPatientResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [status, setStatus] = useState('');

  const handleSearch = async () => {
    setPatientResults([]);
    setSelectedPatient(null);
    setStatus('');

    try {
      let res;
      if (searchType === 'id') {
        res = await axios.get(`http://localhost:8080/api/patients/${searchInput}`);
        setPatientResults([res.data]);
      } else {
        res = await axios.get(`http://localhost:8080/api/patients/search?name=${searchInput}`);
        setPatientResults(res.data); 
      }
    } catch (err) {
      setStatus('No patient found.');
      setShowOverlay(true);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`http://localhost:8080/api/patients/${selectedPatient.id}`);
      setStatus(res.data);
    } catch (err) {
      setStatus(err.response?.data || 'Failed to delete patient.');
    } finally {
      setShowOverlay(true);
      setPatientResults([]);
      setSelectedPatient(null);
      setSearchInput('');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Delete Patient</h2>

      {!selectedPatient ? (
        <>
          <div className="flex gap-2">
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
              placeholder={`Enter ${searchType === 'id' ? 'ID' : 'Name'}`}
              className="border p-2"
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

          {patientResults.length > 0 && (
            <ul className="space-y-2 max-h-40 overflow-auto">
              {patientResults.map((p) => (
                <li
                  key={p.id}
                  className="flex justify-between items-center border p-2 rounded"
                >
                  <span>{p.name} (ID: {p.id}, {p.gender})</span>
                  <button
                    onClick={() => setSelectedPatient(p)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <div className="text-center space-y-4">
          <p>Are you sure you want to delete this patient?</p>
          <div className="text-sm font-medium border p-4 rounded text-left">
            <p><strong>ID:</strong> {selectedPatient.id}</p>
            <p><strong>Name:</strong> {selectedPatient.name}</p>
            <p><strong>Age:</strong> {selectedPatient.age}</p>
            <p><strong>Gender:</strong> {selectedPatient.gender}</p>
            <p><strong>Phone:</strong> {selectedPatient.number}</p>
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Confirm Delete
            </button>
            <button
              onClick={() => setSelectedPatient(null)}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showOverlay && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 text-center">
            <h3 className="text-lg font-semibold mb-4">{status}</h3>
            <button
              onClick={() => setShowOverlay(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeletePatientForm;
