import React, { useState } from 'react';

function RemoveReceptionistForm() {
  const [searchType, setSearchType] = useState('id');
  const [searchInput, setSearchInput] = useState('');
  const [results, setResults] = useState([]);
  const [selectedReceptionist, setSelectedReceptionist] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const mockReceptionists = [
    { id: 1, name: 'Priya', number: '9876543210' },
    { id: 2, name: 'Rahul', number: '9123456780' },
    { id: 3, name: 'Priya', number: '9000000000' }
  ];

  const handleSearch = () => {
    let result = [];
    if (searchType === 'id') {
      result = mockReceptionists.filter(r => r.id.toString() === searchInput);
    } else {
      result = mockReceptionists.filter(r =>
        r.name.toLowerCase().includes(searchInput.toLowerCase())
      );
    }
    setResults(result);
    setSelectedReceptionist(null);
  };

  const handleDelete = () => {
    setShowConfirm(false);
    setStatusMessage(`Receptionist ${selectedReceptionist.name} removed successfully.`);
    setShowStatus(true);
    setSelectedReceptionist(null);
    setResults([]);
    setSearchInput('');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Remove Receptionist</h2>

      {!selectedReceptionist && (
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
              className="border p-2"
              placeholder={`Enter ${searchType === 'id' ? 'ID' : 'Name'}`}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded">
              Search
            </button>
          </div>

          {results.length > 0 && (
            <ul className="space-y-2">
              {results.map(r => (
                <li key={r.id} className="flex justify-between items-center border p-2 rounded">
                  <span>{r.name} (ID: {r.id}) - {r.number}</span>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => {
                      setSelectedReceptionist(r);
                      setShowConfirm(true);
                    }}
                  >
                    Select
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/40">
          <div className="bg-white p-6 rounded shadow-lg w-96 text-center">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="text-sm mb-4">
              Are you sure you want to remove <strong>{selectedReceptionist.name}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-300 px-4 py-2 rounded"
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

export default RemoveReceptionistForm;
