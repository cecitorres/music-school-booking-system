// src/App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import TeacherList from './features/teachers/TeacherList';
import TeacherDetailPage from './features/teachers/TeacherDetailPage';
import MyBookingsPage from './features/bookings/MyBookingsPage';
import Navbar from './components/Navbar';
import MyAvailabilityPage from './features/availability/MyAvailabilityPage';
import './styles/AddSlotForm.css';

const App = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <Router>
      <div className="flex flex-col min-h-screen text-gray-200 bg-gray-900">
        <Navbar />
        <main className="flex-grow py-6">
          <div className="container px-4 mx-auto">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/teachers" element={<TeacherList />} />
              <Route path="/teachers/:id" element={<TeacherDetailPage />} />

              {/* Teacher Routes */}
              <Route element={<ProtectedRoute user={user} role="teacher" />}>
                <Route path="/bookings" element={<MyBookingsPage />} />
                <Route path="/teacher/availability" element={<MyAvailabilityPage teacherId={user?.id} />} />
              </Route>

              {/* Student Routes */}
              <Route element={<ProtectedRoute user={user} role="student" />}>
                <Route path="/bookings" element={<MyBookingsPage />} />
              </Route>

              {/* Fallback Route */}
              <Route path="*" element={<div className="text-center text-gray-400">404 Not Found</div>} />
            </Routes>
          </div>
        </main>
        <footer className="py-4 text-center bg-gray-800">
          <p>&copy; 2025 Cecilia. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;