// src/components/TenantDashboard.js
import React, { useState } from 'react';
import { db } from '../firebase-config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import '../App.css'; // Ensure styles are applied
import { useLocation } from 'react-router-dom';

const TenantDashboard = () => {
  const { state } = useLocation(); // Retrieve state which contains userID
  const [description, setDescription] = useState('');
  const [apartmentNumber, setApartmentNumber] = useState('');
  const [photo, setPhoto] = useState(null);
  const [area, setArea] = useState('Kitchen'); // Default selection for radio button

  // Ensure that userID is available
  const tenantID = state?.userID; // Safely accessing userID

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let photoURL = false; 
    if (photo) {
      photoURL = true; // Set to true if a photo was uploaded
      setPhoto(null); // Discard the photo as per your requirement
    }

    if (!tenantID) {
      alert("Tenant ID is missing!");
      return;
    }

    const requestsRef = collection(db, 'requests');
    await addDoc(requestsRef, {
      tenantID: tenantID,
      apartmentNumber,
      area,
      description,
      dateTime: serverTimestamp(),
      photoURL,
      status: 'pending',
    });

    alert('Maintenance request submitted!');
    setDescription('');
    setApartmentNumber('');
  };

  return (
    <div className="tenant-dashboard-container">
      <div className="tenant-dashboard">
        <h1>Tenant Dashboard</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Apartment Number"
            value={apartmentNumber}
            onChange={(e) => setApartmentNumber(e.target.value)}
            required
          />
          <div className="radio-buttons-container">
            <label>
              <input
                type="radio"
                value="Kitchen"
                checked={area === 'Kitchen'}
                onChange={(e) => setArea(e.target.value)}
              />
              Kitchen
            </label>
            <label>
              <input
                type="radio"
                value="Bedroom"
                checked={area === 'Bedroom'}
                onChange={(e) => setArea(e.target.value)}
              />
              Bedroom
            </label>
            <label>
              <input
                type="radio"
                value="Living Space"
                checked={area === 'Living Space'}
                onChange={(e) => setArea(e.target.value)}
              />
              Living Space
            </label>
            <label>
              <input
                type="radio"
                value="Bathroom"
                checked={area === 'Bathroom'}
                onChange={(e) => setArea(e.target.value)}
              />
              Bathroom
            </label>
            <label>
              <input
                type="radio"
                value="Other"
                checked={area === 'Other'}
                onChange={(e) => setArea(e.target.value)}
              />
              Other
            </label>
          </div>
          <textarea
            placeholder="Description of the problem"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input type="file" onChange={(e) => setPhoto(e.target.files[0])} />
          <label>Upload Photo (optional)</label>
          <button type="submit">Submit Request</button>
        </form>
      </div>
    </div>
  );
};

export default TenantDashboard;
