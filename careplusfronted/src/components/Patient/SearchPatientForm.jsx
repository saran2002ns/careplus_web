import React, { useState } from 'react';

function SearchPatientForm() {
  const [searchType, setSearchType] = useState('id');
  const [searchInput, setSearchInput] = useState('');
  const [patientResults, setPatientResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const mockPatients = [
    {
      patientId: 1,
      name: 'John Doe',
      number: '9876543210',
      age: 30,
      gender: 'Male',
      address: 'Chennai',
      date: '2025-06-25',
      time: '09:00 AM'
    },
    {
      patientId: 2,
      name: 'Jane Smith',
      number: '9123456780',
      age: 28,
      gender: 'Female',
      address: 'Delhi',
      date: '2025-06-22',
      time: '02:00 PM'
    }
  ];

  const handleSearch = () => {
    let results = [];
    if (searchType === 'id') {
      results = mockPatients.filter(p => p.patientId.toString() === searchInput);
    } else {
      results = mockPatients.filter(p =>
        p.name.toLowerCase().includes(searchInput.toLowerCase())
      );
    }
    setPatientResults(results);
    setSelectedPatient(null);
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

      {patientResults.length > 0 && (
        <ul className="space-y-2">
          {patientResults.map(p => (
            <li key={p.patientId} className="flex justify-between items-center border p-2 rounded">
              <span>{p.name} (ID: {p.patientId})</span>
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
              <p><strong>ID:</strong> {selectedPatient.patientId}</p>
              <p><strong>Name:</strong> {selectedPatient.name}</p>
              <p><strong>Age:</strong> {selectedPatient.age}</p>
              <p><strong>Gender:</strong> {selectedPatient.gender}</p>
              <p><strong>Phone:</strong> {selectedPatient.number}</p>
              <p><strong>Address:</strong> {selectedPatient.address}</p>
              <p><strong>Appointment:</strong> {selectedPatient.date} at {selectedPatient.time}</p>
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
