import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos')
    return savedTodos ? JSON.parse(savedTodos) : []
  })
  const [inputValue, setInputValue] = useState('')
  const [filter, setFilter] = useState('all')

  // Save to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (inputValue.trim() === '') return
    
    const newTodo = {
      id: Date.now(),
      text: inputValue.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    }
    
    setTodos([newTodo, ...todos])
    setInputValue('')
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed))
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }

  // Filter todos based on current filter
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  // Calculate stats
  const totalTodos = todos.length
  const activeTodos = todos.filter(todo => !todo.completed).length
  const completedTodos = todos.filter(todo => todo.completed).length

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">✨ My Tasks</h1>
        <p className="app-subtitle">Organize your day, one task at a time</p>
      </header>

      {/* Input Section */}
      <div className="todo-input-section">
        <div className="todo-input-wrapper">
          <input
            type="text"
            className="todo-input"
            placeholder="What needs to be done?"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            id="todo-input"
          />
          <button className="add-button" onClick={addTodo} id="add-todo-btn">
            Add Task
          </button>
        </div>
      </div>

      {/* Stats Section */}
      {totalTodos > 0 && (
        <div className="stats-section">
          <div className="stat-card">
            <span className="stat-number">{totalTodos}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{activeTodos}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{completedTodos}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
      )}

      {/* Filter Buttons */}
      {totalTodos > 0 && (
        <div className="filter-section">
          <button
            className={`filter-button ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
            id="filter-all"
          >
            All Tasks
          </button>
          <button
            className={`filter-button ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
            id="filter-active"
          >
            Active
          </button>
          <button
            className={`filter-button ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
            id="filter-completed"
          >
            Completed
          </button>
        </div>
      )}

      {/* Todo List */}
      <div className="todo-list">
        {filteredTodos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              {filter === 'completed' && totalTodos > 0 ? '🎯' : '📝'}
            </div>
            <h3 className="empty-title">
              {filter === 'completed' && totalTodos > 0
                ? 'No completed tasks yet'
                : filter === 'active' && totalTodos > 0
                ? 'All tasks completed! 🎉'
                : 'No tasks yet'}
            </h3>
            <p className="empty-text">
              {filter === 'all' || totalTodos === 0
                ? 'Add a task above to get started'
                : filter === 'active'
                ? 'Great job finishing everything!'
                : 'Complete some tasks to see them here'}
            </p>
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className={`todo-item ${todo.completed ? 'completed' : ''}`}
            >
              <input
                type="checkbox"
                className="todo-checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                id={`todo-${todo.id}`}
              />
              <span className="todo-text">{todo.text}</span>
              <div className="todo-actions">
                <button
                  className="delete-button"
                  onClick={() => deleteTodo(todo.id)}
                  id={`delete-${todo.id}`}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Clear Completed Button */}
      {completedTodos > 0 && (
        <div className="clear-all-section">
          <button className="clear-all-button" onClick={clearCompleted} id="clear-completed-btn">
            Clear Completed ({completedTodos})
          </button>
        </div>
      )}
    </div>
  )
}

export default App
