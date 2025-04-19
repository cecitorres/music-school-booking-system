import { useSelector } from 'react-redux'; // Import useSelector
import TeacherInfo from '../components/TeacherInfo';
import CalendarView from '../components/CalendarView';
import AddSlotForm from '../components/AddSlotForm';
import LogoutButton from '../components/LogoutButton';
import NextBookings from '../components/NextBookings';

const TeacherPage = () => {
  // Access teacherId from Redux store
  const teacherId = useSelector((state) => state.auth.user?.teacherId);

  return (
    <div className="teacher-page">
      <h1>Teacher Dashboard</h1>
      {/* <LogoutButton /> */}

      {/* Teacher Information Section */}
      <section className="teacher-info-section">
        <h2>Teacher Information</h2>
        {teacherId ? (
          <TeacherInfo teacherId={teacherId} />
        ) : (
          <p>Loading teacher information...</p>
        )}
      </section>

      {/* Next classes (confirmed and pending confirm) */}
      {/* <section className="next-classes-section">
        <h2>Next Classes</h2>
        <NextBookings />
      </section> */}

      {/* Available Slots Section */}
      {/* <section className="available-slots-section">
        <h2>Available Slots</h2>
        {teacherId ? (
          <CalendarView teacherId={teacherId} />
        ) : (
          <p>Loading available slots...</p>
        )}
      </section> */}

      {/* Add Slot Form Section */}
      {/* <section className="add-slot-section">
        <h2>Add New Slot</h2>
        {teacherId ? (
          <AddSlotForm teacherId={teacherId} />
        ) : (
          <p>Loading add slot form...</p>
        )}
      </section> */}
    </div>
  );
};

export default TeacherPage;