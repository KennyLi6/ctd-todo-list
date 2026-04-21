import TodoListItem from "./TodoListItem";

function TodoList({todoList, todos}) {

    return (
        <ul>
            {todos}
            {todoList.map((todo) => (
                <TodoListItem 
                    key={todo.id}
                    todo={todo}
                />
            ))}
        </ul>
    );
}

export default TodoList;