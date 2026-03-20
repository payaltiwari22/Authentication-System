import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', confirm_password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirm_password) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      await register(formData);
      // Wait for 1 second, then navigate
      setTimeout(() => {
          navigate('/login');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to register');
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h1>Create Account</h1>
        <p>Join us to get started</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input name="name" type="text" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input name="email" type="email" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input name="phone" type="text" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input name="password" type="password" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input name="confirm_password" type="password" onChange={handleChange} required />
        </div>
        
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating...' : 'Create Account'}
        </button>
      </form>
      
      <div className="auth-footer">
        <p>Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}
