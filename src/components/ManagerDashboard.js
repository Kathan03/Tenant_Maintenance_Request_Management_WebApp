// src/components/ManagerDashboard.js
import React, { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import '../App.css';

const ManagerDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [newTenant, setNewTenant] = useState({
    tenantID: '',
    name: '',
    phone: '',
    email: '',
    checkInDate: '',
    checkOutDate: '',
    apartmentNumber: '',
  });
  const [selectedTenant, setSelectedTenant] = useState(null); // To hold tenant to be updated

  useEffect(() => {
    fetchRequests();
    fetchTenants();
  }, []);

  const fetchRequests = async () => {
    const requestsRef = collection(db, 'requests');
    const querySnapshot = await getDocs(requestsRef);
    const requestsData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setRequests(requestsData);
  };

  const fetchTenants = async () => {
    const tenantsRef = collection(db, 'tenants');
    const querySnapshot = await getDocs(tenantsRef);
    const tenantsData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTenants(tenantsData);
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    const requestRef = doc(db, 'requests', requestId);
    await updateDoc(requestRef, { status: newStatus });
    setRequests(requests.map(req => req.id === requestId ? { ...req, status: newStatus } : req));
  };

  const handleAddTenant = async () => {
    const { email } = newTenant;

    // Add tenant to tenants collection
    const tenantsRef = collection(db, 'tenants');
    const tenantDoc = await addDoc(tenantsRef, newTenant);

    // Add corresponding user entry
    const usersRef = collection(db, 'users');
    await addDoc(usersRef, { userID: tenantDoc.id, email, role: 'tenant' });

    // Reset the new tenant state
    resetTenantForm();
    fetchTenants();
  };

  const resetTenantForm = () => {
    setNewTenant({
      tenantID: '',
      name: '',
      phone: '',
      email: '',
      checkInDate: '',
      checkOutDate: '',
      apartmentNumber: '',
    });
    setSelectedTenant(null);
  };

  const handleDeleteTenant = async (tenantId) => {
    const tenantToDelete = tenants.find(tenant => tenant.id === tenantId);
    if (!tenantToDelete) return;

    // Delete tenant from tenants collection
    await deleteDoc(doc(db, 'tenants', tenantId));

    // Also delete from users collection based on email
    const usersRef = collection(db, 'users');
    const userQuery = await getDocs(usersRef);
    const userDoc = userQuery.docs.find(doc => doc.data().email === tenantToDelete.email);
    if (userDoc) {
      await deleteDoc(doc(usersRef, userDoc.id));
    }

    fetchTenants();
  };

  const handleUpdateTenant = async () => {
    if (!selectedTenant) return;

    const tenantRef = doc(db, 'tenants', selectedTenant.id);
    await updateDoc(tenantRef, newTenant);

    // Update corresponding user entry
    const usersRef = collection(db, 'users');
    const userQuery = await getDocs(usersRef);
    const userDoc = userQuery.docs.find(doc => doc.data().email === selectedTenant.email);
    if (userDoc) {
      await updateDoc(doc(usersRef, userDoc.id), { email: newTenant.email });
    }

    resetTenantForm();
    fetchTenants();
  };

  const handleEditTenant = (tenant) => {
    setNewTenant(tenant);
    setSelectedTenant(tenant);
  };

  return (
    <div className="manager-dashboard">
      <h1>Manager Dashboard</h1>
      <h2>Maintenance Requests</h2>
      <table>
        <thead>
          <tr>
            <th>Apartment Number</th>
            <th>Area</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id}>
              <td>{request.apartmentNumber}</td>
              <td>{request.area}</td>
              <td>{request.description}</td>
              <td>{request.status}</td>
              <td>
                {request.status === 'pending' && (
                  <button className="status-button pending" onClick={() => handleStatusUpdate(request.id, 'completed')}>
                    Mark as Completed
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Add New Tenant</h2>
      <form onSubmit={e => { e.preventDefault(); handleAddTenant(); }} className="tenant-form">
        <input 
          type="text" 
          placeholder="Tenant ID" 
          value={newTenant.tenantID} 
          onChange={e => setNewTenant({ ...newTenant, tenantID: e.target.value })} 
          required 
        />
        <input 
          type="text" 
          placeholder="Name" 
          value={newTenant.name} 
          onChange={e => setNewTenant({ ...newTenant, name: e.target.value })} 
          required 
        />
        <input 
          type="tel" 
          placeholder="Phone" 
          value={newTenant.phone} 
          onChange={e => setNewTenant({ ...newTenant, phone: e.target.value })} 
          required 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={newTenant.email} 
          onChange={e => setNewTenant({ ...newTenant, email: e.target.value })} 
          required 
        />
        <input 
          type="date" 
          placeholder="Check-In Date" 
          value={newTenant.checkInDate} 
          onChange={e => setNewTenant({ ...newTenant, checkInDate: e.target.value })} 
          required 
        />
        <input 
          type="date" 
          placeholder="Check-Out Date" 
          value={newTenant.checkOutDate} 
          onChange={e => setNewTenant({ ...newTenant, checkOutDate: e.target.value })} 
          required 
        />
        <input 
          type="text" 
          placeholder="Apartment Number" 
          value={newTenant.apartmentNumber} 
          onChange={e => setNewTenant({ ...newTenant, apartmentNumber: e.target.value })} 
          required 
        />
        <button type="submit" className="submit-button">Add Tenant</button>
      </form>

      <h2>Update Tenant Details</h2>
      {selectedTenant && (
        <form onSubmit={e => { e.preventDefault(); handleUpdateTenant(); }} className="tenant-form">
          <input 
            type="text" 
            placeholder="Tenant ID" 
            value={newTenant.tenantID} 
            onChange={e => setNewTenant({ ...newTenant, tenantID: e.target.value })} 
            required 
          />
          <input 
            type="text" 
            placeholder="Name" 
            value={newTenant.name} 
            onChange={e => setNewTenant({ ...newTenant, name: e.target.value })} 
            required 
          />
          <input 
            type="tel" 
            placeholder="Phone" 
            value={newTenant.phone} 
            onChange={e => setNewTenant({ ...newTenant, phone: e.target.value })} 
            required 
          />
          <input 
            type="email" 
            placeholder="Email" 
            value={newTenant.email} 
            onChange={e => setNewTenant({ ...newTenant, email: e.target.value })} 
            required 
          />
          <input 
            type="date" 
            placeholder="Check-In Date" 
            value={newTenant.checkInDate} 
            onChange={e => setNewTenant({ ...newTenant, checkInDate: e.target.value })} 
            required 
          />
          <input 
            type="date" 
            placeholder="Check-Out Date" 
            value={newTenant.checkOutDate} 
            onChange={e => setNewTenant({ ...newTenant, checkOutDate: e.target.value })} 
            required 
          />
          <input 
            type="text" 
            placeholder="Apartment Number" 
            value={newTenant.apartmentNumber} 
            onChange={e => setNewTenant({ ...newTenant, apartmentNumber: e.target.value })} 
            required 
          />
          <button type="submit" className="submit-button">Update Tenant</button>
        </form>
      )}

      <h2>Current Tenants</h2>
      <table>
        <thead>
          <tr>
            <th>Tenant ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Check-In Date</th>
            <th>Check-Out Date</th>
            <th>Apartment Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((tenant) => (
            <tr key={tenant.id}>
              <td>{tenant.tenantID}</td>
              <td>{tenant.name}</td>
              <td>{tenant.phone}</td>
              <td>{tenant.email}</td>
              <td>{new Date(tenant.checkInDate).toLocaleDateString()}</td>
              <td>{new Date(tenant.checkOutDate).toLocaleDateString()}</td>
              <td>{tenant.apartmentNumber}</td>
              <td>
                <button className="edit-button" onClick={() => handleEditTenant(tenant)}>Edit</button>
                <button className="delete-button" onClick={() => handleDeleteTenant(tenant.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManagerDashboard;
