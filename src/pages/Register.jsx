import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

const API_URL = 'http://localhost:3000';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post(`${API_URL}/api/auth/register`, { email, password });
            login(res.data);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
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

    const getPasswordStrength = () => {
        if (password.length === 0) return '';
        if (password.length < 6) return 'Weak';
        if (password.length < 10) return 'Medium';
        return 'Strong';
    };

    const passwordStrength = getPasswordStrength();

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">🚀 Get Started</h1>
                    <p className="auth-subtitle">Create your account to start organizing</p>
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
                                placeholder="Create a strong password"
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
                        {password && (
                            <small style={{
                                color: passwordStrength === 'Strong' ? 'var(--success)' :
                                    passwordStrength === 'Medium' ? 'var(--warning)' :
                                        'var(--danger)',
                                fontSize: '0.875rem',
                                marginTop: '0.25rem',
                                display: 'block'
                            }}>
                                Password strength: {passwordStrength}
                            </small>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <div className="password-input-wrapper">
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                className="form-input"
                                placeholder="Re-enter your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                            >
                                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? <LoadingSpinner /> : 'Create Account'}
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
                    Already have an account?{' '}
                    <Link to="/login" className="auth-link">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
