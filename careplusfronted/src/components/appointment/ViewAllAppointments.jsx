import React, { useState, useEffect } from 'react';

function ViewAllAppointments() {
  const [appointments, setAppointments] = useState([]);

  
  const mockAppointments = [
    {
      id: 101,
      date: '2025-06-25',
      time: '09:00',
      patient: {
        id: 1,
        name: 'Ram',
        number: '1234567890',
        gender: 'Male',
        age: 30,
        address: 'Chennai'
      },
      doctor: {
        doctorId: 11,
        name: 'Dr. Ravi',
        number: '9876543210',
        age: 45,
        gender: 'Male',
        specialist: 'Cardiologist'
      }
    },
    {
      id: 102,
      date: '2025-06-26',
      time: '14:00',
      patient: {
        id: 2,
        name: 'Priya',
        number: '9999988888',
        gender: 'Female',
        age: 28,
        address: 'Madurai'
      },
      doctor: {
        doctorId: 12,
        name: 'Dr. Meena',
        number: '8765432109',
        age: 38,
        gender: 'Female',
        specialist: 'Dermatologist'
      }
    }
  ];

  useEffect(() => {
    
    setAppointments(mockAppointments);
   
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">All Appointments</h2>

      {appointments.length === 0 ? (
        <p>No appointments available.</p>
      ) : (
        <div className="grid gap-4">
          {appointments.map((appt) => (
            <div key={appt.id} className="border rounded-lg p-4 shadow">
              <h3 className="text-lg font-semibold mb-2">Appointment ID: {appt.id}</h3>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-1">Patient Info</h4>
                  <p><strong>Name:</strong> {appt.patient.name}</p>
                  <p><strong>Phone:</strong> {appt.patient.number}</p>
                  <p><strong>Gender:</strong> {appt.patient.gender}</p>
                  <p><strong>Age:</strong> {appt.patient.age}</p>
                  <p><strong>Address:</strong> {appt.patient.address}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Doctor Info</h4>
                  <p><strong>Name:</strong> {appt.doctor.name}</p>
                  <p><strong>Phone:</strong> {appt.doctor.number}</p>
                  <p><strong>Specialist:</strong> {appt.doctor.specialist}</p>
                  <p><strong>Gender:</strong> {appt.doctor.gender}</p>
                  <p><strong>Age:</strong> {appt.doctor.age}</p>
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

export default ViewAllAppointments;
