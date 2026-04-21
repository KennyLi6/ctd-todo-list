import TodoListItem from "./TodoListItem";

function TodoList({todoList}) {

    return (
        <ul>
            {todoList.map((todo) => <li key={todo.id}>{todo.title}</li>)}
        </ul>
    );
}

export default TodoList;