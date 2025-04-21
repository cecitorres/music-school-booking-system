import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../features/auth/authSlice';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'Student',
        phoneNumber: '',
        firstName: '',
        lastName: '',
    });

    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);
    const userRole = useSelector((state) => state.auth.user?.role); // Get the logged-in user's role

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(register(formData))
            .unwrap()
            .then(() => {
                alert('Registration successful!'); // Show success alert
                setFormData({
                    email: '',
                    password: '',
                    role: 'Student',
                    phoneNumber: '',
                    firstName: '',
                    lastName: '',
                }); // Reset form
            })
            .catch((err) => {
                console.error('Registration failed:', err);
            });
    };

    return (
        <div className="flex items-center justify-center min-h-screen text-gray-200 bg-gray-900">
            <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-md">
                <h2 className="mb-6 text-3xl font-bold text-center">Register</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full p-2 text-gray-200 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full p-2 text-gray-200 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full p-2 text-gray-200 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full p-2 text-gray-200 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        name="phoneNumber"
                        placeholder="Phone Number"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                        className="w-full p-2 text-gray-200 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                        className="w-full p-2 text-gray-200 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {userRole === 'Admin' && (
                            <>
                                <option value="Student">Student</option>
                                <option value="Teacher">Teacher</option>
                                <option value="Admin">Admin</option>
                            </>
                        )}
                        {userRole === 'Teacher' && <option value="Student">Student</option>}
                    </select>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 px-4 rounded-md font-medium text-white transition ${
                            loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                {error && <p className="mt-4 text-sm text-red-500">Error: {error}</p>}
            </div>
        </div>
    );
};

export default RegisterPage;