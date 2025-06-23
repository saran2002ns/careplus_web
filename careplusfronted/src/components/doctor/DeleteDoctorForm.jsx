import React, { useState } from 'react';

function DeleteDoctorForm() {
  const [searchType, setSearchType] = useState('id');
  const [searchInput, setSearchInput] = useState('');
  const [doctorResults, setDoctorResults] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [status, setStatus] = useState('');

  // Mock data
  const mockDoctors = [
    { doctorId: 1, name: 'Dr. Ravi', specialist: 'Cardiologist' },
    { doctorId: 2, name: 'Dr. Meena', specialist: 'Dermatologist' },
    { doctorId: 3, name: 'Dr. Karthik', specialist: 'Neurologist' },
  ];

  const handleSearch = () => {
    let results = [];
    if (searchType === 'id') {
      results = mockDoctors.filter(doc => doc.doctorId.toString() === searchInput);
    } else {
      results = mockDoctors.filter(doc =>
        doc.name.toLowerCase().includes(searchInput.toLowerCase())
      );
    }
    setDoctorResults(results);
    setSelectedDoctor(null);
    setStatus('');
  };

  const handleDelete = () => {
    setStatus(`Doctor ${selectedDoctor.name} (ID: ${selectedDoctor.doctorId}) deleted successfully!`);
    setShowOverlay(true);
    setDoctorResults([]);
    setSelectedDoctor(null);
    setSearchInput('');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Delete Doctor</h2>

      {!selectedDoctor ? (
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

          {doctorResults.length > 0 && (
            <ul className="space-y-2 max-h-40 overflow-auto">
              {doctorResults.map(doc => (
                <li
                  key={doc.doctorId}
                  className="flex justify-between items-center border p-2 rounded"
                >
                  <span>{doc.name} (ID: {doc.doctorId}, {doc.specialist})</span>
                  <button
                    onClick={() => setSelectedDoctor(doc)}
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
          <p>Are you sure you want to delete:</p>
          <div className="text-sm font-medium border p-4 rounded">
            <p><strong>ID:</strong> {selectedDoctor.doctorId}</p>
            <p><strong>Name:</strong> {selectedDoctor.name}</p>
            <p><strong>Specialist:</strong> {selectedDoctor.specialist}</p>
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Confirm Delete
            </button>
            <button
              onClick={() => setSelectedDoctor(null)}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ✅ Overlay */}
      {showOverlay && (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-white/40 backdrop-blur-sm z-50">
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

export default DeleteDoctorForm;
