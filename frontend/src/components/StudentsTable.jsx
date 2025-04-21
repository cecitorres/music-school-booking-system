import React from 'react';
// import { useHistory } from 'react-router-dom';

const StudentsTable = ({ students, loading, error }) => {
    // const history = useHistory();
    const handleEdit = (studentId) => {
        // Navigate to the edit student page with the student ID using React Router
        // For example: history.push(`/students/edit/${studentId}`);
        // history.push(`/students/edit/${studentId}`);     
        
    };

    return (
        <section>
            <h2 className="mb-4 text-2xl font-semibold">👩‍🎓 Students</h2>
            <div className="p-4 bg-gray-800 rounded-lg shadow-md">
                {loading && <p className="text-center text-gray-400">Loading students...</p>}
                {error && <p className="text-center text-red-500">Error: {error}</p>}
                {students && students.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse table-auto">
                            <thead>
                                <tr className="text-gray-300 bg-gray-700">
                                    <th className="px-4 py-2 border border-gray-600">Full Name</th>
                                    {/* Phone number */}
                                    <th className="px-4 py-2 border border-gray-600">Phone Number</th>
                                    <th className="px-4 py-2 border border-gray-600">Email</th>
                                    <th className="px-4 py-2 border border-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-700">
                                        <td className="px-4 py-2 border border-gray-600">{student.fullName}</td>
                                        <td className="px-4 py-2 border border-gray-600">{student.phoneNumber || 'N/A'}</td>
                                        <td className="px-4 py-2 border border-gray-600">{student.email}</td>
                                        <td className="px-4 py-2 text-center border border-gray-600">
                                            <button
                                                onClick={() => handleEdit(student.id)}
                                                className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-gray-400">No students available.</p>
                )}
            </div>
        </section>
    );
};

export default StudentsTable;