import React, { useState } from 'react';

function AddReceptionistForm() {
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    password: '',
    confirmPassword: '',
  });

  const [status, setStatus] = useState('');
  const [showOverlay, setShowOverlay] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("❗ Passwords do not match.");
      return;
    }

    // Simulate API call success
    setStatus(`Receptionist ${formData.name} added successfully!`);
    setShowOverlay(true);

    // Optionally reset form
    setFormData({
      name: '',
      number: '',
      password: '',
      confirmPassword: '',
    });
  };

  return (
    <div className="relative space-y-6">
      <h2 className="text-xl font-semibold mb-4">Add Receptionist</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="border p-2"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="number"
          placeholder="Phone Number"
          className="border p-2"
          value={formData.number}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border p-2"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          className="border p-2"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        {/* ❌ Password mismatch warning */}
        {error && (
          <div className="col-span-2 text-red-600 text-sm">{error}</div>
        )}

        <div className="col-span-2">
          <button
            
            className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
          >
            Add Receptionist
          </button>
        </div>
      </form>

      {/* ✅ Confirmation Overlay */}
      {showOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/40">
          <div className="bg-white p-6 rounded shadow-lg w-96 text-center">
            <h3 className="text-lg font-semibold mb-4">{status}</h3>
            <button
              onClick={() => setShowOverlay(false)}
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

export default AddReceptionistForm;
