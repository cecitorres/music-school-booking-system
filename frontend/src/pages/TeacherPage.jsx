import PropTypes from 'prop-types';
import TeacherInfo from '../components/TeacherInfo';
import CalendarView from '../components/CalendarView';
import AddSlotForm from '../components/AddSlotForm';
import LogoutButton from '../components/LogoutButton';

const TeacherPage = ({ teacherId, setUser }) => {
  return (
    <div className="teacher-page">
      <h1>Teacher Dashboard</h1>
      <LogoutButton setUser={setUser} />

      {/* Teacher Information Section */}
      <section className="teacher-info-section">
        <h2>Teacher Information</h2>
        <TeacherInfo teacherId={teacherId} />
      </section>

      {/* Available Slots Section */}
      <section className="available-slots-section">
        <h2>Available Slots</h2>
        <CalendarView teacherId={teacherId} />
      </section>

      {/* Add Slot Form Section */}
      <section className="add-slot-section">
        <h2>Add New Slot</h2>
        <AddSlotForm teacherId={teacherId} />
      </section>
    </div>
  );
};

TeacherPage.propTypes = {
  teacherId: PropTypes.string.isRequired,
};
export default TeacherPage;