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
      setStartDate(null);
      setEndDate(null);
    } catch (err) {
      alert('Failed to book class: ' + err.message);
    }
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
      <h3 className="mb-4 text-xl font-bold">Book a Lesson</h3>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <div>
          <label className="block mb-2 text-gray-400">Start Date and Time</label>
          <DatePicker
            selected={startDate}
            onChange={handleStartDateChange}
            showTimeSelect
            dateFormat="MMMM d, yyyy h:mm aa"
            minDate={new Date()}
            className="w-full p-2 text-gray-200 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-400">End Date and Time</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            showTimeSelect
            dateFormat="MMMM d, yyyy h:mm aa"
            minDate={startDate || new Date()}
            className="w-full p-2 text-gray-200 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="button"
          onClick={handleBookClass}
          disabled={!startDate || !endDate}
          className={`w-full py-2 px-4 rounded-md font-medium text-white transition ${
            !startDate || !endDate ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Book
        </button>
      </form>
    </div>
  );
};

export default TeacherBookLesson;