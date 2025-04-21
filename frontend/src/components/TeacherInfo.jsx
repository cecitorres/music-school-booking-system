import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { getTeacherDetail } from '../features/teachers/teachersSlice';

const TeacherInfo = ({ teacherId }) => {
  const dispatch = useDispatch();
  const { selectedTeacher: data } = useSelector((state) => state.teachers);

  useEffect(() => {
    if (teacherId) {
      dispatch(getTeacherDetail(teacherId));
    }
  }, [dispatch, teacherId]);

  if (!data) return <div className="text-center text-gray-400">No teacher information available</div>;

  return (
    <div className="p-6 text-gray-200 bg-gray-800 rounded-lg shadow-md">
      <div className="flex items-center space-x-4">
        <img
          src={`https://i.pravatar.cc/150?u=${teacherId}`}
          alt="Teacher avatar"
          className="w-24 h-24 rounded-full"
        />
        <div>
          <h2 className="text-2xl font-bold">{data.fullName}</h2>
          <p className="text-gray-400">{data.email}</p>
          <p className="text-gray-400">{data.phoneNumber || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

TeacherInfo.propTypes = {
  teacherId: PropTypes.string.isRequired,
};

export default TeacherInfo;