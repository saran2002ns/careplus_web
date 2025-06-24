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
      <h2 className="text-xl font-semibold">Update Doctor</h2>

      {!selectedDoctor ? (
        <>
          <div className="flex gap-2">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="border p-2"
            >
              <option value="id">Search by ID</option>
              <option value="name">Search by Name</option>
            </select>
            <input
              type="text"
              placeholder={`Enter ${searchType === 'id' ? 'ID' : 'Name'}`}
              className="border p-2"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded">
              Search
            </button>
          </div>

          {status && <p className="text-red-600">{status}</p>}

          {doctorResults.length > 0 && (
            <ul className="space-y-2 max-h-40 overflow-auto">
              {doctorResults.map(doc => (
                <li key={doc.doctorId} className="flex justify-between items-center border p-2 rounded">
                  <span>{doc.name} (ID: {doc.doctorId}, {doc.specialist})</span>
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded"
                    onClick={() => handleDoctorSelect(doc)}
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
          <div className="col-span-2 font-medium">
            Updating: <strong>{selectedDoctor.name}</strong>
          </div>
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="border p-2"
            value={updatedDoctor.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            className="border p-2"
            value={updatedDoctor.age}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="gender"
            placeholder="Gender"
            className="border p-2"
            value={updatedDoctor.gender}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="number"
            placeholder="Phone Number"
            className="border p-2"
            value={updatedDoctor.number}
            onChange={handleInputChange}
            required
          />
          <select
            name="specialist"
            className="border p-2"
            value={updatedDoctor.specialist}
            onChange={handleSpecialistChange}
            required
          >
            <option value="">Select Specialist</option>
            {specialists.map((s, idx) => (
              <option key={idx} value={s}>{s}</option>
            ))}
          </select>
          <input
            type="number"
            name="specialistId"
            className="border p-2 bg-gray-100"
            value={updatedDoctor.specialistId}
            readOnly
          />
          <div className="col-span-2">
            <button className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded">
              Submit Update
            </button>
          </div>
        </form>
      )}

      {showOverlay && (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-white/40 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 text-center">
            <h3 className="text-lg font-semibold mb-4">{status}</h3>
            <button
              onClick={handleCloseOverlay}
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
