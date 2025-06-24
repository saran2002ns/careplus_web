import React, { useState } from 'react';

export default function DeleteDoctorForm() {
  const [searchType, setSearchType] = useState('id');
  const [searchInput, setSearchInput] = useState('');
  const [results, setResults] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [status, setStatus] = useState('');

  const handleSearch = async () => {
    try {
      let response;
      if (searchType === 'id') {
        response = await fetch(`http://localhost:8080/api/doctors/${searchInput.trim()}`);
        if (!response.ok) throw new Error("Doctor not found");
        const doctor = await response.json();
        setResults([
          {
            doctorId: doctor.doctorDTO.doctorId,
            name: doctor.doctorDTO.name,
            specialist: doctor.doctorDTO.specialist,
            availableDates: doctor.dates || [],
          },
        ]);
      } else {
        response = await fetch(`http://localhost:8080/api/doctors/search?name=${searchInput.trim()}`);
        if (!response.ok) throw new Error("Doctors not found");
        const doctors = await response.json();
        const formatted = doctors.map(doc => ({
          doctorId: doc.doctor?.doctorId || doc.doctorId,
          name: doc.doctor?.name || doc.name,
          specialist: doc.doctor?.specialist || doc.specialist,
          availableDates: doc.availableDates || [],
        }));
        setResults(formatted);
      }

      setSelectedDoctor(null);
      setStatus('');
    } catch (error) {
      console.error("Error fetching doctor(s):", error);
      setStatus("Doctor not found or server error.");
      setResults([]);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/doctors/${selectedDoctor.doctorId}`, {
        method: 'DELETE',
      });

      const result = await response.text();

      if (response.ok) {
        setStatus(`Doctor ${selectedDoctor.name} (ID: ${selectedDoctor.doctorId}) deleted successfully!`);
        setResults(prev => prev.filter(doc => doc.doctorId !== selectedDoctor.doctorId));
      } else {
        setStatus(`Failed to delete doctor: ${result}`);
      }
    } catch (err) {
      console.error("Delete error:", err);
      setStatus("Error connecting to server.");
    }

    setShowOverlay(true);
    setSelectedDoctor(null);
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

          {status && <p className="text-red-600">{status}</p>}

          {results.length > 0 && (
            <ul className="space-y-2 max-h-40 overflow-auto">
              {results.map(doc => (
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
          <p className="text-lg">Are you sure you want to delete this doctor?</p>
          <div className="text-sm font-medium border p-4 rounded bg-gray-100">
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
