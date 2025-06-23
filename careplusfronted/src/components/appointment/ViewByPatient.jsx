import React, { useState } from 'react';

function ViewByPatient() {
  const [searchType, setSearchType] = useState('id');
  const [searchInput, setSearchInput] = useState('');
  const [results, setResults] = useState([]);

  // Mock appointment data (replace with backend fetch later)
  const mockAppointments = [
    {
      id: 201,
      date: '2025-06-25',
      time: '10:00',
      doctor: {
        doctorId: 1,
        name: 'Dr. Ravi',
        number: '9876543210',
        age: 45,
        gender: 'Male',
        specialist: 'Cardiologist'
      },
      patient: {
        id: 1,
        name: 'Ravi Kumar',
        number: '1234567890',
        gender: 'Male',
        age: 30,
        address: 'Chennai'
      }
    },
    {
      id: 202,
      date: '2025-06-26',
      time: '11:00',
      doctor: {
        doctorId: 2,
        name: 'Dr. Meena',
        number: '8765432109',
        age: 38,
        gender: 'Female',
        specialist: 'Dermatologist'
      },
      patient: {
        id: 2,
        name: 'Priya Sharma',
        number: '9999988888',
        gender: 'Female',
        age: 28,
        address: 'Madurai'
      }
    }
  ];

  const handleSearch = () => {
    let filtered = [];

    if (searchType === 'id') {
      filtered = mockAppointments.filter(app =>
        app.patient.id.toString() === searchInput.trim()
      );
    } else {
      filtered = mockAppointments.filter(app =>
        app.patient.name.toLowerCase().includes(searchInput.toLowerCase())
      );
    }

    setResults(filtered);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Search Appointments by Patient</h2>

      <div className="flex gap-2">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="border p-2"
        >
          <option value="id">Patient ID</option>
          <option value="name">Patient Name</option>
        </select>
        <input
          type="text"
          placeholder={`Enter ${searchType === 'id' ? 'Patient ID' : 'Patient Name'}`}
          className="border p-2 flex-1"
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

      {results.length > 0 ? (
        <div className="grid gap-4">
          {results.map((appt) => (
            <div key={appt.id} className="border rounded-lg p-4 shadow">
              <h3 className="text-lg font-semibold mb-2">Appointment ID: {appt.id}</h3>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-1">Patient Info</h4>
                  <p><strong>Name:</strong> {appt.patient.name}</p>
                  <p><strong>ID:</strong> {appt.patient.id}</p>
                  <p><strong>Phone:</strong> {appt.patient.number}</p>
                  <p><strong>Gender:</strong> {appt.patient.gender}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Doctor Info</h4>
                  <p><strong>Name:</strong> {appt.doctor.name}</p>
                  <p><strong>ID:</strong> {appt.doctor.doctorId}</p>
                  <p><strong>Phone:</strong> {appt.doctor.number}</p>
                  <p><strong>Specialist:</strong> {appt.doctor.specialist}</p>
                </div>
              </div>

              <div className="mt-2 text-sm">
                <p><strong>Date:</strong> {appt.date}</p>
                <p><strong>Time:</strong> {appt.time}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No appointments found.</p>
      )}
    </div>
  );
}

export default ViewByPatient;
