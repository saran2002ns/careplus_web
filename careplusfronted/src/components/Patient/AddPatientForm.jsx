import React, { useState } from 'react';

function AddPatientForm() {
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const timeOptions = [
    '09:00 AM',
    '11:00 AM',
    '02:00 PM',
    '04:00 PM',
    '06:00 PM'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const isSuccess = true;
    setStatus(isSuccess ? 'Patient added successfully!' : 'Unable to add patient.');
    setShowModal(true);
  };

  return (
    <div className="relative">
      <h2 className="text-xl font-semibold mb-4">Add New Patient</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <input type="text" placeholder="Name" className="input border p-2" required />
        <input type="text" placeholder="Phone Number" className="input border p-2" required />
        <input type="number" placeholder="Age" className="input border p-2" required />
        <input type="text" placeholder="Gender" className="input border p-2" required />
        <input type="text" placeholder="Address" className="input border p-2" required />
        <input type="date" className="input border p-2" required />

        {/* ⏰ Time Selection */}
        <select
          className="input border p-2"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          required
        >
          <option value="">Select Time</option>
          {timeOptions.map((time, index) => (
            <option key={index} value={time}>{time}</option>
          ))}
        </select>

        <div className="col-span-2">
          <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
            Submit
          </button>
        </div>
      </form>

      {/* ✅ Overlay Status */}
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

export default AddPatientForm;
