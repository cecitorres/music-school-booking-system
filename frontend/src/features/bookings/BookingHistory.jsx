import PropTypes from 'prop-types'

const BookingHistory = ({ history }) => {
    const formatTimeRange = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const options = { hour: 'numeric', minute: 'numeric', hour12: true };
        const startTime = startDate.toLocaleString(undefined, options);
        const endTime = endDate.toLocaleString(undefined, options);
        return `${startTime} to ${endTime}`;
    };
    if (!history || history.length === 0) {
        return <p className="text-center text-gray-400">You have no past classes.</p>
    }
    return (
        <section>
            <ul className="list-disc list-inside">
                {history.map((h) => (
                    <li key={h.id}>
                        {h.studentName} - {new Date(h.startTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}, {formatTimeRange(h.startTime, h.endTime)} ({h.status})
                    </li>
                ))}
            </ul>
        </section>
    )
}
BookingHistory.propTypes = {
    history: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            studentName: PropTypes.string.isRequired,
            startTime: PropTypes.string.isRequired,
            endTime: PropTypes.string.isRequired,
            status: PropTypes.string.isRequired,
        })
    ).isRequired,
}

export default BookingHistory