import { useEffect, useState } from 'react'
import TodoList from './TodoList/TodoList'
import TodoForm from './TodoForm'

function TodosPage({ token }) {
    const [todoList, setTodoList] = useState([])
    const [error, setError] = useState("");
    const [isTodoListLoading, setIsTodoListLoading] = useState(false);
    const [sortBy, setSortBy] = useState('creationDate');
    const [sortDirection, setSortDirection] = useState('desc');
  
    useEffect(() => {
        async function fetchTodos() {
            setIsTodoListLoading(true);
            
            try {
                const options = {
                    method: 'GET',
                    headers: { 'X-CSRF-TOKEN': token },
                    credentials: 'include'
                };
                const params = new URLSearchParams({
                    sortBy,
                    sortDirection
                });
                const response = await fetch(`/api/tasks?${params}`, options);
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
    }, [token, sortBy, sortDirection]);

    async function addTodo(todoTitle) {
        const tempId = Date.now();
        const newTodo = {
            id: tempId, 
            title: todoTitle,
            isCompleted: false
        }

        setTodoList(previous => [newTodo, ...previous])

        try {
            const options = {
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
            };
            const response = await fetch('/api/tasks', options);
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
    }

    async function completeTodo(id) {
        const originalTodo = todoList.find((todo) => todo.id === id);
        
        const updatedTodoList = todoList.map(todo => (
        todo.id === id ? 
            todo = {...todo, isCompleted: true} :
            todo
        ))
        setTodoList(updatedTodoList);

        try {
            const options = {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token,
                },
                body: JSON.stringify({
                    isCompleted: true,
                }),
                credentials: 'include'
            };
            const response = await fetch(`/api/tasks/${id}`, options);
            if (!response.ok) {
                throw new Error(response.message || 'Failed to complete todo');
            }
        } catch (error) {
            setError(
                `Error completing todo: ${originalTodo.title} | Error message: ${error.message}`
            );
            setTodoList((previous) =>
                previous.map((todo) => (todo.id === id ? originalTodo : todo))
            );
        }
    }

    async function updateTodo(editedTodo) {
        const originalTodo = todoList.find((todo) => (todo.id === editedTodo.id));

        const updatedTodos = todoList.map(todo => (
        todo.id === editedTodo.id ? 
            {...editedTodo} :
            todo
        ))
        setTodoList(updatedTodos)

        try {
            const options = {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token,
                },
                body: JSON.stringify({
                    title: editedTodo.title,
                    isCompleted: editedTodo.isCompleted,
                }),
                credentials: 'include'
            };
            const response = await fetch(`/api/tasks/${editedTodo.id}`, options);
            if (!response.ok) {
                throw new Error (response.message || 'Failed to update todo');
            }
        } catch (error) {
            setError(
                `Error updating todo: ${editedTodo.title} | Error message: ${error.message}`
            );
            setTodoList((previous) => 
                previous.map((todo) =>
                    todo.id === editedTodo.id? originalTodo : todo
                )
            );
        }
    }

    return (
        <div>
            {error && (
                <div>
                    <p>{error}</p>
                    <button onClick={() => setError('')}>Clear Error</button>
                </div>
            )}
            {isTodoListLoading && <div>Loading todos...</div>}
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