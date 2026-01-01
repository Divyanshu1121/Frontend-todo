import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const API_URL = 'http://localhost:3000'

function App() {
  const [todos, setTodos] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [filter, setFilter] = useState('all')

  // Fetch todos on load
  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const res = await axios.get(`${API_URL}/todos`)
      setTodos(res.data)
    } catch (error) {
      console.error('Failed to fetch todos', error)
    }
  }

  const addTodo = async () => {
    if (!inputValue.trim()) return

    try {
      const res = await axios.post(`${API_URL}/todos`, {
        text: inputValue.trim()
      })
      setTodos(prev => [res.data, ...prev]) // safe update
      setInputValue('')
    } catch (error) {
      console.error('Failed to add todo', error)
    }
  }

  const toggleTodo = async (id) => {
    const todo = todos.find(t => t._id === id)
    if (!todo) return

    try {
      const res = await axios.put(`${API_URL}/todos/${id}`, {
        completed: !todo.completed
      })
      setTodos(todos.map(t => (t._id === id ? res.data : t)))
    } catch (error) {
      console.error('Failed to update todo', error)
    }
  }

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/todos/${id}`)
      setTodos(todos.filter(t => t._id !== id))
    } catch (error) {
      console.error('Failed to delete todo', error)
    }
  }

  const clearCompleted = async () => {
    const completedTodos = todos.filter(t => t.completed)

    try {
      await Promise.all(
        completedTodos.map(t =>
          axios.delete(`${API_URL}/todos/${t._id}`)
        )
      )
      setTodos(todos.filter(t => !t.completed))
    } catch (error) {
      console.error('Failed to clear completed todos', error)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') addTodo()
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const totalTodos = todos.length
  const activeTodos = todos.filter(t => !t.completed).length
  const completedTodos = todos.filter(t => t.completed).length

  return (
    <div className="app">
      <header className="app-header">
        <h1>✨ My Tasks</h1>
        <p>Organize your day, one task at a time</p>
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
        {filteredTodos.map(todo => (
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

      {completedTodos > 0 && (
        <button onClick={clearCompleted}>
          Clear Completed ({completedTodos})
        </button>
      )}
    </div>
  )
}

export default App
