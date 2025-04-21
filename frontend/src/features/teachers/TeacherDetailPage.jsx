import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import TeacherInfo from '../../components/TeacherInfo';
import TeacherAvailability from './TeacherAvailability';
import TeacherBookLesson from './TeacherBookLesson';

const TeacherDetailPage = () => {
  // Extract teacherId from URL params
  const { id } = useParams();
  const teacherId = id;
  const studentId = useSelector((state) => state.auth.user?.studentId);

  return (
    <div className="min-h-screen p-6 pt-16 text-gray-200 bg-gray-900">
      <div className="container max-w-4xl mx-auto space-y-8">
        <TeacherInfo teacherId={teacherId} />
        <TeacherAvailability teacherId={teacherId} />
        <TeacherBookLesson teacherId={teacherId} studentId={studentId} />
      </div>
    </div>
  );
};

export default TeacherDetailPage;