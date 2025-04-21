import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllBookings } from '../features/bookings/bookingsSlice';
import { getStudents } from '../features/students/studentsSlice';
import { getTeachers } from '../features/teachers/teachersSlice';
import BookingsTable from './BookingsTable';
import StudentsTable from './StudentsTable';
import TeachersTable from './TeachersTable';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { allBookings, loading: bookingsLoading, error: bookingsError } = useSelector((state) => state.bookings);
  const { list: students, loading: studentsLoading, error: studentsError } = useSelector((state) => state.students);
  const { list: teachers, loading: teachersLoading, error: teachersError } = useSelector((state) => state.teachers);

  useEffect(() => {
    dispatch(getAllBookings());
    dispatch(getStudents());
    dispatch(getTeachers());
  }, [dispatch]);

  return (
    <div className="min-h-screen p-6 pt-16 text-gray-200 bg-gray-900">
      <div className="container max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center">Welcome to the Admin Dashboard</h1>

        {/* Bookings Section */}
        <BookingsTable
          bookings={allBookings}
          loading={bookingsLoading}
          error={bookingsError}
        />

        {/* Students Section */}
        <StudentsTable
          students={students}
          loading={studentsLoading}
          error={studentsError}
        />

        {/* Teachers Section */}
        <TeachersTable
          teachers={teachers}
          loading={teachersLoading}
          error={teachersError}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;