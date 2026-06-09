import { useCallback, useEffect, useReducer } from 'react'
import TodoList from './TodoList/TodoList'
import TodoForm from './TodoForm'
import SortBy from '../../shared/SortBy'
import useDebounce from '../../utils/useDebounce'
import FilterInput from '../../shared/FilterInput'
import {
    todoReducer,
    initialTodoState,
    TODO_ACTIONS,
} from '../../reducers/todoReducer'
import { useAuth } from '../../contexts/AuthContext'

function TodosPage() {
    const { token } = useAuth();
    const [state, dispatch] = useReducer(todoReducer, initialTodoState);
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
                    payload: { todoList: todos.tasks }
                });
            } catch (error) {
                const isFilterError = debouncedFilterTerm || sortBy !== 'creationDate' || sortDirection !== 'desc';
                dispatch({ 
                    type: TODO_ACTIONS.FETCH_ERROR,
                    payload: { message: isFilterError 
                        ? `Error filtering/sorting todos: ${error.message}`
                        : `Error fetching todos: ${error.message}`,
                        isFilterError,
                    },
                });
            }
        }
        if (token) { fetchTodos(); }
    }, [token, sortBy, sortDirection, debouncedFilterTerm, dataVersion]);

    async function addTodo(todoTitle) {
        const tempId = Date.now();
        const newTodo = {
            id: tempId, 
            title: todoTitle,
            isCompleted: false
        }

        dispatch({
            type: TODO_ACTIONS.ADD_TODO_START,
            payload: { tempTodo: newTodo },
        });

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
                payload: { tempId, savedTodo },
            });
            invalidateCache();
        } catch (error) {
            dispatch({
                type: TODO_ACTIONS.ADD_TODO_ERROR,
                payload: {
                    tempId,
                    error: `Error adding todo: ${newTodo.title} | Error message: ${error.message}`,
                },
            });
        }
    }

    async function completeTodo(id) {
        const originalTodo = todoList.find((todo) => todo.id === id);
        
        dispatch({
            type: TODO_ACTIONS.COMPLETE_TODO_START,
            payload: { id },
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
            dispatch({ type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS });
            invalidateCache();
        } catch (error) {
            dispatch({
                type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
                payload: {
                    id,
                    originalTodo,
                    error: `Error completing todo: ${originalTodo.title} | Error message: ${error.message}`,
                },
            });
        }
    }

    async function updateTodo(editedTodo) {
        const originalTodo = todoList.find((todo) => (todo.id === editedTodo.id));

        dispatch({
            type: TODO_ACTIONS.UPDATE_TODO_START,
            payload: { editedTodo },
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
            dispatch({ type: TODO_ACTIONS.UPDATE_TODO_SUCCESS });
            invalidateCache();
        } catch (error) {
            dispatch({
                type: TODO_ACTIONS.UPDATE_TODO_ERROR,
                payload: {
                    id: editedTodo.id,
                    originalTodo,
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
    }

    const invalidateCache = useCallback(() => {
        dispatch({ type: TODO_ACTIONS.INVALIDATE_CACHE });
    }, []);

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
                sortBy={sortBy}
                sortDirection={sortDirection}
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