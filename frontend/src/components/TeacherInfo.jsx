import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { getTeacherDetail } from '../features/teachers/teachersSlice';

const TeacherInfo = () => {
  const dispatch = useDispatch();
  const teacherId = useSelector((state) => state.auth.user?.teacherId);
  const data = useSelector((state) => state.teachers.selectedTeacher);

  useEffect(() => {
    dispatch(getTeacherDetail(teacherId));
  }, [dispatch, teacherId]);

  if (!data) return <div>No teacher information available</div>;
  return (
    <div>
      {/* Fake avatar image */}
      <img
        src={`https://i.pravatar.cc/150?u=${teacherId}`}
        alt="Teacher avatar" />
      <h2>{data.fullName}</h2>
      <p>{data.email}</p>
      <p>{data.phoneNumber}</p>
    </div>
  );
};
TeacherInfo.propTypes = {
  teacherId: PropTypes.string.isRequired,
};

export default TeacherInfo;