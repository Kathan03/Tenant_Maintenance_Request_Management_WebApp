// src/components/MaintenanceDashboard.js
import React, { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import '../App.css';

const MaintenanceDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [apartmentNumber, setApartmentNumber] = useState('');
  const [area, setArea] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      const requestsRef = collection(db, 'requests');
      const data = await getDocs(requestsRef);
      setRequests(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };
    fetchRequests();
  }, []);

  const filterRequests = () => {
    const filtered = requests.filter(request => {
      const requestDate = new Date(request.dateTime?.seconds * 1000 || 0);
      const matchesApartment = apartmentNumber
        ? request.apartmentNumber.includes(apartmentNumber)
        : true;
      const matchesArea = area ? request.area.toLowerCase().includes(area.toLowerCase()) : true;
      const matchesStartDate = startDate ? requestDate >= new Date(startDate) : true;
      const matchesEndDate = endDate ? requestDate <= new Date(endDate) : true;
      const matchesStatus = statusFilter ? request.status === statusFilter : true;
      return matchesApartment && matchesArea && matchesStartDate && matchesEndDate && matchesStatus;
    });
    setRequests(filtered);
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    const requestDoc = doc(db, 'requests', id);
    await updateDoc(requestDoc, { status: newStatus });
    setRequests(requests.map(request => 
      request.id === id ? { ...request, status: newStatus } : request
    ));
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="FilterSection">
          <h1>Filter Maintenance Requests</h1>
          <label>Apartment Number:</label>
          <input
            type="text"
            placeholder="Filter by Apartment Number"
            value={apartmentNumber}
            onChange={(e) => setApartmentNumber(e.target.value)}
            className="filter-input"
          />
          <label>Area:</label>
          <input
            type="text"
            placeholder="Filter by Area (e.g., kitchen)"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="filter-input"
          />
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="filter-input"
          />
          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="filter-input"
          />
          <label>Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-input"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <button className="filter-button" onClick={filterRequests}>
            Apply Filters
          </button>
        </div>

        <div className="RecordsSection">
          <h2>Maintenance Requests</h2>
          <table className="records-table">
            <thead>
              <tr>
                <th>Apartment Number</th>
                <th>Area</th>
                <th>Description</th>
                <th>Date & Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(request => (
                <tr key={request.id}>
                  <td>{request.apartmentNumber}</td>
                  <td>{request.area}</td>
                  <td>{request.description}</td>
                  <td>
                    {request.dateTime
                      ? new Date(request.dateTime.seconds * 1000).toLocaleString()
                      : 'N/A'}
                  </td>
                  <td>
                    <button
                      className={`status-button ${request.status}`}
                      onClick={() => toggleStatus(request.id, request.status)}
                    >
                      {request.status}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceDashboard;
