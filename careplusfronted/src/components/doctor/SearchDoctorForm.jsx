import React, { useState } from 'react';

const mockDoctors = [
  {
    doctorId: 1,
    name: 'Dr. Ravi',
    age: 45,
    gender: 'Male',
    number: '9876543210',
    specialist: 'Cardiologist',
    availableDates: [
      { date: '2025-06-24', timeSlots: ['09:00 AM', '11:00 AM'] },
      { date: '2025-06-25', timeSlots: ['02:00 PM', '04:00 PM'] }
    ]
  },
  {
    doctorId: 2,
    name: 'Dr. Meena',
    age: 38,
    gender: 'Female',
    number: '9123456780',
    specialist: 'Dermatologist',
    availableDates: [
      { date: '2025-06-26', timeSlots: ['10:00 AM', '01:00 PM'] }
    ]
  }
];

export default function SearchDoctorForm() {
  const [searchType, setSearchType] = useState('id');
  const [searchInput, setSearchInput] = useState('');
  const [results, setResults] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const handleSearch = () => {
    let filtered = [];

    if (searchType === 'id') {
      filtered = mockDoctors.filter(doc =>
        doc.doctorId.toString() === searchInput.trim()
      );
    } else {
      filtered = mockDoctors.filter(doc =>
        doc.name.toLowerCase().includes(searchInput.toLowerCase())
      );
    }

    setResults(filtered);
    setSelectedDoctor(null);
  };

  return (
    <div className="space-y-6 relative">
      <h2 className="text-xl font-semibold">Search Doctor</h2>

      {/* Search Inputs */}
      <div className="flex items-center gap-2">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="border px-3 py-2"
        >
          <option value="id">Search by ID</option>
          <option value="name">Search by Name</option>
        </select>

        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder={`Enter ${searchType === 'id' ? 'ID' : 'Name'}`}
          className="border p-2 flex-1"
        />

        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* Result List */}
      {results.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium">Matching Doctors:</h3>
          {results.map((doc, idx) => (
            <div
              key={idx}
              className="p-4 border rounded flex justify-between items-center"
            >
              <span>{doc.name} (ID: {doc.doctorId}) – {doc.specialist}</span>
              <button
                onClick={() => setSelectedDoctor(doc)}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                View
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Overlay Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 text-center">
            <h3 className="text-lg font-semibold mb-4">Doctor Details</h3>
            <div className="text-left text-sm space-y-2">
              <p><strong>ID:</strong> {selectedDoctor.doctorId}</p>
              <p><strong>Name:</strong> {selectedDoctor.name}</p>
              <p><strong>Age:</strong> {selectedDoctor.age}</p>
              <p><strong>Gender:</strong> {selectedDoctor.gender}</p>
              <p><strong>Phone:</strong> {selectedDoctor.number}</p>
              <p><strong>Specialist:</strong> {selectedDoctor.specialist}</p>
            </div>

            {selectedDoctor.availableDates?.length > 0 && (
              <div className="mt-4 text-left">
                <h4 className="font-semibold mb-1">Availability</h4>
                <ul className="list-disc list-inside text-sm">
                  {selectedDoctor.availableDates.map((entry, index) => (
                    <li key={index}>
                      {entry.date}: {entry.timeSlots.join(', ')}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => setSelectedDoctor(null)}
              className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}


    </div>
  );
}
