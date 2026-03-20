import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await googleLogin(credentialResponse.credential);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.detail || 'Google login failed');
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h1>Welcome Back</h1>
        <p>Sign in to your account to continue</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email Address</label>
          <input 
            type="email" 
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      
      <div className="divider">OR</div>
      
      <div style={{display: 'flex', justifyContent: 'center'}}>
        {/* The GoogleLogin component is standard but requires @react-oauth/google configured properly */}
        {/* We will render a custom button layout to match our style, but since it's an iframe we 
            often wrap it. Standard GoogleLogin renders the official button. */}
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setError('Google Login Failed')}
          useOneTap
        />
      </div>

      <div className="auth-footer">
        <p><Link to="/forgot-password">Forgot password?</Link></p>
        <p style={{marginTop: '1rem'}}>
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
