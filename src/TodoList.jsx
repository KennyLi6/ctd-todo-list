function TodoList() {

    const todoList = [
        {id: 1, title: "read lesson"},
        {id: 2, title: "view resources"},
        {id: 3, title: "code app"}
    ]

    return (
        <ul>
            {todoList.map(todo => <li key={todo.id}>{todo.title}</li>)}
        </ul>
    );
}

export default TodoList;