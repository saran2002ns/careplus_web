import React, { useState } from 'react';

function UpdateDoctorForm() {
  const [searchType, setSearchType] = useState('id');
  const [searchInput, setSearchInput] = useState('');
  const [doctorResults, setDoctorResults] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [updatedDoctor, setUpdatedDoctor] = useState({});
  const [status, setStatus] = useState('');
  const [showOverlay, setShowOverlay] = useState(false);

  const specialists = [
    'Cardiologist',
    'Neurologist',
    'Orthopedist',
    'Dermatologist',
    'Pediatrician',
    'Psychiatrist',
    'Oncologist',
    'ENT Specialist',
    'Ayurvedic Specialist',
    'Gastroenterologist'
  ];

  const mockDoctors = [
    { doctorId: 1, name: 'Dr. Ravi', age: 45, gender: 'Male', number: '9876543210', specialistId: 1, specialist: 'Cardiologist' },
    { doctorId: 2, name: 'Dr. Meena', age: 38, gender: 'Female', number: '9123456780', specialistId: 4, specialist: 'Dermatologist' },
    { doctorId: 3, name: 'Dr. Karthik', age: 40, gender: 'Male', number: '9000000000', specialistId: 2, specialist: 'Neurologist' }
  ];

  const handleSearch = () => {
    let results = [];
    if (searchType === 'id') {
      results = mockDoctors.filter(doc => doc.doctorId.toString() === searchInput);
    } else {
      results = mockDoctors.filter(doc =>
        doc.name.toLowerCase().includes(searchInput.toLowerCase())
      );
    }
    setDoctorResults(results);
    setSelectedDoctor(null);
    setStatus('');
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
      specialistId: specialistIndex + 1
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setStatus(`Doctor ${updatedDoctor.name} updated successfully!`);
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

export default UpdateDoctorForm;
