// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simulate login API call
    if (username === 'teacher' && password === '1') {
      setUser({ role: 'teacher', id: '1' });
      navigate('/teacher');
    } else if (username === 'student' && password === 'student123') {
      setUser({ role: 'student', id: '456' });
      navigate('/student');
    } else if (username === 'admin' && password === 'admin123') {
      setUser({ role: 'admin', id: '789' });
      navigate('/admin');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Login;