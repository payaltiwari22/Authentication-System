import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="auth-card profile-card">
      <div className="auth-header">
        <h1>Your Profile</h1>
        <p>Welcome to your dashboard</p>
      </div>

      <div className="avatar-circle">
        {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
      </div>

      <div className="profile-info">
        <div className="info-row">
          <span className="info-label">Full Name</span>
          <span className="info-value">{user.name || 'Not provided'}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Email Address</span>
          <span className="info-value">{user.email}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Phone Number</span>
          <span className="info-value">{user.phone || 'Not provided'}</span>
        </div>
      </div>

      <button onClick={handleLogout} className="btn" style={{backgroundColor: 'var(--danger)', color: 'white'}}>
        Sign Out
      </button>
    </div>
  );
}
