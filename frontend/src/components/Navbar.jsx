import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 z-50 w-full text-white bg-gray-900 shadow-md">
      <div className="container flex items-center justify-between p-4 mx-auto">
        <div className="flex gap-6">
          <Link to="/" className="hover:underline">Home</Link>

          {isAuthenticated && user?.role === 'Student' && (
            <>
              <Link to="/teachers" className="hover:underline">Teachers</Link>
              <Link to="/bookings" className="hover:underline">My Classes</Link>
            </>
          )}

          {isAuthenticated && user?.role === 'Teacher' && (
            <>
              <Link to="/teacher/availability" className="hover:underline">My Availability</Link>
              <Link to="/bookings" className="hover:underline">Classes</Link>
            </>
          )}

          {isAuthenticated && user?.role === 'Admin' && (
            <>
              <Link to="/admin" className="hover:underline">Admin Panel</Link>
            </>
          )}
        </div>

        <div>
          {isAuthenticated ? (
            <button onClick={handleLogout} className="hover:underline">
              Logout
            </button>
          ) : (
            <Link to="/login" className="hover:underline">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
