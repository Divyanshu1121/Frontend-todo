import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

const API_URL = 'http://localhost:3000';

const Home = () => {
    const [todos, setTodos] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchTodos();
    }, [user, navigate]);

    const fetchTodos = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const res = await axios.get(`${API_URL}/api/todos`, config);
            setTodos(res.data);
        } catch (error) {
            console.error('Failed to fetch todos', error);
        } finally {
            setLoading(false);
        }
    };

    const addTodo = async () => {
        if (!inputValue.trim()) return;

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const res = await axios.post(
                `${API_URL}/api/todos`,
                { text: inputValue.trim() },
                config
            );
            setTodos((prev) => [res.data, ...prev]);
            setInputValue('');
        } catch (error) {
            console.error('Failed to add todo', error);
        }
    };

    const toggleTodo = async (id) => {
        const todo = todos.find((t) => t._id === id);
        if (!todo) return;

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const res = await axios.put(
                `${API_URL}/api/todos/${id}`,
                { completed: !todo.completed },
                config
            );
            setTodos(todos.map((t) => (t._id === id ? res.data : t)));
        } catch (error) {
            console.error('Failed to update todo', error);
        }
    };

    const deleteTodo = async (id) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            await axios.delete(`${API_URL}/api/todos/${id}`, config);
            setTodos(todos.filter((t) => t._id !== id));
        } catch (error) {
            console.error('Failed to delete todo', error);
        }
    };

    const clearCompleted = async () => {
        const completedTodos = todos.filter((t) => t.completed);
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            await Promise.all(
                completedTodos.map((t) =>
                    axios.delete(`${API_URL}/api/todos/${t._id}`, config)
                )
            );
            setTodos(todos.filter((t) => !t.completed));
        } catch (error) {
            console.error('Failed to clear completed todos', error);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') addTodo();
    };

    const filteredTodos = todos.filter((todo) => {
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
    });

    const totalTodos = todos.length;
    const completedCount = todos.filter((t) => t.completed).length;
    const activeCount = totalTodos - completedCount;
    const completionRate = totalTodos > 0 ? Math.round((completedCount / totalTodos) * 100) : 0;

    if (!user) return null;

    if (loading) {
        return <LoadingSpinner centered size="large" />;
    }

    return (
        <div className="app">
            {/* Header */}
            <header className="app-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                    <h1 style={{ margin: 0 }}>✨ My Tasks</h1>
                    <nav style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
                        {user.role === 'admin' && (
                            <Link
                                to="/admin"
                                style={{
                                    color: 'var(--accent-primary)',
                                    textDecoration: 'none',
                                    fontWeight: 600,
                                    transition: 'color var(--transition-base)'
                                }}
                            >
                                👨‍💼 Admin
                            </Link>
                        )}
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
                    </nav>
                </div>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                    Welcome back, <strong style={{ color: 'var(--accent-primary)' }}>{user.email}</strong>
                </p>
            </header>

            {/* Statistics Dashboard */}
            {totalTodos > 0 && (
                <div className="stats-section">
                    <div className="stat-card">
                        <span className="stat-number">{totalTodos}</span>
                        <span className="stat-label">Total Tasks</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">{activeCount}</span>
                        <span className="stat-label">Active</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">{completedCount}</span>
                        <span className="stat-label">Completed</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">{completionRate}%</span>
                        <span className="stat-label">Progress</span>
                    </div>
                </div>
            )}

            {/* Todo Input */}
            <div className="todo-input-section">
                <div className="todo-input-wrapper">
                    <input
                        type="text"
                        className="todo-input"
                        placeholder="What needs to be done? ✍️"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button onClick={addTodo} className="add-button">
                        ➕ Add Task
                    </button>
                </div>
            </div>

            {/* Filter Buttons */}
            {totalTodos > 0 && (
                <div className="filter-section">
                    <button
                        onClick={() => setFilter('all')}
                        className={`filter-button ${filter === 'all' ? 'active' : ''}`}
                    >
                        📋 All
                    </button>
                    <button
                        onClick={() => setFilter('active')}
                        className={`filter-button ${filter === 'active' ? 'active' : ''}`}
                    >
                        ⏳ Active
                    </button>
                    <button
                        onClick={() => setFilter('completed')}
                        className={`filter-button ${filter === 'completed' ? 'active' : ''}`}
                    >
                        ✅ Completed
                    </button>
                </div>
            )}

            {/* Todo List */}
            {filteredTodos.length > 0 ? (
                <div className="todo-list">
                    {filteredTodos.map((todo) => (
                        <div
                            key={todo._id}
                            className={`todo-item ${todo.completed ? 'completed' : ''}`}
                        >
                            <input
                                type="checkbox"
                                className="todo-checkbox"
                                checked={todo.completed}
                                onChange={() => toggleTodo(todo._id)}
                            />
                            <span className="todo-text">{todo.text}</span>
                            <div className="todo-actions">
                                <button
                                    onClick={() => deleteTodo(todo._id)}
                                    className="delete-button"
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-icon">
                        {filter === 'all' ? '📝' : filter === 'active' ? '🎯' : '🎉'}
                    </div>
                    <h3 className="empty-title">
                        {filter === 'all'
                            ? 'No tasks yet'
                            : filter === 'active'
                                ? 'No active tasks'
                                : 'No completed tasks'}
                    </h3>
                    <p className="empty-text">
                        {filter === 'all'
                            ? 'Add your first task to get started!'
                            : filter === 'active'
                                ? 'All tasks are completed! Great job!'
                                : 'Complete some tasks to see them here'}
                    </p>
                </div>
            )}

            {/* Clear Completed Button */}
            {completedCount > 0 && (
                <div className="clear-all-section">
                    <button onClick={clearCompleted} className="clear-all-button">
                        🧹 Clear Completed ({completedCount})
                    </button>
                </div>
            )}
        </div>
    );
};

export default Home;
