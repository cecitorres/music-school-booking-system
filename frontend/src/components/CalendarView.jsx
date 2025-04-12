// src/components/CalendarView.js
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAvailableSlots } from '../features/calendar/calendarSlice';

const CalendarView = ({ teacherId }) => {
    const dispatch = useDispatch();
    const { slots, status, error } = useSelector((state) => state.calendar);

    useEffect(() => {
        dispatch(fetchAvailableSlots(teacherId));
    }, [dispatch, teacherId]);

    if (status === 'loading') return <div>Loading...</div>;
    if (status === 'failed') return <div>Error: {error}</div>;

    return (
        <div>
            <ul>
                {slots.map((slot) => (
                    <li key={slot.id}>{slot.startTime} - {slot.endTime}</li>
                ))}
            </ul>
        </div>
    );
};

CalendarView.propTypes = {
    teacherId: PropTypes.string.isRequired,
};
export default CalendarView;