import { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { addSlot } from '../features/calendar/calendarSlice';
import api from '../api/calendarApi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/AddSlotForm.css';

const AddSlotForm = ({ teacherId }) => {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Generate time options in 15-minute intervals
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute of [0, 15, 30, 45]) {
        const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        options.push(time);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Format the date and time into ISO 8601 format
    const startDateTime = new Date(selectedDate);
    const endDateTime = new Date(selectedDate);

    const [startHours, startMinutes] = startTime.split(':');
    const [endHours, endMinutes] = endTime.split(':');

    startDateTime.setHours(startHours, startMinutes);
    endDateTime.setHours(endHours, endMinutes);

    const slotData = [
      {
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
      },
    ];

    try {
      const response = await api.addSlot(teacherId, slotData);
      dispatch(addSlot(response)); // Update Redux state
      setSelectedDate(null);
      setStartTime('');
      setEndTime('');
      alert('Slot added successfully!');
    } catch (error) {
      console.error('Failed to add slot:', error);
      alert('Failed to add slot. Please try again.');
    }
  };

  return (
    <div className="add-slot-form">
      <h2>Add Availability</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Select Date</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="MMMM d, yyyy"
            minDate={new Date()}
            inline
          />
        </div>


        <div className="form-group">
          <label>Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>


        <div className="form-group">
          <label>End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>

        <button type="submit">Save Availability</button>
      </form>
    </div>
  );
};

AddSlotForm.propTypes = {
  teacherId: PropTypes.string.isRequired,
};

export default AddSlotForm;