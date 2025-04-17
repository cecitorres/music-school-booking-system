// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import TeacherPage from './pages/TeacherPage';
import StudentPage from './pages/StudentPage';
import AdminPage from './pages/AdminPage';
import HomePage from './pages/HomePage';

const App = () => {
  const [user, setUser] = useState({id: 1, role: 'teacher'});

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login setUser={setUser} />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute user={user} role="teacher" />}>
          <Route path="/teacher" element={<TeacherPage teacherId={user?.id} />} />
        </Route>

        <Route element={<ProtectedRoute user={user} role="student" />}>
          <Route path="/student" element={<StudentPage studentId={user?.id} />} />
        </Route>

        <Route element={<ProtectedRoute user={user} role="admin" />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>
        {/* Registration Route */}
        <Route path="/register" element={<RegisterPage />} />

        
        {/* Teacher List Route */}
        <Route path="/teachers" element={<TeacherList />} />

        {/* Fallback Route */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default App;