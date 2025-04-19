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

  const formatTime = (time) => {
    const date = new Date(time);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return <p>Loading availability...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!availability || availability.length === 0) {
    return <p>No availability found for this teacher.</p>;
  }

  return (
    <div>
      <h3>Teacher Availability</h3>
      <ul>
        {availability.map((slot, index) => (
          <li key={index}>
            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeacherAvailability;