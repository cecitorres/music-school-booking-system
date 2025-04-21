import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const BookingHistory = ({ history }) => {
    const userRole = useSelector((state) => state.auth.user?.role);

    const formatTimeRange = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const options = { hour: 'numeric', minute: 'numeric', hour12: true };
        const startTime = startDate.toLocaleString(undefined, options);
        const endTime = endDate.toLocaleString(undefined, options);
        return `${startTime} to ${endTime}`;
    };

    if (!history || history.length === 0) {
        return <p className="text-center text-gray-400">You have no past classes.</p>;
    }

    return (
        <section>
            <ul className="text-gray-200 list-disc list-inside">
                {history.map((h) => (
                    <li key={h.id}>
                        {userRole === 'Teacher' ? h.studentName : h.teacherName} -{' '}
                        {new Date(h.startTime).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                        })}, {formatTimeRange(h.startTime, h.endTime)} ({h.status})
                    </li>
                ))}
            </ul>
        </section>
    );
};

BookingHistory.propTypes = {
    history: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            studentName: PropTypes.string.isRequired,
            teacherName: PropTypes.string.isRequired,
            startTime: PropTypes.string.isRequired,
            endTime: PropTypes.string.isRequired,
            status: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default BookingHistory;