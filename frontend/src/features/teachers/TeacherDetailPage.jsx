import React from 'react'
import { useParams } from 'react-router-dom'
import TeacherInfo from '../../components/TeacherInfo'
import TeacherAvailability from './TeacherAvailability'

const TeacherDetailPage = () => {
    // Extract teacherId from URL params
    const { id } = useParams()
    const teacherId = id
    return (
        <>
            <TeacherInfo teacherId={teacherId} />
            <TeacherAvailability teacherId={teacherId} />
        </>
    )
}

export default TeacherDetailPage