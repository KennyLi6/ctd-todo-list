import { useRef, useState } from "react";
import { isValidTodoTitle } from "../../utils/todoValidation";
import TextInputWithLabel from "../../shared/TextInputWithLabel";
import { sanitizeInput } from "../../utils/sanitize";

function TodoForm({onAddTodo}) {
    const inputRef = useRef();
    const [workingTodoTitle, setWorkingTodoTitle] = useState("");

    const handleAddTodo = (event) => {
        event.preventDefault();

        const sanitizedTitle = sanitizeInput(workingTodoTitle);
        if (sanitizedTitle && sanitizedTitle !== "") {
            onAddTodo(sanitizedTitle);
            setWorkingTodoTitle("");
            inputRef.current.focus();
        }
    };

    return (
        <form onSubmit={handleAddTodo}>
            <TextInputWithLabel 
                ref={inputRef}
                value={workingTodoTitle}
                onChange={(event) => setWorkingTodoTitle(event.target.value)}
                elementId="todoTitle"
                labelText="Todo"
            />
            <button disabled={!isValidTodoTitle(workingTodoTitle)}>
                Add Todo
            </button>
        </form>
    );
}

export default TodoForm;