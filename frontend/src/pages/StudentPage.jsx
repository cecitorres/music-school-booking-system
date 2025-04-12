// src/pages/StudentPage.jsx
import React from 'react';

const StudentPage = ({ studentId }) => {
  return (
    <div>
      <h1>Student Dashboard</h1>
      <p>Welcome, Student {studentId}!</p>
      {/* Add student-specific components here */}
    </div>
  );
};

export default StudentPage;