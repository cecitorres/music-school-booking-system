// src/features/teachers/TeacherList.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTeachers } from "./teachersSlice";

const TeacherList = () => {
    const dispatch = useDispatch();

    const { list: teachers, loading, error } = useSelector((state) => state.teachers);

    useEffect(() => {
        dispatch(getTeachers());
    }, [dispatch]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    console.log(teachers);
    if (!teachers || teachers.length === 0) {
        return <p>No teachers available.</p>;
    }

    return (
        <div>
            <h2 className="mb-4 text-2xl font-semibold">List of Teachers</h2>
            <table className="w-full border border-collapse border-gray-300 table-auto">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="px-4 py-2 border border-gray-300">Full Name</th>
                        <th className="px-4 py-2 border border-gray-300">Email</th>
                        <th className="px-4 py-2 border border-gray-300">Phone Number</th>
                        <th className="px-4 py-2 border border-gray-300">Instruments</th>
                    </tr>
                </thead>
                <tbody>
                    {teachers.map((teacher) => (
                        <tr key={teacher.id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 border border-gray-300">{teacher.fullName}</td>
                            <td className="px-4 py-2 border border-gray-300">{teacher.email}</td>
                            <td className="px-4 py-2 border border-gray-300">{teacher.phoneNumber || 'N/A'}</td>
                            <td className="px-4 py-2 border border-gray-300">
                                {teacher.instruments}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TeacherList;
