import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ViewAllAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/appointments');
        setAppointments(res.data);
      } catch (err) {
        console.error('Failed to fetch appointments:', err);
        setError('Unable to load appointments.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleDelete = (appointment) => {
    setAppointmentToDelete(appointment);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/appointments/${appointmentToDelete.id}`);
      setAppointments(prev => prev.filter(appt => appt.id !== appointmentToDelete.id));
      setShowConfirm(false);
      setAppointmentToDelete(null);
      setShowSuccess(true);
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Could not delete appointment.');
      setShowConfirm(false);
    }
  };

  const handleUpdate = (id) => {
    window.location.href = `/appointments/${id}/edit`;
  };

  if (loading) return <p>Loading appointments…</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold">All Appointments</h2>

      {appointments.length === 0 ? (
        <p>No appointments available.</p>
      ) : (
        <div className="grid gap-4">
          {appointments.map((appt) => (
            <div key={appt.id} className="border border-orange-400 rounded-lg p-4 shadow bg-white">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Appointment #{appt.id}</h3>
                <div className="space-x-2">
                  <button
                    onClick={() => handleDelete(appt)}
                    className="px-4 py-1 rounded border border-red-600 text-red-700 font-semibold hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-1">Patient Info</h4>
                  <p><strong>Name:</strong> {appt.patient?.name}</p>
                  <p><strong>Phone:</strong> {appt.patient?.number}</p>
                  <p><strong>Gender:</strong> {appt.patient?.gender}</p>
                  <p><strong>Age:</strong> {appt.patient?.age}</p>
                  <p><strong>Address:</strong> {appt.patient?.address}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Doctor Info</h4>
                  <p><strong>Name:</strong> {appt.docter?.doctor?.name}</p>
                  <p><strong>Phone:</strong> {appt.docter?.doctor?.number}</p>
                  <p><strong>Gender:</strong> {appt.docter?.doctor?.gender}</p>
                  <p><strong>Age:</strong> {appt.docter?.doctor?.age}</p>
                  <p><strong>Specialist:</strong> {appt.docter?.doctor?.specialist}</p>
                </div>
              </div>

              <div className="mt-3 text-sm">
                <p><strong>Date:</strong> {appt.date}</p>
                <p><strong>Time:</strong> {appt.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Overlay */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 text-center border border-orange-400">
            <h3 className="text-lg font-semibold mb-4 text-orange-700">Confirm Delete?</h3>
            <p>Are you sure you want to delete <strong>Appointment #{appointmentToDelete?.id}</strong>?</p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded border border-red-600 text-red-700 font-semibold hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
              >
                Delete
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded border border-gray-400 text-gray-700 font-semibold hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
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
          <div className="bg-white p-6 rounded shadow-lg w-96 text-center border border-green-500">
            <h3 className="text-lg font-semibold mb-4 text-green-700">Appointment Deleted Successfully!</h3>
            <button
              onClick={() => setShowSuccess(false)}
              className="px-4 py-2 rounded border border-blue-600 text-blue-700 font-semibold hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
