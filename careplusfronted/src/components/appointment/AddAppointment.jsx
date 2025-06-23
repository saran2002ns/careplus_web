import React, { useState } from 'react';

function AddAppointment() {
  const [searchTypePatient, setSearchTypePatient] = useState('id');
  const [searchInputPatient, setSearchInputPatient] = useState('');
  const [patientResults, setPatientResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [searchTypeDoctor, setSearchTypeDoctor] = useState('id');
  const [searchInputDoctor, setSearchInputDoctor] = useState('');
  const [doctorResults, setDoctorResults] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [showConfirmOverlay, setShowConfirmOverlay] = useState(false);
  const [showFinalOverlay, setShowFinalOverlay] = useState(false);

  const mockPatients = [
    { id: 1, name: 'Ram', number: '1234567890', age: 30, gender: 'Male', address: 'City A' },
    { id: 2, name: 'Priya', number: '9876543210', age: 28, gender: 'Female', address: 'City B' },
  ];

  const mockDoctors = [
    {
      doctorId: 1,
      name: 'Dr. Ravi',
      specialist: 'Cardiologist',
      number: '8888888888',
      age: 45,
      gender: 'Male',
      availableDates: [
        { date: '2025-06-23', timeSlots: ['09:00', '11:00'] },
        { date: '2025-06-24', timeSlots: ['14:00', '16:00'] },
      ]
    },
    {
      doctorId: 2,
      name: 'Dr. Meena',
      specialist: 'Dermatologist',
      number: '9999999999',
      age: 39,
      gender: 'Female',
      availableDates: [
        { date: '2025-06-23', timeSlots: ['10:00', '12:00'] },
      ]
    }
  ];

  const searchPatient = () => {
    const result = searchTypePatient === 'id'
      ? mockPatients.filter(p => p.id.toString() === searchInputPatient)
      : mockPatients.filter(p => p.name.toLowerCase().includes(searchInputPatient.toLowerCase()));
    setPatientResults(result);
    setSelectedPatient(null);
  };

  const searchDoctor = () => {
    const result = searchTypeDoctor === 'id'
      ? mockDoctors.filter(d => d.doctorId.toString() === searchInputDoctor)
      : mockDoctors.filter(d => d.name.toLowerCase().includes(searchInputDoctor.toLowerCase()));
    setDoctorResults(result);
    setSelectedDoctor(null);
  };

  const handleConfirm = () => {
    setShowConfirmOverlay(false);
    setShowFinalOverlay(true);
  };

  const resetForm = () => {
    setSelectedDoctor(null);
    setSelectedPatient(null);
    setSearchInputDoctor('');
    setSearchInputPatient('');
    setDoctorResults([]);
    setPatientResults([]);
    setShowFinalOverlay(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Add Appointment</h2>

      {/* Patient Search */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <select
            value={searchTypePatient}
            onChange={e => setSearchTypePatient(e.target.value)}
            className="border p-2"
          >
            <option value="id">Search Patient by ID</option>
            <option value="name">Search Patient by Name</option>
          </select>
          <input
            type="text"
            value={searchInputPatient}
            onChange={e => setSearchInputPatient(e.target.value)}
            className="border p-2"
            placeholder="Enter Patient ID or Name"
          />
          <button onClick={searchPatient} className="bg-blue-600 text-white px-4 py-2 rounded">
            Search
          </button>
        </div>

        {selectedPatient ? (
          <div className="p-2 border rounded bg-green-50">
            Selected Patient: <strong>{selectedPatient.name}</strong> (ID: {selectedPatient.id})
          </div>
        ) : (
          <ul className="space-y-1">
            {patientResults.map(p => (
              <li key={p.id} className="border p-2 flex justify-between items-center">
                <span>{p.name} (ID: {p.id})</span>
                <button
                  onClick={() => setSelectedPatient(p)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Select
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Doctor Search */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <select
            value={searchTypeDoctor}
            onChange={e => setSearchTypeDoctor(e.target.value)}
            className="border p-2"
          >
            <option value="id">Search Doctor by ID</option>
            <option value="name">Search Doctor by Name</option>
          </select>
          <input
            type="text"
            value={searchInputDoctor}
            onChange={e => setSearchInputDoctor(e.target.value)}
            className="border p-2"
            placeholder="Enter Doctor ID or Name"
          />
          <button onClick={searchDoctor} className="bg-blue-600 text-white px-4 py-2 rounded">
            Search
          </button>
        </div>

        {selectedDoctor ? (
          <div className="p-2 border rounded bg-green-50">
            Selected Doctor: <strong>{selectedDoctor.name}</strong> (ID: {selectedDoctor.doctorId})
          </div>
        ) : (
          <ul className="space-y-1">
            {doctorResults.map(d => (
              <li key={d.doctorId} className="border p-2 flex justify-between items-center">
                <span>{d.name} (ID: {d.doctorId})</span>
                <button
                  onClick={() => setSelectedDoctor(d)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Select
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Show Confirmation Button */}
      {selectedDoctor && selectedPatient && (
        <button
          onClick={() => setShowConfirmOverlay(true)}
          className="bg-purple-600 text-white px-6 py-2 rounded"
        >
          Add Appointment
        </button>
      )}

      {/* Confirmation Overlay */}
      {showConfirmOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-2 text-center">Confirm Appointment</h3>
            <div className="text-sm mb-4">
              <p><strong>Patient:</strong> {selectedPatient.name} (ID: {selectedPatient.id})</p>
              <p><strong>Phone:</strong> {selectedPatient.number}</p>
              <hr className="my-2" />
              <p><strong>Doctor:</strong> {selectedDoctor.name} (ID: {selectedDoctor.doctorId})</p>
              <p><strong>Specialist:</strong> {selectedDoctor.specialist}</p>
              <p><strong>Phone:</strong> {selectedDoctor.number}</p>
              <p><strong>Availability:</strong></p>
              <ul className="list-disc list-inside">
                {selectedDoctor.availableDates.map((d, idx) => (
                  <li key={idx}>{d.date} – {d.timeSlots.join(', ')}</li>
                ))}
              </ul>
            </div>
            <div className="flex justify-center gap-4">
              <button onClick={handleConfirm} className="bg-green-600 text-white px-4 py-2 rounded">
                Confirm
              </button>
              <button onClick={() => setShowConfirmOverlay(false)} className="bg-gray-300 px-4 py-2 rounded">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Final Confirmation Overlay */}
      {showFinalOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded shadow-lg w-96 text-center">
            <h3 className="text-lg font-semibold mb-4">Appointment created successfully!</h3>
            <button
              onClick={resetForm}
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

export default AddAppointment;
