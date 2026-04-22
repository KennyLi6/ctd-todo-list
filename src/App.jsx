import './App.css'
import TodoList from './TodoList'
import TodoForm from './TodoForm'
import { useState } from 'react'

function App() {

  const [todoList, setTodoList] = useState([])
  
  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm />
      <TodoList todoList={todoList} />
    </div>
  )
}

export default App
