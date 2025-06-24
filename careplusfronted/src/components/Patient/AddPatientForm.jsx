import React, { useState } from 'react';
import axios from 'axios';
import { timeOptions } from '../../services/db';

export default function AddPatientForm() {
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    age: '',
    gender: '',
    addressLine: '',
    district: '',
    state: '',
    date: '',
    time: '',
    allocated: false,
  });

  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

   
    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(formData.number)) {
      setStatus('Phone number must be exactly 10 digits.');
      setShowModal(true);
      return;
    }

    const fullNumber = `${formData.number}`;
    const fullAddress = `${formData.addressLine}, ${formData.district}, ${formData.state}`;

    const patientData = {
      name: formData.name,
      number: fullNumber,
      age: formData.age,
      gender: formData.gender,
      address: fullAddress,
      date: formData.date,
      time: formData.time,
      allocated: formData.allocated,
    };

    try {
      const response = await axios.post('http://localhost:8080/api/patients', patientData);
      setStatus(response.data);
      setShowModal(true);

      setFormData({
        name: '',
        number: '',
        age: '',
        gender: '',
        addressLine: '',
        district: '',
        state: '',
        date: '',
        time: '',
        allocated: false,
      });
    } catch (error) {
      setStatus(error.response?.data || 'Unable to add patient.');
      setShowModal(true);
    }
  };

  return (
    <div className="relative">
      <h2 className="text-xl font-semibold mb-4">Add New Patient</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <input type="text" name="name" placeholder="Name" className="input border p-2" required value={formData.name} onChange={handleChange} />

        <div className="flex">
          <span className="bg-gray-200 border border-r-0 p-2 rounded-l">+91</span>
          <input
            type="text"
            name="number"
            placeholder="10-digit Phone Number"
            className="input border p-2 w-full rounded-r"
            required
            value={formData.number}
            onChange={handleChange}
            maxLength={10}
          />
        </div>

        <input type="number" name="age" placeholder="Age" className="input border p-2" required value={formData.age} onChange={handleChange} />
        <input type="text" name="gender" placeholder="Gender" className="input border p-2" required value={formData.gender} onChange={handleChange} />

        <input type="text" name="addressLine" placeholder="Address Line" className="input border p-2" required value={formData.addressLine} onChange={handleChange} />
        <input type="text" name="district" placeholder="District" className="input border p-2" required value={formData.district} onChange={handleChange} />
        <input type="text" name="state" placeholder="State" className="input border p-2" required value={formData.state} onChange={handleChange} />

        <input type="date" name="date" className="input border p-2" required value={formData.date} onChange={handleChange} />

        <select name="time" className="input border p-2" required value={formData.time} onChange={handleChange}>
          <option value="">Select Time</option>
          {timeOptions.map((time, index) => (
            <option key={index} value={time}>{time}</option>
          ))}
        </select>

        

        <div className="col-span-2">
          <button  className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
            Submit
          </button>
        </div>
      </form>

      
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/40 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 text-center">
            <h3 className="text-lg font-semibold mb-4">{status}</h3>
            <button onClick={() => setShowModal(false)} className="bg-blue-600 text-white px-4 py-2 rounded">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
