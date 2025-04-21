import React from 'react';
import { useSelector } from 'react-redux';
import TeacherAddAvailability from './TeacherAddAvailability';
import TeacherAvailability from '../teachers/TeacherAvailability';

const MyAvailabilityPage = () => {
  const teacherId = useSelector((state) => state.auth.user?.teacherId);

  return (
    <div className="min-h-screen p-6 pt-16 text-gray-200 bg-gray-900">
      <div className="container max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center">My Availability</h1>

        <section className="p-6 bg-gray-800 rounded-lg shadow-md">
          <h2 className="mb-4 text-2xl font-semibold">Add Availability</h2>
          <TeacherAddAvailability teacherId={teacherId} />
        </section>

        <section className="p-6 bg-gray-800 rounded-lg shadow-md">
          <h2 className="mb-4 text-2xl font-semibold">Current Availability</h2>
          <TeacherAvailability teacherId={teacherId} />
        </section>
      </div>
    </div>
  );
};

export default MyAvailabilityPage;