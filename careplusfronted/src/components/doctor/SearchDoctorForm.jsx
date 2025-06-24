import React, { useState } from 'react';

export default function SearchDoctorForm() {
  const [searchType, setSearchType] = useState('id');
  const [searchInput, setSearchInput] = useState('');
  const [results, setResults] = useState([]);       
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [status, setStatus] = useState('');

  const handleSearch = async () => {
    try {
      let raw;
      if (searchType === 'id') {
        
        const res = await fetch(`http://localhost:8080/api/doctors/${searchInput.trim()}`);
        if (!res.ok) throw new Error('Doctor not found');
        raw = await res.json();
        setResults([{ doctor: raw.doctor, availableDates: raw.availableDates }]);
      } else {
        
        const res = await fetch(`http://localhost:8080/api/doctors/search?name=${searchInput.trim()}`);
        if (!res.ok) throw new Error('No doctors found');
        const doctors = await res.json(); 
        setResults(doctors.map(item => ({
          doctor: item.doctor,
          availableDates: item.availableDates
        })));
      }

      setSelectedDoctor(null);
      setStatus('');
    } catch (err) {
      console.error(err);
      setResults([]);
      setSelectedDoctor(null);
      setStatus(err.message);
    }
  };

  return (
    <div className="space-y-6 relative">
      <h2 className="text-xl font-semibold">Search Doctor</h2>

      <div className="flex items-center gap-2">
        <select
          value={searchType}
          onChange={e => setSearchType(e.target.value)}
          className="border px-3 py-2"
        >
          <option value="id">By ID</option>
          <option value="name">By Name</option>
        </select>

        <input
          type="text"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          placeholder={`Enter ${searchType === 'id' ? 'Doctor ID' : 'Doctor Name'}`}
          className="border p-2 flex-1"
        />

        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {status && <p className="text-red-500">{status}</p>}

      {results.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium">Matching Doctors:</h3>
          {results.map((item, idx) => (
            <div
              key={idx}
              className="p-4 border rounded flex justify-between items-center"
            >
              <span>
                {item.doctor.name} (ID: {item.doctor.doctorId}) — {item.doctor.specialist}
              </span>
              <button
                onClick={() => setSelectedDoctor(item)}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                View
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedDoctor && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[420px] max-h-[80vh] overflow-y-auto text-center">
            <h3 className="text-lg font-semibold mb-4">Doctor Details</h3>
            <div className="text-left text-sm space-y-2">
              <p><strong>ID:</strong> {selectedDoctor.doctor.doctorId}</p>
              <p><strong>Name:</strong> {selectedDoctor.doctor.name}</p>
              <p><strong>Age:</strong> {selectedDoctor.doctor.age}</p>
              <p><strong>Gender:</strong> {selectedDoctor.doctor.gender}</p>
              <p><strong>Phone:</strong> {selectedDoctor.doctor.number}</p>
              <p><strong>Specialist:</strong> {selectedDoctor.doctor.specialist}</p>
            </div>

            <div className="mt-4 text-left">
              <h4 className="font-semibold mb-1">Availability</h4>
              {selectedDoctor.availableDates.length > 0 ? (
                <ul className="list-disc list-inside text-sm space-y-1">
                  {selectedDoctor.availableDates.map((d, i) => (
                    <li key={i}>
                      <strong>{d.date}:</strong>{' '}
                      {d.timeSlots.filter(ts => ts.available)
                                     .map(ts => ts.time)
                                     .join(', ') || 'No slots'}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No available dates.</p>
              )}
            </div>

            <button
              onClick={() => setSelectedDoctor(null)}
              className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
