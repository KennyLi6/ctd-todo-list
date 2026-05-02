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
      isCompeleted: false
    }

    setTodoList(previous => [newTodo, ...previous])
  }

  function completeTodo(id) {
    let todo = todoList.map(todo => {
      if (todo.id == id) {
        return todo;
      }
    })
    console.log(todo)
    if (todo !== undefined) {
      todo = {...todo, isCompeleted: true}
      setTodoList(previous => [todo, ...previous])
    }
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
