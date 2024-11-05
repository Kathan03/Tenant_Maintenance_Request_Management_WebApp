// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import ManagerDashboard from './components/ManagerDashboard';
import TenantDashboard from './components/TenantDashboard';
import MaintenanceDashboard from './components/MaintenanceDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/manager-dashboard" element={<ManagerDashboard />} />
        <Route path="/tenant-dashboard" element={<TenantDashboard />} />
        <Route path="/maintenance-dashboard" element={<MaintenanceDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
