import React from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import TeacherInfo from '../../components/TeacherInfo'
import TeacherAvailability from './TeacherAvailability'
import TeacherBookLesson from './TeacherBookLesson'

const TeacherDetailPage = () => {
    // Extract teacherId from URL params
    const { id } = useParams()
    const teacherId = id
    const studentId = useSelector((state) => state.auth.user?.studentId);
    return (
        <>
            <TeacherInfo teacherId={teacherId} />
            <TeacherAvailability teacherId={teacherId} />
            {/* Teacher book a lesson */}
            <TeacherBookLesson teacherId={teacherId} studentId={studentId}/>
        </>
    )
}

export default TeacherDetailPage