import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

const API_URL = 'http://localhost:3000';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
            login(res.data);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleAdminLogin = async () => {
        setError('');
        setLoading(true);

        try {
            const res = await axios.post(`${API_URL}/api/auth/login`, {
                email: 'admin@example.com',
                password: 'admin123'
            });
            login(res.data);
            navigate('/');
        } catch (err) {
            setError('Failed to login as admin');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">✨ Welcome Back</h1>
                    <p className="auth-subtitle">Sign in to manage your tasks</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            className="form-input"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <div className="password-input-wrapper">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                className="form-input"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? <LoadingSpinner /> : 'Sign In'}
                    </button>
                </form>

                <div className="auth-divider">
                    <span>OR</span>
                </div>

                <button
                    type="button"
                    onClick={handleAdminLogin}
                    className="admin-login-button"
                    disabled={loading}
                >
                    {loading ? <LoadingSpinner /> : '🔐 Login as Admin'}
                </button>

                <div className="auth-footer">
                    Don't have an account?{' '}
                    <Link to="/register" className="auth-link">
                        Create one now
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
