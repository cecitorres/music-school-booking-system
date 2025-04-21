import React from 'react';
import { useSelector } from 'react-redux';
import TeacherAddAvailability from './TeacherAddAvailability';
import TeacherAvailability from '../teachers/TeacherAvailability';

const MyAvailabilityPage = () => {

    // Get teacherId from auth slice
    const teacherId = useSelector((state) => state.auth.user?.teacherId);
    return (
        <div>
            <TeacherAddAvailability teacherId={teacherId} />

            <TeacherAvailability teacherId={teacherId} />
        </div>
    );
}

export default MyAvailabilityPage;