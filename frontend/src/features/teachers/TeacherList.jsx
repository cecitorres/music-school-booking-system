// src/features/teachers/TeacherList.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTeachers } from './teachersSlice';
import { useNavigate } from 'react-router-dom';

const TeacherList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: teachers, loading, error } = useSelector((state) => state.teachers);

  useEffect(() => {
    dispatch(getTeachers());
  }, [dispatch]);

  const handleView = (teacherId) => {
    navigate(`/teachers/${teacherId}`); // Navigate to the teacher's detail page
  };

  if (loading) {
    return <p className="text-center text-gray-400">Loading teachers...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  if (!teachers || teachers.length === 0) {
    return <p className="text-center text-gray-400">No teachers available.</p>;
  }

  return (
    <div className="min-h-screen p-6 pt-16 text-gray-200 bg-gray-900">
      <div className="container max-w-4xl mx-auto space-y-8">
        <h2 className="text-3xl font-bold text-center">List of Teachers</h2>
        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md">
          <table className="w-full border-collapse table-auto">
            <thead>
              <tr className="text-gray-300 bg-gray-700">
                <th className="px-4 py-2 border border-gray-600">Full Name</th>
                <th className="px-4 py-2 border border-gray-600">Email</th>
                <th className="px-4 py-2 border border-gray-600">Phone Number</th>
                <th className="px-4 py-2 border border-gray-600">Instruments</th>
                <th className="px-4 py-2 border border-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-gray-700">
                  <td className="px-4 py-2 border border-gray-600">{teacher.fullName}</td>
                  <td className="px-4 py-2 border border-gray-600">{teacher.email}</td>
                  <td className="px-4 py-2 border border-gray-600">{teacher.phoneNumber || 'N/A'}</td>
                  <td className="px-4 py-2 border border-gray-600">{teacher.instruments}</td>
                  <td className="px-4 py-2 text-center border border-gray-600">
                    <button
                      onClick={() => handleView(teacher.id)}
                      className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                    >
                      View
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

export default TeacherList;
