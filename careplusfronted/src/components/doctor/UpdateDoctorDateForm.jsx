import React, { useState } from 'react';
import { addDoctorDate } from "../../services/Api";

export default function UpdateDoctorDateForm() {
  const [searchType, setSearchType] = useState('id');
  const [searchInput, setSearchInput] = useState('');
  const [doctorResults, setDoctorResults] = useState([]);       
  const [selected, setSelected] = useState(null);              
  const [newDate, setNewDate] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const defaultTimes = ["09:00", "11:00", "14:00", "16:00", "19:00"];

  const handleSearch = async () => {
    try {
      let res, data;
      if (searchType === 'id') {
        res = await fetch(`http://localhost:8080/api/doctors/${searchInput.trim()}`);
        if (!res.ok) throw new Error('Doctor not found');
        data = await res.json();
        setDoctorResults([{ doctor: data.doctor, availableDates: data.availableDates }]);
      } else {
        res = await fetch(`http://localhost:8080/api/doctors/search?name=${searchInput.trim()}`);
        if (!res.ok) throw new Error('No doctors found');
        const list = await res.json(); 
        setDoctorResults(list.map(item => ({
          doctor: item.doctor,
          availableDates: item.availableDates
        })));
      }
      setSelected(null);
    } catch (err) {
      console.error(err);
      setDoctorResults([]);
      setSelected(null);
      setModalMessage(err.message);
      setShowModal(true);
    }
  };

  const handleAddTimeSlot = () => {
    setTimeSlots([...timeSlots, { time: '', available: true }]);
  };

  const handleTimeChange = (i, key, val) => {
    const updated = [...timeSlots];
    updated[i][key] = val;
    setTimeSlots(updated);
  };

  const handleRemoveTime = (i) => {
    const updated = [...timeSlots];
    updated.splice(i, 1);
    setTimeSlots(updated);
  };

  const handleDateUpdate = async e => {
    e.preventDefault();
    if (!selected || !newDate) {
      setModalMessage("Select a doctor and a valid date.");
      setShowModal(true);
      return;
    }
    const payload = {
      doctorId: selected.doctor.doctorId,
      date: newDate,
      available: true,
      timeSlots: timeSlots.map(s => ({ time: s.time, available: s.available }))
    };
    try {
      const res = await addDoctorDate(payload);
      const msg = await res.text();
      setModalMessage(msg);
    } catch {
      setModalMessage("Failed to update availability.");
    }
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Update Doctor Availability</h2>

     
      <div className="flex gap-2 items-center">
        <select
          value={searchType}
          onChange={e => setSearchType(e.target.value)}
          className="border p-2"
        >
          <option value="id">By ID</option>
          <option value="name">By Name</option>
        </select>
        <input
          type="text"
          placeholder={`Enter Doctor ${searchType === 'id' ? 'ID' : 'Name'}`}
          className="border p-2 flex-1"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

     
      {!selected && doctorResults.length > 0 && (
        <ul className="space-y-2">
          {doctorResults.map((item, idx) => (
            <li
              key={idx}
              className="flex justify-between items-center border p-3 rounded"
            >
              <div>
                <p><strong>{item.doctor.name}</strong> (ID: {item.doctor.doctorId})</p>
                <p className="text-sm text-gray-600">{item.doctor.specialist}</p>
              </div>
              <button
                onClick={() => setSelected(item)}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Select
              </button>
            </li>
          ))}
        </ul>
      )}

     
      {selected && (
        <form onSubmit={handleDateUpdate} className="space-y-4 border p-4 rounded bg-gray-50">
          <div>
            <p><strong>Name:</strong> {selected.doctor.name}</p>
            <p><strong>ID:</strong> {selected.doctor.doctorId}</p>
            <p><strong>Specialist:</strong> {selected.doctor.specialist}</p>
          </div>

          <input
            type="date"
            className="border p-2 w-full"
            value={newDate}
            onChange={e => setNewDate(e.target.value)}
            required
          />

          <div className="space-y-2">
            <h3 className="font-medium">Time Slots</h3>
            {timeSlots.map((slot, i) => (
              <div key={i} className="flex gap-2 items-center">
                <select
                  value={slot.time}
                  onChange={e => handleTimeChange(i, 'time', e.target.value)}
                  className="border p-2 flex-1"
                  required
                >
                  <option value="">Select Time</option>
                  {defaultTimes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <select
                  value={slot.available ? 'yes' : 'no'}
                  onChange={e => handleTimeChange(i, 'available', e.target.value === 'yes')}
                  className="border p-2"
                >
                  <option value="yes">Available</option>
                  <option value="no">Not Available</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleRemoveTime(i)}
                  className="text-red-600 font-bold"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddTimeSlot}
              className="bg-gray-300 px-3 py-1 rounded"
            >
              + Add Time
            </button>
          </div>

          <div>
            <button className="bg-yellow-500 text-white px-4 py-2 rounded">
              Update Availability
            </button>
          </div>
        </form>
      )}

      
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm">
          <div className="bg-white p-6 rounded shadow-lg w-96 text-center">
            <p className="mb-4">{modalMessage}</p>
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
