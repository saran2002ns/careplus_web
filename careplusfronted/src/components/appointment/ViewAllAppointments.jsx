import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ViewAllAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this appointment?')) return;
    try {
      await axios.delete(`http://localhost:8080/api/appointments/${id}`);
      setAppointments(prev => prev.filter(appt => appt.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Could not delete appointment.');
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
            <div key={appt.id} className="border rounded-lg p-4 shadow bg-white">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Appointment #{appt.id}</h3>
                <div className="space-x-2">
                  {/* <button
                    onClick={() => handleUpdate(appt.id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Update
                  </button> */}
                  <button
                    onClick={() => handleDelete(appt.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
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
    </div>
  );
}
