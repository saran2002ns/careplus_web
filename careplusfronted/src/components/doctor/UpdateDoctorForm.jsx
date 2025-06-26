import React, { useState } from 'react';
import { specialists } from '../../services/db';

export default function UpdateDoctorForm() {
  const [searchType, setSearchType] = useState('id');
  const [searchInput, setSearchInput] = useState('');
  const [doctorResults, setDoctorResults] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [updatedDoctor, setUpdatedDoctor] = useState({});
  const [status, setStatus] = useState('');
  const [showOverlay, setShowOverlay] = useState(false);

  const handleSearch = async () => {
    try {
      let response;
      if (searchType === 'id') {
        response = await fetch(`http://localhost:8080/api/doctors/${searchInput.trim()}`);
        if (!response.ok) throw new Error("Doctor not found");
        const data = await response.json();
        const flatDoctor = {
          doctorId: data.doctorDTO.doctorId,
          name: data.doctorDTO.name,
          age: data.doctorDTO.age,
          gender: data.doctorDTO.gender,
          number: data.doctorDTO.number,
          specialist: data.doctorDTO.specialist,
          specialistId: data.doctorDTO.specialistId,
        };
        setDoctorResults([flatDoctor]);
      } else {
        response = await fetch(`http://localhost:8080/api/doctors/search?name=${searchInput.trim()}`);
        if (!response.ok) throw new Error("No matching doctors found");
        const data = await response.json();
        const flattened = data.map(d => ({
          doctorId: d.doctor?.doctorId || d.doctorId,
          name: d.doctor?.name || d.name,
          age: d.doctor?.age || d.age,
          gender: d.doctor?.gender || d.gender,
          number: d.doctor?.number || d.number,
          specialist: d.doctor?.specialist || d.specialist,
          specialistId: d.doctor?.specialistId || d.specialistId,
        }));
        setDoctorResults(flattened);
      }

      setSelectedDoctor(null);
      setStatus('');
    } catch (err) {
      console.error("Search error:", err);
      setStatus("Failed to find doctor.");
      setDoctorResults([]);
    }
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setUpdatedDoctor({ ...doctor });
  };

  const handleInputChange = (e) => {
    setUpdatedDoctor({ ...updatedDoctor, [e.target.name]: e.target.value });
  };

  const handleSpecialistChange = (e) => {
    const selectedSpecialist = e.target.value;
    const specialistIndex = specialists.indexOf(selectedSpecialist);
    setUpdatedDoctor({
      ...updatedDoctor,
      specialist: selectedSpecialist,
      specialistId: specialistIndex + 1,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/api/doctors/${updatedDoctor.doctorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDoctor),
      });

      const result = await response.text();

      if (response.ok) {
        setStatus(`Doctor ${updatedDoctor.name} updated successfully!`);
      } else {
        setStatus(`Update failed: ${result}`);
      }
    } catch (err) {
      console.error("Update error:", err);
      setStatus("Server error occurred while updating doctor.");
    }

    setShowOverlay(true);
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false);
    setSelectedDoctor(null);
    setDoctorResults([]);
    setSearchInput('');
  };

  return (
    <div className="space-y-6">
      {!selectedDoctor ? (
        <>
          <div className="flex gap-2">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="id">Search by ID</option>
              <option value="name">Search by Name</option>
            </select>
            <input
              type="text"
              placeholder={`Enter ${searchType === 'id' ? 'ID' : 'Name'}`}
              className="border border-gray-300 px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 rounded border border-blue-600 text-blue-700 font-semibold hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              Search
            </button>
          </div>

          {status && <p className="text-red-600">{status}</p>}

        {doctorResults.length > 0 && (
          <ul className="space-y-4 w-full h-[350px] overflow-y-auto mt-4 pr-2">
            {doctorResults.map(doc => (
              <li
                key={doc.doctorId}
                className="flex justify-between items-center bg-gray-50 border border-gray-300 shadow-sm rounded-xl px-6 py-4"
              >
                <div>
                  <p className="font-semibold text-lg text-gray-800">{doc.name}</p>
                  <p className="text-sm text-gray-600">
                    ID: {doc.doctorId} | Specialist: {doc.specialist}
                  </p>
                </div>
                <button
                  onClick={() => handleDoctorSelect(doc)}
                  className="px-4 py-2 rounded border border-green-600 text-green-700 font-semibold hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                >
                  Select
                </button>
              </li>
            ))}
          </ul>
        )}

        </>
      ) : (
        <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-4">
          <div className="col-span-2 font-medium text-gray-700">
            Updating: <strong>{selectedDoctor.name}</strong>
          </div>

          <input
            type="text"
            name="name"
            placeholder="Name"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={updatedDoctor.name}
            onChange={handleInputChange}
            required
          />

          <input
            type="number"
            name="age"
            placeholder="Age"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={updatedDoctor.age}
            onChange={handleInputChange}
            required
          />

          <input
            type="text"
            name="gender"
            placeholder="Gender"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={updatedDoctor.gender}
            onChange={handleInputChange}
            required
          />

          <input
            type="text"
            name="number"
            placeholder="Phone Number"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={updatedDoctor.number}
            onChange={handleInputChange}
            required
          />

          <select
            name="specialist"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={updatedDoctor.specialist}
            onChange={handleSpecialistChange}
            required
          >
            <option value="">Select Specialist</option>
            {specialists.map((s, idx) => (
              <option key={idx} value={s}>{s}</option>
            ))}
          </select>

          <div className="col-span-2 flex justify-center">
            <button
              className="px-4 py-2 rounded border border-yellow-600 text-yellow-700 font-semibold hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            >
              Submit Update
            </button>
          </div>
        </form>
      )}

      {showOverlay && (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-white/40 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 text-center">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">{status}</h3>
            <button
              onClick={handleCloseOverlay}
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
