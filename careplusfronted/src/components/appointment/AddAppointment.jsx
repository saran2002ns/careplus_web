import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AddAppointment() {
  const [searchTypePatient, setSearchTypePatient] = useState('id');
  const [searchInputPatient, setSearchInputPatient] = useState('');
  const [patientResults, setPatientResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [searchTypeDoctor, setSearchTypeDoctor] = useState('id');
  const [searchInputDoctor, setSearchInputDoctor] = useState('');
  const [doctorResults, setDoctorResults] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const [showConfirmOverlay, setShowConfirmOverlay] = useState(false);
  const [showFinalOverlay, setShowFinalOverlay] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedDoctor && selectedPatient) {
      const match = selectedDoctor.availableDates.find(
        d => d.date === selectedPatient.date &&
             d.timeSlots.some(ts => ts.available && ts.time === selectedPatient.time)
      );
      if (match) {
        setSelectedDate(selectedPatient.date);
        setSelectedTime(selectedPatient.time);
      }
    }
  }, [selectedDoctor, selectedPatient]);

  const searchPatient = async () => {
    try {
      let res;
      if (searchTypePatient === 'id') {
        res = await axios.get(`http://localhost:8080/api/patients/${searchInputPatient}`);
        setPatientResults([res.data]);
      } else {
        res = await axios.get(`http://localhost:8080/api/patients/search?name=${searchInputPatient}`);
        setPatientResults(res.data);
      }
      setSelectedPatient(null);
      setError('');
    } catch {
      setPatientResults([]);
      setSelectedPatient(null);
      setError('Patient not found');
    }
  };

  const searchDoctor = async () => {
    try {
      let res;
      if (searchTypeDoctor === 'id') {
        res = await axios.get(`http://localhost:8080/api/doctors/${searchInputDoctor}`);
        setDoctorResults([{
          doctor: res.data.doctor,
          availableDates: res.data.availableDates
        }]);
      } else {
        res = await axios.get(`http://localhost:8080/api/doctors/search?name=${searchInputDoctor}`);
        setDoctorResults(res.data.map(item => ({
          doctor: item.doctor,
          availableDates: item.availableDates
        })));
      }
      setSelectedDoctor(null);
      setError('');
    } catch {
      setDoctorResults([]);
      setSelectedDoctor(null);
      setError('Doctor not found');
    }
  };

  const handleConfirm = () => {
    if (!selectedPatient || !selectedDoctor || !selectedDate || !selectedTime) {
      setError('Select patient, doctor, date and time.');
      return;
    }
    setShowConfirmOverlay(true);
  };

  const createAppointment = async () => {
    try {
      const payload = {
        patientId: selectedPatient.id,
        docterId: selectedDoctor.doctor.doctorId,
        date: selectedDate,
        time: selectedTime
      };
      await axios.post('http://localhost:8080/api/appointments', payload);
      setShowConfirmOverlay(false);
      setShowFinalOverlay(true);
      setError('');
    } catch {
      setError('Failed to create appointment');
    }
  };

  const resetForm = () => {
    setSelectedDoctor(null);
    setSelectedPatient(null);
    setSearchInputDoctor('');
    setSearchInputPatient('');
    setDoctorResults([]);
    setPatientResults([]);
    setSelectedDate('');
    setSelectedTime('');
    setShowFinalOverlay(false);
    setError('');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Add Appointment</h2>

      {error && <p className="text-red-500">{error}</p>}

      {/* Patient Search */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <select
            value={searchTypePatient}
            onChange={e => setSearchTypePatient(e.target.value)}
            className="border p-2 rounded border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="id">Patient by ID</option>
            <option value="name">Patient by Name</option>
          </select>
          <input
            type="text"
            value={searchInputPatient}
            onChange={e => setSearchInputPatient(e.target.value)}
            className="border p-2 flex-1 rounded border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Enter Patient ID or Name"
          />
          <button
            onClick={searchPatient}
            className="px-4 py-2 rounded border border-blue-600 text-blue-700 font-semibold hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
            Search
          </button>
        </div>

        {!selectedPatient && patientResults.length > 0 && (
          <ul className="space-y-4 w-full h-[300px] overflow-y-auto mt-4 pr-2">
            {patientResults.map(p => (
              <li
                key={p.id}
                className={`flex justify-between items-center border p-4 rounded shadow-sm ${
                  p.allocated ? 'bg-gray-100 opacity-70' : 'bg-orange-50'
                }`}
              >
                <div>
                  <p className="text-gray-800 font-semibold">
                    {p.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    ID: {p.id}, Gender: {p.gender}, Age: {p.age}
                  </p>
                </div>

                {p.allocated ? (
                  <span className="text-sm text-red-600 font-medium">Allocated</span>
                ) : (
                  <button
                    onClick={() => setSelectedPatient(p)}
                    className="px-4 py-2 rounded border border-green-600 text-green-700 font-semibold hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                  >
                    Select
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}

        {selectedPatient && (
          <div className="p-4 border rounded bg-green-50 space-y-1">
            <h4 className="font-semibold">Patient Details</h4>
            <p><strong>Name:</strong> {selectedPatient.name}</p>
            <p><strong>ID:</strong> {selectedPatient.id}</p>
            <p><strong>Preferred Date:</strong> {selectedPatient.date}</p>
            <p><strong>Preferred Time:</strong> {selectedPatient.time}</p>
          </div>
        )}
      </div>

      {/* Doctor Search */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <select
            value={searchTypeDoctor}
            onChange={e => setSearchTypeDoctor(e.target.value)}
            className="border p-2 rounded border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="id">Doctor by ID</option>
            <option value="name">Doctor by Name</option>
          </select>
          <input
            type="text"
            value={searchInputDoctor}
            onChange={e => setSearchInputDoctor(e.target.value)}
            className="border p-2 flex-1 rounded border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Enter Doctor ID or Name"
          />
          <button
            onClick={searchDoctor}
            className="px-4 py-2 rounded border border-blue-600 text-blue-700 font-semibold hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
            Search
          </button>
        </div>

        {!selectedDoctor && doctorResults.length > 0 && (
          <ul className="space-y-4 w-full h-[300px] overflow-y-auto mt-4 pr-2">
            {doctorResults.map(item => {
              const hasAvailableSlots = item.availableDates.some(d =>
                d.timeSlots.some(ts => ts.available)
              );

              return (
                <li
                  key={item.doctor.doctorId}
                  className={`flex justify-between items-center border p-4 rounded shadow-sm ${
                    hasAvailableSlots ? 'bg-orange-50' : 'bg-gray-100 opacity-70'
                  }`}
                >
                  <div>
                    <p className="text-gray-800 font-semibold">
                      {item.doctor.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      ID: {item.doctor.doctorId} | Age:  {item.doctor.age} | Specialist: {item.doctor.specialist}
                    </p>
                  </div>

                  {hasAvailableSlots ? (
                    <button
                      onClick={() => {
                        setSelectedDoctor(item);
                        setSelectedDate('');
                        setSelectedTime('');
                      }}
                      className="px-4 py-2 rounded border border-green-600 text-green-700 font-semibold hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                    >
                      Select
                    </button>
                  ) : (
                    <span className="text-sm text-red-600 font-medium">
                      No time slots available
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {selectedDoctor && (
          <div className="p-4 border rounded bg-blue-50 space-y-2">
            <h4 className="font-semibold">Doctor Details</h4>
            <p><strong>Name:</strong> {selectedDoctor.doctor.name}</p>
            <p><strong>Specialist:</strong> {selectedDoctor.doctor.specialist}</p>
            <div className="mt-2">
              <h5 className="font-medium mb-1">Available Dates & Time:</h5>
              <ul className="text-sm list-disc list-inside">
                {selectedDoctor.availableDates.map((d, i) => (
                  <li key={i}><strong>{d.date}:</strong> {d.timeSlots.filter(ts => ts.available).map(ts => ts.time).join(', ') || 'No slots'}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Match Status */}
      {selectedDoctor && selectedPatient && (
        <div className="mt-4 p-4 rounded bg-yellow-50 text-sm">
          <h4 className="font-semibold mb-1">Match Check:</h4>
          {selectedDoctor.availableDates.some(date => date.date === selectedPatient.date && date.timeSlots.some(ts => ts.available && ts.time === selectedPatient.time)) ? (
            <p className="text-green-600">✅ Doctor is available at the patient's preferred time: <strong>{selectedPatient.date}</strong> @ <strong>{selectedPatient.time}</strong></p>
          ) : (
            <p className="text-red-600">⚠️ Doctor is NOT available at the patient's preferred time. Please choose a different time from available slots.</p>
          )}
        </div>
      )}

      {/* Select Date/Time */}
      {selectedDoctor && (
        <div className="grid grid-cols-2 gap-4">
          <select className="border p-2 border-orange-600 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" value={selectedDate} onChange={e => { setSelectedDate(e.target.value); setSelectedTime(''); }}>
            <option value="">Select Date</option>
            {selectedDoctor.availableDates.map(d => (<option key={d.dateId} value={d.date}>{d.date}</option>))}
          </select>
          <select className="border p-2 border-orange-600 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" value={selectedTime} onChange={e => setSelectedTime(e.target.value)} disabled={!selectedDate}>
            <option value="">Select Time</option>
            {selectedDoctor.availableDates.find(d => d.date === selectedDate)?.timeSlots.filter(ts => ts.available).map((ts, idx) => (<option key={idx} value={ts.time}>{ts.time}</option>))}
          </select>
        </div>
      )}

      {/* Confirm Add Button */}
      {selectedPatient && selectedDoctor && selectedDate && selectedTime && (
        <button
          onClick={handleConfirm}
          className="mt-4 px-4 py-2 rounded border border-green-600 text-green-700 font-semibold hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        >
          Add Appointment
        </button>
      )}

      {/* Confirm Overlay */}
      {showConfirmOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md text-center">
            <h3 className="text-lg font-semibold mb-4">Confirm Appointment</h3>
            <p><strong>Patient:</strong> {selectedPatient.name} (ID: {selectedPatient.id})</p>
            <p><strong>Doctor:</strong> {selectedDoctor.doctor.name} (ID: {selectedDoctor.doctor.doctorId})</p>
            <p><strong>Date:</strong> {selectedDate}</p>
            <p><strong>Time:</strong> {selectedTime}</p>
            <div className="mt-4 flex justify-center gap-4">
              <button
                onClick={createAppointment}
                className="px-4 py-2 rounded border border-green-600 text-green-700 font-semibold hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowConfirmOverlay(false)}
                className="px-4 py-2 rounded border border-gray-400 text-gray-700 font-semibold hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Final Success Overlay */}
      {showFinalOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded shadow-lg w-96 text-center">
            <h3 className="text-lg font-semibold mb-4">Appointment created successfully!</h3>
            <button
              onClick={resetForm}
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