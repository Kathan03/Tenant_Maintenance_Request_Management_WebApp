// src/components/Login.js
import React, { useState } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Added password state
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setErrorMessage('No user found with this email. Please try again.');
        return;
      }

      const userData = querySnapshot.docs[0].data();
      const userID = querySnapshot.docs[0].id; // Get the user ID from the document

      // Navigate based on user role
      if (userData.role === 'tenant') {
        navigate('/tenant-dashboard', { state: { userID } }); // Pass userID to state
      } else if (userData.role === 'manager') {
        navigate('/manager-dashboard', { state: { userID } });
      } else if (userData.role === 'maintenance') {
        navigate('/maintenance-dashboard', { state: { userID } });
      } else {
        setErrorMessage('User role is not recognized.');
      }
    } catch (error) {
      setErrorMessage('Error logging in: ' + error.message);
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password" // Password input field
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {errorMessage && <p className="error">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default Login;
