import React, { useState } from 'react';

function UpdatePatientForm() {
  const [searchType, setSearchType] = useState('id');
  const [searchInput, setSearchInput] = useState('');
  const [patientResults, setPatientResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState('');

  const mockPatients = [
    {
      patientId: 1,
      name: 'John Doe',
      number: '9876543210',
      age: 30,
      gender: 'Male',
      address: 'New York',
      date: '2025-06-25',
      time: '09:00 AM'
    },
    {
      patientId: 2,
      name: 'Jane Smith',
      number: '9123456780',
      age: 28,
      gender: 'Female',
      address: 'Los Angeles',
      date: '2025-06-22',
      time: '02:00 PM'
    }
  ];

  const [updatedPatient, setUpdatedPatient] = useState({
    name: '',
    number: '',
    age: '',
    gender: '',
    address: '',
    date: '',
    time: ''
  });

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
    setStatus('');
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setUpdatedPatient({ ...patient });
  };

  const handleChange = (e) => {
    setUpdatedPatient({ ...updatedPatient, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus(`Patient ${updatedPatient.name} updated successfully!`);
    setShowModal(true);
    setTimeout(() => {
      setSelectedPatient(null);
      setPatientResults([]);
      setSearchInput('');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Update Patient</h2>

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
            <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded">
              Search
            </button>
          </div>

          {patientResults.length > 0 && (
            <ul className="space-y-2 max-h-40 overflow-auto">
              {patientResults.map(p => (
                <li key={p.patientId} className="flex justify-between items-center border p-2 rounded">
                  <span>{p.name} (ID: {p.patientId})</span>
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded"
                    onClick={() => handleSelectPatient(p)}
                  >
                    Select
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="col-span-2 font-medium">
            Updating: <strong>{selectedPatient.name}</strong>
          </div>
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="border p-2"
            value={updatedPatient.name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="number"
            placeholder="Phone Number"
            className="border p-2"
            value={updatedPatient.number}
            onChange={handleChange}
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            className="border p-2"
            value={updatedPatient.age}
            onChange={handleChange}
          />
          <input
            type="text"
            name="gender"
            placeholder="Gender"
            className="border p-2"
            value={updatedPatient.gender}
            onChange={handleChange}
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            className="border p-2"
            value={updatedPatient.address}
            onChange={handleChange}
          />
          <input
            type="date"
            name="date"
            className="border p-2"
            value={updatedPatient.date}
            onChange={handleChange}
          />
          <input
            type="text"
            name="time"
            placeholder="Time"
            className="border p-2"
            value={updatedPatient.time}
            onChange={handleChange}
          />

          <div className="col-span-2">
            <button className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded">
              Submit Update
            </button>
          </div>
        </form>
      )}

      {/* ✅ Overlay Success Message */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/40 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 text-center">
            <h3 className="text-lg font-semibold mb-4">{status}</h3>
            <button
              onClick={() => setShowModal(false)}
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

export default UpdatePatientForm;
