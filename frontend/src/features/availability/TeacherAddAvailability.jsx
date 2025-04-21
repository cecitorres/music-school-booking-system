import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addAvailability } from './availabilitySlice';
import { getTeacherAvailability } from '../teachers/teachersSlice';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TeacherAddAvailability = ({ teacherId }) => {
  const dispatch = useDispatch();

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (date) {
      const newEndDate = new Date(date.getTime() + 60 * 60 * 1000); // Default to 1 hour later
      setEndDate(newEndDate);
    } else {
      setEndDate(null);
    }
  };

  const handleAddAvailability = async () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates.');
      return;
    }

    const duration = (new Date(endDate) - new Date(startDate)) / (1000 * 60); // Calculate duration in minutes
    if (duration <= 0) {
      alert('End date must be after start date.');
      return;
    }

    const availabilityData = [
      {
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
      },
    ];

    try {
      await dispatch(addAvailability({ teacherId, data: availabilityData })).unwrap();
      alert('Availability added successfully!');
      setStartDate(null);
      setEndDate(null);
      await dispatch(getTeacherAvailability(teacherId)); // Refresh availability
    } catch (err) {
      alert('Failed to add availability: ' + err.message);
    }
  };

  return (
    <div className="add-availability-form">
      <h3>Add Availability</h3>
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

        <button type="button" onClick={handleAddAvailability} disabled={!startDate || !endDate}>
          Add Availability
        </button>
      </form>
    </div>
  );
};

export default TeacherAddAvailability;