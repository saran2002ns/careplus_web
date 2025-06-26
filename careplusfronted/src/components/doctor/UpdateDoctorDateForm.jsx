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
      <h2 className="text-xl font-semibold text-gray-800">Update Doctor Availability</h2>

      {/* Search Bar */}
      <div className="flex gap-2 items-center">
        <select
          value={searchType}
          onChange={e => setSearchType(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="id">Search by ID</option>
          <option value="name">Search by Name</option>
        </select>
        <input
          type="text"
          placeholder={`Enter Doctor ${searchType === 'id' ? 'ID' : 'Name'}`}
          className="border border-gray-300 px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 rounded border border-blue-600 text-blue-700 font-semibold hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        >
          Search
        </button>
      </div>

      {/* Search Results */}
        {!selected && doctorResults.length > 0 && (
          <ul className="space-y-4 w-full h-[350px] overflow-y-auto mt-4 pr-2">
            {doctorResults.map((item, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center bg-gray-50 border border-gray-300 shadow-sm rounded-xl px-6 py-4"
              >
                <div>
                  <p className="font-semibold text-lg text-gray-800">{item.doctor.name}</p>
                  <p className="text-sm text-gray-600">
                    ID: {item.doctor.doctorId} | Age:  {item.doctor.age} | Specialist: {item.doctor.specialist}
                  </p>
                </div>
                <button
                  onClick={() => setSelected(item)}
                  className="px-4 py-2 rounded border border-green-600 text-green-700 font-semibold hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                >
                  Select
                </button>
              </li>
            ))}
          </ul>
        )}


      {/* Form */}
      {selected && (
        <form onSubmit={handleDateUpdate} className="space-y-4 border p-4 rounded bg-gray-50">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <p><strong>Name:</strong> {selected.doctor.name}</p>
            <p><strong>ID:</strong> {selected.doctor.doctorId}</p>
            <p><strong>Specialist:</strong> {selected.doctor.specialist}</p>
          </div>

          <input
            type="date"
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={newDate}
            onChange={e => setNewDate(e.target.value)}
            required
          />

          <div className="space-y-2">
            <h3 className="font-medium text-gray-700">Time Slots</h3>
            {timeSlots.map((slot, i) => (
              <div key={i} className="grid grid-cols-3 gap-2 items-center">
                <select
                  value={slot.time}
                  onChange={e => handleTimeChange(i, 'time', e.target.value)}
                  className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select Time</option>
                  {defaultTimes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <select
                  value={slot.available ? 'yes' : 'no'}
                  onChange={e => handleTimeChange(i, 'available', e.target.value === 'yes')}
                  className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="yes">Available</option>
                  <option value="no">Not Available</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleRemoveTime(i)}
                  className="px-4 py-2 rounded border border-red-600 text-red-700 font-semibold hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                >
                  Cancel
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddTimeSlot}
              className="px-4 py-2 rounded border border-gray-400 text-gray-700 font-semibold hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
            >
              + Add Time
            </button>
          </div>

          <div className="col-span-2 flex justify-start">
            <button
              className="px-4 py-2 rounded border border-yellow-600 text-yellow-700 font-semibold hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            >
              Submit Update
            </button>
          </div>
        </form>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 text-center">
            <p className="mb-4 text-gray-800">{modalMessage}</p>
            <button
              onClick={() => setShowModal(false)}
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
