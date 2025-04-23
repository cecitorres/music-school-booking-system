import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 z-50 w-full h-16 text-gray-200 bg-gray-800 shadow-lg">
      <div className="container flex items-center justify-between h-full p-4 mx-auto">
        <div className="flex gap-6">
          <Link to="/" className="transition hover:text-white">Home</Link>

          {isAuthenticated && user?.role === 'Student' && (
            <>
              <Link to="/teachers" className="transition hover:text-white">Teachers</Link>
              <Link to="/bookings" className="transition hover:text-white">My Classes</Link>
            </>
          )}

          {isAuthenticated && user?.role === 'Teacher' && (
            <>
              <Link to="/teacher/availability" className="transition hover:text-white">My Availability</Link>
              <Link to="/bookings" className="transition hover:text-white">Classes</Link>
              <Link to="/register" className="transition hover:text-white">Register</Link>
            </>
          )}

          {isAuthenticated && user?.role === 'Admin' && (
            <>
              <Link to="/teachers" className="transition hover:text-white">Teachers</Link>
              <Link to="/register" className="transition hover:text-white">Register</Link>
            </>
          )}
        </div>

        <div>
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="transition hover:text-white"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="transition hover:text-white">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
