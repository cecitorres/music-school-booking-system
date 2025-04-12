import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTeacherInfo } from '../features/teacher/teacherSlice';

const TeacherInfo = ({ teacherId }) => {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state) => state.teacher);

  useEffect(() => {
    dispatch(fetchTeacherInfo(teacherId));
  }, [dispatch, teacherId]);

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed') return <div>Error: {error}</div>;
  console.log(data)
  return (
    <div>
      {/* Fake avatar image */}
      <img
        src={`https://i.pravatar.cc/150?u=${teacherId}011`}
        alt="Teacher avatar" />
      <h2>{data.name}</h2>
      <p>{data.email}</p>
    </div>
  );
};
TeacherInfo.propTypes = {
  teacherId: PropTypes.string.isRequired,
};

export default TeacherInfo;