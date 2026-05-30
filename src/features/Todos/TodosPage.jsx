import { useEffect, useReducer } from 'react'
import TodoList from './TodoList/TodoList'
import TodoForm from './TodoForm'
import SortBy from '../../shared/SortBy'
import useDebounce from '../../utils/useDebounce'
import FilterInput from '../../shared/FilterInput'
import {
    todoReducer,
    initalTodoState,
    TODO_ACTIONS,
} from '../../reducers/todoReducer'

function TodosPage({ token }) {
    const [state, dispatch] = useReducer(todoReducer, initalTodoState);
    const {
        todoList,
        error,
        filterError,
        isTodoListLoading,
        sortBy,
        sortDirection,
        filterTerm,
        dataVersion,
    } = state;
    const debouncedFilterTerm = useDebounce(filterTerm, 300);
  
    useEffect(() => {
        async function fetchTodos() {
            dispatch({ type: TODO_ACTIONS.FETCH_START });
            
            try {
                const options = {
                    method: 'GET',
                    headers: { 'X-CSRF-TOKEN': token },
                    credentials: 'include'
                };
                const paramsObject = {
                    sortBy,
                    sortDirection}
                if (debouncedFilterTerm) {
                    paramsObject.find = debouncedFilterTerm;
                }
                const params = new URLSearchParams(paramsObject);
                
                const response = await fetch(`/api/tasks?${params}`, options);
                if (response.status === 401) {
                    throw new Error(`Unauthorized`);
                }
                if (!response.ok) {
                    throw new Error(response.message || `Failed to fetch todos`);
                }
                const todos = await response.json();
                dispatch({ 
                    type: TODO_ACTIONS.FETCH_SUCCESS,
                    payload: { todoList: todos }
                });
            } catch (error) {
                if (debouncedFilterTerm || sortBy !== 'creationDate' || sortDirection !== 'desc') {
                    dispatch({ 
                        type: TODO_ACTIONS.FETCH_ERROR,
                        payload: { filterError: `Error filtering/sorting todos: ${error.message}`}
                    });
                } else {
                    dispatch({
                        type: TODO_ACTIONS.FETCH_ERROR,
                        payload: { error: `Error fetching todos: ${error.message}`}
                    });
                }
            }
        }
        if (token) {fetchTodos();}
    }, [token, sortBy, sortDirection, debouncedFilterTerm]);

    async function addTodo(todoTitle) {
        const tempId = Date.now();
        const newTodo = {
            id: tempId, 
            title: todoTitle,
            isCompleted: false
        }

        dispatch({
            type: TODO_ACTIONS.ADD_TODO_START,
            payload: { todoList: previous => [newTodo, ...previous] }
        })

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

            dispatch({
                type: TODO_ACTIONS.ADD_TODO_SUCCESS,
                payload: { 
                    todoList: (previous) => previous.map((todo) => (todo.id === tempId ? savedTodo : todo)),
                    dataVersion: previous => previous + 1,
                },
            });
        } catch (error) {
            dispatch({
                type: TODO_ACTIONS.ADD_TODO_ERROR,
                payload: {
                    todoList: (previous) => previous.filter((todo) => todo.id !== tempId),
                    error: `Error adding todo: ${newTodo.title} | Error message: ${error.message}`,
                },
            });
        }
    }

    async function completeTodo(id) {
        const originalTodo = todoList.find((todo) => todo.id === id);
        
        const updatedTodoList = todoList.map(todo => (
        todo.id === id ? 
            todo = {...todo, isCompleted: true} :
            todo
        ))
        dispatch({
            type: TODO_ACTIONS.COMPLETE_TODO_START,
            payload: { todoList: updatedTodoList},
        });

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
            dispatch({
                type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS,
                payload: { dataVersion: previous => previous + 1 }
            })
        } catch (error) {
            dispatch({
                type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
                payload: {
                    todoList: (previous) => previous.map((todo) => (todo.id === id ? originalTodo : todo)),
                    error: `Error completing todo: ${originalTodo.title} | Error message: ${error.message}`,
                }
            });
        }
    }

    async function updateTodo(editedTodo) {
        const originalTodo = todoList.find((todo) => (todo.id === editedTodo.id));

        const updatedTodos = todoList.map(todo => (
        todo.id === editedTodo.id ? 
            {...editedTodo} :
            todo
        ))
        dispatch({
            type: TODO_ACTIONS.UPDATE_TODO_START,
            payload: { todoList: updatedTodos },
        });

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
            dispatch({
                type: TODO_ACTIONS.UPDATE_TODO_SUCCESS,
                payload: { dataVersion: previous => previous + 1 }
            })
        } catch (error) {
            dispatch({
                type: TODO_ACTIONS.UPDATE_TODO_ERROR,
                payload: {
                    todoList: (previous) => previous.map((todo) => todo.id === editedTodo.id? originalTodo : todo),
                    error: `Error updating todo: ${editedTodo.title} | Error message: ${error.message}`,
                },
            });
        }
    }

    const handleFilterChange = (newTerm) => { 
        dispatch({ 
            type: TODO_ACTIONS.SET_FILTER,
            payload: { filterTerm: newTerm },
        });
    };

    return (
        <div>
            {error && (
                <div>
                    <p>{error}</p>
                    <button onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_ERROR })}>Clear Error</button>
                </div>
            )}
            {filterError && (
                <div>
                    <button onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_FILTER_ERROR })}>Clear Filter Error</button>
                    <p>{filterError}</p>
                    <button onClick={() => dispatch({ type: TODO_ACTIONS.RESET_FILTERS })}>Reset Filters</button>
                </div>
            )}
            {isTodoListLoading && <div>Loading todos...</div>}
            <SortBy 
                onSortByChange={(newSortBy) => {
                    dispatch({
                        type: TODO_ACTIONS.SET_SORT,
                        payload: { sortBy: newSortBy, sortDirection }
                    })
                }}
                onSortDirectionChange={(newSortDirection) => {
                    dispatch({
                        type: TODO_ACTIONS.SET_SORT,
                        payload: { sortBy, sortDirection: newSortDirection }
                    })
                }}
            />
            <FilterInput 
                filterTerm={filterTerm}
                onFilterChange={handleFilterChange}
            />
            <TodoForm onAddTodo={addTodo}/>
            <TodoList 
                todoList={todoList} 
                onCompleteTodo={completeTodo}
                onUpdateTodo={updateTodo}
                dataVersion={dataVersion}
            />
        </div>
    )
}

export default TodosPage;