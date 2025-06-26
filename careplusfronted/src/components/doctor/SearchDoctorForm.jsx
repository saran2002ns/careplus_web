import React, { useState } from 'react';

export default function SearchDoctorForm() {
  const [searchType, setSearchType] = useState('id');
  const [searchInput, setSearchInput] = useState('');
  const [results, setResults] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [status, setStatus] = useState('');

  const handleSearch = async () => {
    try {
      let res, raw;
      if (searchType === 'id') {
        res = await fetch(`http://localhost:8080/api/doctors/${searchInput.trim()}`);
        if (!res.ok) throw new Error('Doctor not found');
        raw = await res.json();
        setResults([{ doctor: raw.doctor, availableDates: raw.availableDates }]);
      } else {
        res = await fetch(`http://localhost:8080/api/doctors/search?name=${searchInput.trim()}`);
        if (!res.ok) throw new Error('No doctors found');
        const doctors = await res.json();
        setResults(
          doctors.map(item => ({
            doctor: item.doctor,
            availableDates: item.availableDates
          }))
        );
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
      {/* <h2 className="text-xl font-semibold text-gray-800">Search Doctor</h2> */}

      {/* Search bar */}
      <div className="flex gap-2">
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
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          placeholder={`Enter ${searchType === 'id' ? 'Doctor ID' : 'Doctor Name'}`}
          className="border border-gray-300 px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <button
          onClick={handleSearch}
          className="px-4 py-2 rounded border border-blue-600 text-blue-700 font-semibold hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        >
          Search
        </button>
      </div>

      {/* Status Message */}
      {status && <p className="text-red-500">{status}</p>}

      {/* Results */}
      {results.length > 0 && (
        <ul className="space-y-4 w-full h-[350px] overflow-y-auto mt-4 pr-2">
          {results.map((item, idx) => (
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
                onClick={() => setSelectedDoctor(item)}
                className="px-4 py-2 rounded border border-green-600 text-green-700 font-semibold hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              >
                View
              </button>
            </li>
          ))}
        </ul>
      )}


      {/* Overlay Doctor Detail */}
      {selectedDoctor && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[420px] max-h-[80vh] overflow-y-auto text-center">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Doctor Details</h3>
            <div className="text-left text-sm space-y-2 text-gray-700">
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
                <ul className="list-disc list-inside text-sm space-y-1 text-gray-600">
                  {selectedDoctor.availableDates.map((d, i) => (
                    <li key={i}>
                      <strong>{d.date}:</strong>{' '}
                      {d.timeSlots
                        .filter(ts => ts.available)
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
              className="mt-6 px-4 py-2 rounded border border-blue-600 text-blue-700 font-semibold hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
