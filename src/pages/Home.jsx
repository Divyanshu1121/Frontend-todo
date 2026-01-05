import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = 'http://localhost:3000';

const Home = () => {
    const [todos, setTodos] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [filter, setFilter] = useState('all');
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

    if (!user) return null;

    return (
        <div className="app">
            <header className="app-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1>✨ My Tasks</h1>
                    <nav>
                        {user.role === 'admin' && <Link to="/admin" style={{ marginRight: '10px', color: 'white' }}>Admin</Link>}
                        <button onClick={logout} style={{ padding: '5px 10px', fontSize: '0.9rem' }}>Logout</button>
                    </nav>
                </div>
                <p>Welcome, {user.email}</p>
            </header>

            <div className="todo-input-section">
                <input
                    type="text"
                    placeholder="What needs to be done?"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <button onClick={addTodo}>Add Task</button>
            </div>

            {totalTodos > 0 && (
                <div className="filter-section">
                    <button onClick={() => setFilter('all')}>All</button>
                    <button onClick={() => setFilter('active')}>Active</button>
                    <button onClick={() => setFilter('completed')}>Completed</button>
                </div>
            )}

            <div className="todo-list">
                {filteredTodos.map((todo) => (
                    <div key={todo._id} className="todo-item">
                        <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => toggleTodo(todo._id)}
                        />
                        <span>{todo.text}</span>
                        <button onClick={() => deleteTodo(todo._id)}>Delete</button>
                    </div>
                ))}
            </div>

            {completedCount > 0 && (
                <button onClick={clearCompleted}>
                    Clear Completed ({completedCount})
                </button>
            )}
        </div>
    );
};

export default Home;
