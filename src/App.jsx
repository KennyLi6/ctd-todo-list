import './App.css'
import TodoList from './TodoList'
import TodoForm from './TodoForm'
import { useState } from 'react'

function App() {

  const [todoList, setTodoList] = useState([])
  
  function addTodo(todoTitle) {
    const newTodo = {
      id: Date.now(), 
      title: todoTitle,
      isCompleted: false
    }

    setTodoList(previous => [newTodo, ...previous])
  }

  function completeTodo(id) {
    const todoList = todoList.map(todo => (
      todo.id == id ? 
        todo = {...todo, isCompleted: true} :
        todo
    ))
    setTodoList(todoList);
  }

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={addTodo}/>
      <TodoList todoList={todoList} onCompleteTodo={completeTodo}/>
    </div>
  )
}

export default App
