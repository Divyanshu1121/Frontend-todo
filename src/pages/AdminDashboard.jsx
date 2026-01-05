import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3000';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const { user } = useContext(AuthContext);
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

    return (
        <div className="admin-dashboard">
            <h2>Admin Dashboard</h2>
            <h3>Users Management</h3>
            <table>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u._id}>
                            <td>{u.email}</td>
                            <td>{u.role}</td>
                            <td>{u.isBlocked ? 'Blocked' : 'Active'}</td>
                            <td>
                                {u.role !== 'admin' && (
                                    <button onClick={() => toggleBlockUser(u._id, u.isBlocked)}>
                                        {u.isBlocked ? 'Unblock' : 'Block'}
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
