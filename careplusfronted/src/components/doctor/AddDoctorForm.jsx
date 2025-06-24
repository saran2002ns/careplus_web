import React, { useState } from 'react';
import { specialists } from "../../services/db";

function AddDoctorForm() {
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    number: '',
  });
  const [selectedSpecialist, setSelectedSpecialist] = useState('');
  const [specialistId, setSpecialistId] = useState('');

  const handleSpecialistChange = (e) => {
    const selected = e.target.value;
    setSelectedSpecialist(selected);
    const index = specialists.indexOf(selected);
    setSpecialistId(index >= 0 ? index + 1 : '');
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const doctorDTO = {
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender,
      number: formData.number,
      specialistId: parseInt(specialistId),
      specialist: selectedSpecialist
    };

    try {
      const res = await fetch("http://localhost:8080/api/doctors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(doctorDTO)
      });

      const text = await res.text();

      if (res.ok) {
        setStatus(text);
        setFormData({ name: '', age: '', gender: '', number: '' });
        setSelectedSpecialist('');
        setSpecialistId('');
      } else {
        setStatus("Error: " + text);
      }
    } catch (err) {
      setStatus("Failed to connect to server");
    }

    setShowModal(true);
  };

  return (
    <div className="relative">
      <h2 className="text-xl font-semibold mb-4">Add New Doctor</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="border p-2"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          className="border p-2"
          value={formData.age}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="gender"
          placeholder="Gender"
          className="border p-2"
          value={formData.gender}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="number"
          placeholder="Phone Number"
          className="border p-2"
          value={formData.number}
          onChange={handleInputChange}
          required
        />

        <select
          value={selectedSpecialist}
          onChange={handleSpecialistChange}
          className="border p-2"
          required
        >
          <option value="">Select Specialist</option>
          {specialists.map((spec, index) => (
            <option key={index} value={spec}>
              {spec}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={specialistId}
          readOnly
          className="border p-2 bg-gray-100"
          placeholder="Specialist ID"
        />

        <div className="col-span-2">
          <button  className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
            Add Doctor
          </button>
        </div>
      </form>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 text-center">
            <h3 className="text-lg font-semibold mb-4">{status}</h3>
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

export default AddDoctorForm;
