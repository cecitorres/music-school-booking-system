import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTeacherAvailability } from './teachersSlice';

const TeacherAvailability = ({ teacherId }) => {
  const dispatch = useDispatch();
  const { availability, loading, error } = useSelector((state) => state.teachers);

  useEffect(() => {
    if (teacherId) {
      dispatch(getTeacherAvailability(teacherId));
    }
  }, [teacherId, dispatch]);

  const formatDate = (time) => {
    const date = new Date(time);
    return date.toLocaleString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (time) => {
    const date = new Date(time);
    return date.toLocaleString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (loading) {
    return <p className="text-center text-gray-400">Loading availability...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  if (!availability || availability.length === 0) {
    return <p className="text-center text-gray-400">No availability found for this teacher.</p>;
  }

  return (
    <div className="p-6 text-gray-200 bg-gray-800 rounded-lg shadow-md">
      <h3 className="mb-4 text-xl font-bold">Availability</h3>
      <ul className="space-y-2">
        {availability.map((slot, index) => (
          <li key={index} className="text-gray-400">
            {formatDate(slot.startTime)}, {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeacherAvailability;