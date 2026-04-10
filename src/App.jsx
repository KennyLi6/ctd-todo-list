import './App.css'
import TodoList from './TodoList'

function App() {

  const todoList = [
    {id: 1, title: "read lesson"},
    {id: 2, title: "view resources"},
    {id: 3, title: "code app"}
  ]

  return (
    <div>
      <h1>My Todos</h1>
      <TodoList />
    </div>
  )
}

export default App
