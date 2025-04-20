import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTeacherAvailability } from './teachersSlice';
import { bookClass } from '../bookings/bookingsSlice';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TeacherBookLesson = ({ teacherId, studentId }) => {
  const dispatch = useDispatch();
  const { availability, loading, error } = useSelector((state) => state.teachers);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    if (teacherId) {
      dispatch(getTeacherAvailability(teacherId));
    }
  }, [teacherId, dispatch]);

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (date) {
      const newEndDate = new Date(date.getTime() + 60 * 60 * 1000); // Add 1 hour
      setEndDate(newEndDate);
    } else {
      setEndDate(null);
    }
  };

  const handleBookClass = async () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates.');
      return;
    }

    const duration = (new Date(endDate) - new Date(startDate)) / (1000 * 60); // Calculate duration in minutes
    if (duration <= 0) {
      alert('End date must be after start date.');
      return;
    }

    const bookingData = {
      teacherId,
      studentId,
      startTime: startDate.toISOString(),
      duration,
    };

    try {
      await dispatch(bookClass(bookingData)).unwrap();
      alert('Class booked successfully!');
    } catch (err) {
      alert('Failed to book class: ' + err.message);
    }
  };

  if (loading) {
    return <p>Loading availability...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!availability || availability.length === 0) {
    return <div></div>;
  }

  return (
    <div className="book-lesson-form">
      <h3>Book a Lesson</h3>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label>Start Date and Time</label>
          <DatePicker
            selected={startDate}
            onChange={handleStartDateChange}
            showTimeSelect
            dateFormat="MMMM d, yyyy h:mm aa"
            minDate={new Date()}
          />
        </div>

        <div className="form-group">
          <label>End Date and Time</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            showTimeSelect
            dateFormat="MMMM d, yyyy h:mm aa"
            minDate={startDate || new Date()}
          />
        </div>

        <button type="button" onClick={handleBookClass} disabled={!startDate || !endDate}>
          Book
        </button>
      </form>
    </div>
  );
};

export default TeacherBookLesson;