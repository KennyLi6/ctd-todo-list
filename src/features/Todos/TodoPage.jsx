import { useEffect, useState } from 'react'
import TodoList from './TodoList/TodoList'
import TodoForm from './TodoForm'

function TodosPage({ token }) {
    const [todoList, setTodoList] = useState([])
    const [error, setError] = useState("");
    const [isTodoListLoading, setIsTodoListLoading] = useState(false);
  
    useEffect(() => {
        async function fetchTodos(event) {
            setIsTodoListLoading(true);
            try {
                const response = await fetch('/api/tasks', {
                    method: 'GET',
                    headers: { 'X-CSRF-TOKEN': token },
                    credentials: 'include'
                })
                if (response.status === 401) {
                    throw new Error(`Unauthorized`);
                }
                if (!response.ok) {
                    throw new Error(response.message || `Failed to fetch todos`);
                }
                const data = await response.json();
                setTodoList(data.tasks);
            } catch (error) {
                setError(`Error: ${error.name} | ${error.message}`);
            } finally {
                setIsTodoListLoading(false);
            }
        }
        if (token) {fetchTodos();}
    }, [token]);

    async function addTodo(todoTitle) {
        const tempId = Date.now();
        const newTodo = {
            id: tempId, 
            title: todoTitle,
            isCompleted: false
        }

        setTodoList(previous => [newTodo, ...previous])

        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token,
                },
                body: JSON.stringify({
                    title: newTodo.title,
                    isCompleted: newTodo.isCompleted,
                }),
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error(response.message || 'Failed to add todo');
            }
            const savedTodo = await response.json();

            setTodoList((previous) =>
                previous.map((todo) => (todo.id === tempId ? savedTodo : todo))
            );
        } catch (error) {
            setError(
                `Error adding todo: ${newTodo.title} | Error message: ${error.message}`
            );
            setTodoList((previous) =>
                previous.filter((todo) => todo.id !== tempId)
            );
        }
    };

    function completeTodo(id) {
        const updatedTodoList = todoList.map(todo => (
        todo.id === id ? 
            todo = {...todo, isCompleted: true} :
            todo
        ))
        setTodoList(updatedTodoList);
    }

    function updateTodo(editedTodo) {
        const updatedTodos = todoList.map(todo => (
        todo.id === editedTodo.id ? 
            {...editedTodo} :
            todo
        ))
        setTodoList(updatedTodos)
    }

    return (
        <div>
            <TodoForm onAddTodo={addTodo}/>
            <TodoList 
                todoList={todoList} 
                onCompleteTodo={completeTodo}
                onUpdateTodo={updateTodo}
            />
        </div>
    )
}

export default TodosPage;