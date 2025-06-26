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
    <div className="space-y-6 min-h-[500px] flex flex-col">
      {/* <h2 className="text-xl font-semibold mb-4 text-green-700">Delete Patient</h2> */}

      {!selectedPatient ? (
        <>
          {/* Search Row */}
          <div className="flex flex-wrap gap-2 items-center">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500"
            >
              <option value="id">Search by ID</option>
              <option value="name">Search by Name</option>
            </select>

            <input
              type="text"
              placeholder={`Enter ${searchType === 'id' ? 'ID' : 'Name'}`}
              className="border p-2 flex-1 rounded-md min-w-[200px] focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500"
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

          {/* Results */}
          {patientResults.length > 0 && (
            <ul className="space-y-4 w-full h-[450px] overflow-y-auto mt-4 pr-2">
              {patientResults.map((p) => (
                <li
                  key={p.id}
                  className="flex justify-between items-center bg-gray-50 border border-gray-300 shadow-sm rounded-xl px-6 py-4"
                >
                  <div>
                    <p className="font-semibold text-lg text-gray-800">{p.name}</p>
                    <p className="text-sm text-gray-600">
                      ID: {p.id} | Gender: {p.gender} | Age: {p.age}
                    </p>
                    <p className="text-sm text-gray-600">Phone: {p.number}</p>
                  </div>
                  <button
                    onClick={() => setSelectedPatient(p)}
                    className="px-4 py-2 rounded border border-red-600 text-red-700 font-semibold hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
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
          <p className="text-lg">Are you sure you want to delete this patient?</p>
          <div className="text-sm font-medium border p-4 rounded text-left bg-gray-50 w-full max-w-md mx-auto shadow-sm">
            <p><strong>ID:</strong> {selectedPatient.id}</p>
            <p><strong>Name:</strong> {selectedPatient.name}</p>
            <p><strong>Age:</strong> {selectedPatient.age}</p>
            <p><strong>Gender:</strong> {selectedPatient.gender}</p>
            <p><strong>Phone:</strong> {selectedPatient.number}</p>
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded border border-red-600 text-red-700 font-semibold hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            >
              Confirm Delete
            </button>
            <button
              onClick={() => setSelectedPatient(null)}
              className="px-4 py-2 rounded border border-blue-600 text-blue-700 font-semibold hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Overlay */}
      {showOverlay && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 text-center">
            <h3 className="text-lg font-semibold mb-4">{status}</h3>
            <button
              onClick={() => setShowOverlay(false)}
              className="px-4 py-2 rounded border border-blue-600 text-blue-700 font-semibold hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
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
