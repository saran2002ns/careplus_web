import React, { useState } from 'react';

function UpdateDoctorDateForm() {
  const [searchType, setSearchType] = useState('id');
  const [searchInput, setSearchInput] = useState('');
  const [doctorResults, setDoctorResults] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const mockDoctors = [
    { doctorId: 1, name: 'Dr. Ravi', specialist: 'Cardiologist' },
    { doctorId: 2, name: 'Dr. Meena', specialist: 'Dermatologist' },
    { doctorId: 4, name: 'Dr. Karthik', specialist: 'Neurologist' },
    { doctorId: 3, name: 'Dr. Ravi', specialist: 'Cardiologist' },
  ];

  const defaultTimes = ["09:00", "11:00", "14:00", "16:00", "19:00"];

  const handleSearch = () => {
    const results =
      searchType === 'id'
        ? mockDoctors.filter(doc => doc.doctorId.toString() === searchInput.trim())
        : mockDoctors.filter(doc =>
            doc.name.toLowerCase().includes(searchInput.trim().toLowerCase())
          );
    setDoctorResults(results);
    setSelectedDoctor(null);
  };

  const handleAddTimeSlot = () => {
    setTimeSlots([...timeSlots, { time: '', available: true }]);
  };

  const handleTimeChange = (index, key, value) => {
    const updated = [...timeSlots];
    updated[index][key] = value;
    setTimeSlots(updated);
  };

  const handleRemoveTime = (index) => {
    const updated = [...timeSlots];
    updated.splice(index, 1);
    setTimeSlots(updated);
  };

  const handleDateUpdate = (e) => {
    e.preventDefault();
    if (!selectedDoctor || !newDate) {
      setModalMessage('Please select a doctor and a valid date.');
      setShowModal(true);
      return;
    }

    const summary = timeSlots.map(
      slot => `${slot.time} (${slot.available ? 'Available' : 'Not Available'})`
    ).join(', ');

    setModalMessage(`Date updated for ${selectedDoctor.name} to ${newDate}. Times: ${summary}`);
    setShowModal(true);
  };

  return (
    <div className="space-y-6 relative">
      <h2 className="text-xl font-semibold">Update Doctor Available Date & Time</h2>

      <div className="flex gap-2 items-center">
        <select value={searchType} onChange={(e) => setSearchType(e.target.value)} className="border p-2">
          <option value="id">Search by ID</option>
          <option value="name">Search by Name</option>
        </select>
        <input
          type="text"
          placeholder={`Enter Doctor ${searchType === 'id' ? 'ID' : 'Name'}`}
          className="border p-2"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded">
          Search
        </button>
      </div>

      {!selectedDoctor && doctorResults.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Select Doctor:</h3>
          <ul className="space-y-2">
            {doctorResults.map(doc => (
              <li key={`${doc.doctorId}-${doc.name}`} className="flex items-center justify-between border p-2 rounded">
                <span>{doc.name} ({doc.specialist}) – ID: {doc.doctorId}</span>
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded"
                  onClick={() => setSelectedDoctor(doc)}
                >
                  Select
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedDoctor && (
        <form onSubmit={handleDateUpdate} className="space-y-4">
          <div className="border p-4 rounded bg-gray-100">
            <p><strong>Name:</strong> {selectedDoctor.name}</p>
            <p><strong>ID:</strong> {selectedDoctor.doctorId}</p>
            <p><strong>Specialist:</strong> {selectedDoctor.specialist}</p>
          </div>

          <input
            type="date"
            className="border p-2 w-full"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            required
          />

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Time Slots</h3>
            {timeSlots.map((slot, index) => (
              <div key={index} className="flex items-center gap-2">
                <select
                  value={slot.time}
                  onChange={(e) => handleTimeChange(index, 'time', e.target.value)}
                  className="border p-2"
                  required
                >
                  <option value="">Select Time</option>
                  {defaultTimes.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <select
                  value={slot.available ? 'yes' : 'no'}
                  onChange={(e) => handleTimeChange(index, 'available', e.target.value === 'yes')}
                  className="border p-2"
                >
                  <option value="yes">Available</option>
                  <option value="no">Not Available</option>
                </select>
                <button type="button" onClick={() => handleRemoveTime(index)} className="text-red-600 font-bold">
                  ✕
                </button>
              </div>
            ))}
            <button type="button" onClick={handleAddTimeSlot} className="bg-gray-300 px-3 py-1 rounded">
              + Add Time
            </button>
          </div>

          <button  className="bg-yellow-500 text-white px-4 py-2 rounded">
            Update Date & Time
          </button>
        </form>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-white/30 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96 text-center">
            <h3 className="text-lg font-semibold mb-4">{modalMessage}</h3>
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

export default UpdateDoctorDateForm;
