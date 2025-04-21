// src/pages/HomePage.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import StudentDashboard from './StudentDashboard';
import TeacherDashboard from './TeacherDashboard';
import AdminDashboard from './AdminDashboard';

const HomePage = () => {
  const userRole = useSelector((state) => state.auth.user?.role);

  const renderDashboard = () => {
    switch (userRole) {
      case 'Student':
        return <StudentDashboard />;
      case 'Teacher':
        return <TeacherDashboard />;
      case 'Admin':
        return <AdminDashboard />;
      default:
        return (
          <div className="text-center text-gray-300">
            <h1 className="mb-4 text-4xl font-bold">Welcome to the Music School Booking System</h1>
            <Link
              to="/login"
              className="text-blue-400 hover:underline"
            >
              Login
            </Link>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen p-6 pt-16 bg-gray-900">{renderDashboard()}</div>
  );
};

export default HomePage;