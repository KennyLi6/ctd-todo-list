function TodoListItem({ todo }) {

    return (
        <li>
            {todo.map((todo) => {todo.title})}
        </li>
    );
}

export default TodoListItem;