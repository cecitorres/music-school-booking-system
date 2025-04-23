import { Link } from 'react-router-dom';

const TeachersTable = ({ teachers, loading, error }) => {

    return (
        <section>
            <h2 className="mb-4 text-2xl font-semibold">🎵 Teachers</h2>
            <div className="p-4 bg-gray-800 rounded-lg shadow-md">
                {loading && <p className="text-center text-gray-400">Loading teachers...</p>}
                {error && <p className="text-center text-red-500">Error: {error}</p>}
                {teachers && teachers.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse table-auto">
                            <thead>
                                <tr className="text-gray-300 bg-gray-700">
                                    <th className="px-4 py-2 border border-gray-600">Full Name</th>
                                    <th className="px-4 py-2 border border-gray-600">Phone Number</th>
                                    <th className="px-4 py-2 border border-gray-600">Email</th>
                                    <th className="px-4 py-2 border border-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teachers.map((teacher) => (
                                    <tr key={teacher.id} className="hover:bg-gray-700">
                                        <td className="px-4 py-2 border border-gray-600">{teacher.fullName}</td>
                                        <td className="px-4 py-2 border border-gray-600">
                                            {teacher.phoneNumber || 'N/A'}
                                        </td>
                                        <td className="px-4 py-2 border border-gray-600">{teacher.email}</td>
                                        <td className="px-4 py-2 text-center border border-gray-600">
                                            <Link
                                                to={`/edit/${teacher.id}`}
                                                className="px-2 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                                            >
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-gray-400">No teachers available.</p>
                )}
            </div>
        </section>
    );
};

export default TeachersTable;