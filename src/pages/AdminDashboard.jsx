import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

const API_URL = 'http://localhost:3000';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }
        fetchUsers();
    }, [user, navigate]);

    const fetchUsers = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const res = await axios.get(`${API_URL}/api/admin/users`, config);
            setUsers(res.data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleBlockUser = async (id, currentStatus) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            await axios.patch(
                `${API_URL}/api/admin/users/${id}/block`,
                { isBlocked: !currentStatus },
                config
            );
            setUsers(users.map(u => (u._id === id ? { ...u, isBlocked: !currentStatus } : u)));
        } catch (error) {
            console.error('Failed to update user status', error);
        }
    };

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalUsers = users.length;
    const activeUsers = users.filter(u => !u.isBlocked).length;
    const blockedUsers = users.filter(u => u.isBlocked).length;
    const adminUsers = users.filter(u => u.role === 'admin').length;

    if (loading) {
        return <LoadingSpinner centered size="large" />;
    }

    return (
        <div className="admin-dashboard">
            {/* Header */}
            <div className="admin-header">
                <h1 className="admin-title">👨‍💼 Admin Dashboard</h1>
                <div className="admin-nav">
                    <Link
                        to="/"
                        style={{
                            color: 'var(--accent-primary)',
                            textDecoration: 'none',
                            fontWeight: 600,
                            transition: 'color var(--transition-base)'
                        }}
                    >
                        🏠 Home
                    </Link>
                    <button
                        onClick={logout}
                        style={{
                            padding: '0.5em 1.25em',
                            fontSize: '0.9rem',
                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Statistics */}
            <div className="admin-stats">
                <div className="admin-stat-card">
                    <span className="admin-stat-value">{totalUsers}</span>
                    <span className="admin-stat-label">Total Users</span>
                </div>
                <div className="admin-stat-card">
                    <span className="admin-stat-value">{activeUsers}</span>
                    <span className="admin-stat-label">Active Users</span>
                </div>
                <div className="admin-stat-card">
                    <span className="admin-stat-value">{blockedUsers}</span>
                    <span className="admin-stat-label">Blocked Users</span>
                </div>
                <div className="admin-stat-card">
                    <span className="admin-stat-value">{adminUsers}</span>
                    <span className="admin-stat-label">Administrators</span>
                </div>
            </div>

            {/* User Management Section */}
            <div className="admin-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                    <h2 className="admin-section-title">👥 User Management</h2>
                    <input
                        type="text"
                        placeholder="🔍 Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            padding: '0.625em 1em',
                            borderRadius: 'var(--radius-md)',
                            border: '2px solid var(--bg-tertiary)',
                            background: 'var(--bg-primary)',
                            color: 'var(--text-primary)',
                            fontSize: '0.9375rem',
                            width: '300px',
                            maxWidth: '100%'
                        }}
                    />
                </div>

                {filteredUsers.length > 0 ? (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(u => (
                                    <tr key={u._id}>
                                        <td>{u.email}</td>
                                        <td>
                                            <span className="user-role">
                                                {u.role === 'admin' ? '👑 ' : '👤 '}
                                                {u.role}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`user-status ${u.isBlocked ? 'blocked' : 'active'}`}>
                                                {u.isBlocked ? '🚫 Blocked' : '✅ Active'}
                                            </span>
                                        </td>
                                        <td>
                                            {u.role !== 'admin' && (
                                                <button
                                                    onClick={() => toggleBlockUser(u._id, u.isBlocked)}
                                                    className={`action-button ${u.isBlocked ? 'unblock-button' : 'block-button'}`}
                                                >
                                                    {u.isBlocked ? '✓ Unblock' : '⛔ Block'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">🔍</div>
                        <h3 className="empty-title">No users found</h3>
                        <p className="empty-text">Try adjusting your search criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
