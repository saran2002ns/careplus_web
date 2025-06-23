import React, { useState } from 'react';

function UpdateAppointment() {
  const [appointmentId, setAppointmentId] = useState('');
  const [appointmentData, setAppointmentData] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const mockAppointments = [
    {
      id: '101',
      date: '2025-06-25',
      time: '09:00',
      patient: {
        id: 1,
        name: 'Ram',
        number: '1234567890',
        age: 30,
        gender: 'Male',
        address: 'City A',
      },
      doctor: {
        doctorId: 1,
        name: 'Dr. Ravi',
        number: '8888888888',
        age: 45,
        gender: 'Male',
        specialist: 'Cardiologist',
        availableDates: [
          { date: '2025-06-25', timeSlots: ['09:00', '11:00'] },
          { date: '2025-06-26', timeSlots: ['14:00', '16:00'] },
        ],
      },
    },
  ];

  const handleSearch = () => {
    const found = mockAppointments.find((a) => a.id === appointmentId);
    if (found) {
      setAppointmentData(found);
      setSelectedDate(found.date);
      setSelectedTime(found.time);
    } else {
      setAppointmentData(null);
      alert('Appointment not found');
    }
  };

  const handleUpdate = () => {
    setShowConfirm(false);
    setShowSuccess(true);
  };

  const resetForm = () => {
    setAppointmentId('');
    setAppointmentData(null);
    setSelectedDate('');
    setSelectedTime('');
    setShowSuccess(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Update Appointment</h2>

      {/* Search by ID */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter Appointment ID"
          className="border p-2"
          value={appointmentId}
          onChange={(e) => setAppointmentId(e.target.value)}
        />
        <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded">
          Search
        </button>
      </div>

      {/* Show Appointment Details */}
      {appointmentData && (
        <div className="space-y-4 border p-4 rounded">
          <h3 className="text-lg font-bold text-center">Appointment Info</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-1">Patient Details</h4>
              <p><strong>Name:</strong> {appointmentData.patient.name}</p>
              <p><strong>Phone:</strong> {appointmentData.patient.number}</p>
              <p><strong>Gender:</strong> {appointmentData.patient.gender}</p>
              <p><strong>Address:</strong> {appointmentData.patient.address}</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Doctor Details</h4>
              <p><strong>Name:</strong> {appointmentData.doctor.name}</p>
              <p><strong>Specialist:</strong> {appointmentData.doctor.specialist}</p>
              <p><strong>Phone:</strong> {appointmentData.doctor.number}</p>
              <p><strong>Gender:</strong> {appointmentData.doctor.gender}</p>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-medium">Change Date and Time</h4>
            <select
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedTime('');
              }}
              className="border p-2 mt-2 w-full"
            >
              <option value="">Select Date</option>
              {appointmentData.doctor.availableDates.map((d, idx) => (
                <option key={idx} value={d.date}>{d.date}</option>
              ))}
            </select>

            {selectedDate && (
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="border p-2 mt-2 w-full"
              >
                <option value="">Select Time</option>
                {appointmentData.doctor.availableDates
                  .find((d) => d.date === selectedDate)
                  ?.timeSlots.map((t, idx) => (
                    <option key={idx} value={t}>{t}</option>
                  ))}
              </select>
            )}
          </div>

          <button
            onClick={() => setShowConfirm(true)}
            className="bg-yellow-500 text-white px-6 py-2 rounded mt-4"
          >
            Update Appointment
          </button>
        </div>
      )}

      {/* Confirm Overlay */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 text-center">
            <h3 className="text-lg font-semibold mb-4">Confirm Update?</h3>
            <p>New Date: <strong>{selectedDate}</strong></p>
            <p>New Time: <strong>{selectedTime}</strong></p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={handleUpdate}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 text-center">
            <h3 className="text-lg font-semibold mb-4">Appointment Updated Successfully!</h3>
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

export default UpdateAppointment;
