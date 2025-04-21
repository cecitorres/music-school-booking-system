// src/App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Import useSelector
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import TeacherPage from './pages/TeacherPage';
import StudentPage from './pages/StudentPage';
import AdminPage from './pages/AdminPage';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import TeacherList from './features/teachers/TeacherList';
import TeacherDetailPage from './features/teachers/TeacherDetailPage';
import MyBookingsPage from './features/bookings/MyBookingsPage';
import Navbar from './components/Navbar';

const App = () => {
  // Access user from Redux store
  const user = useSelector((state) => state.auth.user);

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/teachers" element={<TeacherList />} />
        <Route path="/teachers/:id" element={<TeacherDetailPage />} />

        {/* Admin Routes */}
        <Route element={<ProtectedRoute user={user} role="admin" />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>

        {/* Teacher Routes */}
        <Route element={<ProtectedRoute user={user} role="teacher" />}>
          <Route path="/teacher" element={<TeacherPage teacherId={user?.id} />} />
          <Route path="/bookings" element={<MyBookingsPage />} />
        </Route>

        {/* Student Routes */}
        <Route element={<ProtectedRoute user={user} role="student" />}>
          <Route path="/student" element={<StudentPage studentId={user?.id} />} />
          <Route path="/bookings" element={<MyBookingsPage />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default App;