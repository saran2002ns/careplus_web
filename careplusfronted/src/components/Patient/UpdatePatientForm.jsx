import React, { useState } from 'react';
import axios from 'axios';
import { timeOptions } from '../../services/db';

function UpdatePatientForm() {
  const [searchType, setSearchType] = useState('id');
  const [searchInput, setSearchInput] = useState('');
  const [patientResults, setPatientResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState('');

  const [updatedPatient, setUpdatedPatient] = useState({
    name: '',
    number: '',
    age: '',
    gender: '',
    address: '',
    date: '',
    time: ''
  });

  const handleSearch = async () => {
    setPatientResults([]);
    setSelectedPatient(null);
    setStatus('');
    try {
      if (searchType === 'id') {
        const res = await axios.get(`http://localhost:8080/api/patients/${searchInput}`);
        setPatientResults([res.data]);
      } else {
        const res = await axios.get(`http://localhost:8080/api/patients/search?name=${searchInput}`);
        setPatientResults(res.data);
      }
    } catch (err) {
      setStatus('No patient found.');
      setShowModal(true);
    }
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setUpdatedPatient({ ...patient });
  };

  const handleChange = (e) => {
    setUpdatedPatient({ ...updatedPatient, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:8080/api/patients/${selectedPatient.id}`,
        updatedPatient
      );
      setStatus(res.data);
    } catch (err) {
      setStatus(err.response?.data || 'Failed to update patient.');
    } finally {
      setShowModal(true);
      setTimeout(() => {
        setSelectedPatient(null);
        setPatientResults([]);
        setSearchInput('');
      }, 1000);
    }
  };

  return (
    <div className="space-y-6">
      {/* <h2 className="text-xl font-semibold mb-2">Update Patient</h2> */}

      {!selectedPatient ? (
        <>
          <div className="flex flex-wrap gap-2">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500"
            >
              <option value="id">Search by ID</option>
              <option value="name">Search by Name</option>
            </select>
            <input
              type="text"
              placeholder={`Enter ${searchType === 'id' ? 'ID' : 'Name'}`}
              className="border p-2 rounded flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500"
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

          {patientResults.length > 0 && (
          <ul className="space-y-4 w-full h-[450px] overflow-y-auto mt-4 pr-2">
            {patientResults.map((p) => (
              <li
                key={p.id}
                className="flex justify-between items-center bg-gray-50 border border-gray-300 shadow-sm rounded-xl px-6 py-4"
              >
                <div>
                  <p className="font-semibold text-lg text-gray-800">{p.name}</p>
                  <p className="text-sm text-gray-600">
                    ID: {p.id} | Gender: {p.gender} | Age: {p.age}
                  </p>
                  <p className="text-sm text-gray-600">Phone: {p.number}</p>
                </div>
                <button
                  onClick={() => handleSelectPatient(p)}
                  className="px-4 py-2 rounded border border-yellow-600 text-yellow-700 font-semibold hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                >
                  Select
                </button>
              </li>
            ))}
          </ul>
           )}

        </>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-2 font-medium mb-2">
            Updating: <strong>{selectedPatient.name}</strong>
          </div>

          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            className="border p-2 rounded"
            value={updatedPatient.name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="number"
            placeholder="Enter Phone Number"
            className="border p-2 rounded"
            value={updatedPatient.number}
            onChange={handleChange}
          />
          <input
            type="number"
            name="age"
            placeholder="Enter Age"
            className="border p-2 rounded"
            value={updatedPatient.age}
            onChange={handleChange}
          />
          <input
            type="text"
            name="gender"
            placeholder="Enter Gender"
            className="border p-2 rounded"
            value={updatedPatient.gender}
            onChange={handleChange}
          />
          <input
            type="text"
            name="address"
            placeholder="Enter Address"
            className="border p-2 rounded"
            value={updatedPatient.address}
            onChange={handleChange}
          />
          <input
            type="date"
            name="date"
            className="border p-2 rounded"
            value={updatedPatient.date}
            onChange={handleChange}
          />
          <input
            type="text"
            name="time"
            placeholder="Enter Time"
            className="border p-2 rounded"
            value={updatedPatient.time}
            onChange={handleChange}
          />

          <div className="col-span-2 flex justify-center">
            <button
            
              className="px-4 py-2 rounded border border-yellow-600 text-yellow-700 font-semibold hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            >
              Submit Update
            </button>
          </div>

        </form>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/40 z-50">
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

export default UpdatePatientForm;
