import './App.css'
import TodoList from './TodoList'
import TodoForm from './TodoForm'
import { useState } from 'react'

const todos = [
  {id: 1, title: "read lesson"},
  {id: 2, title: "view resources"},
  {id: 3, title: "code app"}
]

function App() {

  const [todoList, setTodoList] = useState(todos)
  
  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm />
      <TodoList todoList={todoList} />
    </div>
  )
}

export default App
