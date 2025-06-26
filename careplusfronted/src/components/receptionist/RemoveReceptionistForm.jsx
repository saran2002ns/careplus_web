import React, { useState } from 'react';
import axios from 'axios';

function RemoveReceptionistForm() {
  const [searchType, setSearchType] = useState('id');
  const [searchInput, setSearchInput] = useState('');
  const [results, setResults] = useState([]);
  const [selectedReceptionist, setSelectedReceptionist] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleSearch = async () => {
    try {
      let res;
      if (searchType === 'id') {
        if (!searchInput.trim()) {
          res = await axios.get('http://localhost:8080/api/receptionists');
          setResults(res.data);
        } else {
          res = await axios.get(`http://localhost:8080/api/receptionists/${searchInput}`);
          setResults([res.data]);
        }
      } else {
        if (!searchInput.trim()) {
          res = await axios.get('http://localhost:8080/api/receptionists');
          setResults(res.data);
        } else {
          res = await axios.get(`http://localhost:8080/api/receptionists/search?name=${searchInput}`);
          setResults(res.data);
        }
      }
    } catch (err) {
      setResults([]);
      alert('Receptionist not found');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/receptionists/${selectedReceptionist.id}`);
      setStatusMessage(`✅ Receptionist ${selectedReceptionist.name} removed successfully.`);
    } catch (err) {
      setStatusMessage(`❌ Failed to delete receptionist: ${err.response?.data || err.message}`);
    } finally {
      setShowConfirm(false);
      setShowStatus(true);
      setSelectedReceptionist(null);
      setResults([]);
      setSearchInput('');
    }
  };

  return (
    <div className="space-y-6">
      {!selectedReceptionist && (
        <>
          <div className="flex gap-2">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="border border-green-600 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="id">Search by ID</option>
              <option value="name">Search by Name</option>
            </select>
            <input
              type="text"
              className="border border-green-600 px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder={`Enter ${searchType === 'id' ? 'ID' : 'Name'}`}
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

          {results.length > 0 && (
            <ul className="space-y-4 w-full h-[300px] overflow-y-auto mt-4 pr-2">
              {results.map((r) => (
                <li
                  key={r.id}
                  className="flex justify-between items-center bg-gray-50 border border-gray-300 shadow-sm rounded-xl px-6 py-4"
                >
                  <div>
                    <p className="font-semibold text-lg text-gray-800">{r.name}</p>
                    <p className="text-sm text-gray-600">ID: {r.id}</p>
                    <p className="text-sm text-gray-600">Phone: {r.number}</p>
                  </div>
                  <button
                    className="px-4 py-2 rounded border border-red-600 text-red-700 font-semibold hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                    onClick={() => {
                      setSelectedReceptionist(r);
                      setShowConfirm(true);
                    }}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {showConfirm && selectedReceptionist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/40">
          <div className="bg-white p-6 rounded shadow-lg w-96 text-center">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="text-sm mb-4">
              Are you sure you want to remove <strong>{selectedReceptionist.name}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded border border-red-600 text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
              >
                Yes, Delete
              </button>

              <button
                onClick={() => {
                  setShowConfirm(false);
                  setSelectedReceptionist(null);
                }}
                className="px-4 py-2 rounded border border-gray-400 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/40">
          <div className="bg-white p-6 rounded shadow-lg w-96 text-center">
            <h3 className="text-lg font-semibold mb-4">{statusMessage}</h3>
            <button
              onClick={() => setShowStatus(false)}
              className="px-4 py-2 rounded border border-green-600 text-green-700 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RemoveReceptionistForm;
