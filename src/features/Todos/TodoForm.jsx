import { useRef, useState } from "react";
import { isValidTodoTitle } from "../../utils/todoValidation";
import TextInputWithLabel from "../../shared/TextInputWithLabel";
import { sanitizeInput } from "../../utils/sanitize";
import styles from "./TodoForm.module.css"

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
        <form onSubmit={handleAddTodo} className={styles.form}>
            <div className={styles.inputWrapper}>
                <TextInputWithLabel 
                ref={inputRef}
                value={workingTodoTitle}
                onChange={(event) => setWorkingTodoTitle(event.target.value)}
                elementId="todoTitle"
                labelText="Todo"
                maxLength={80}
                />
            </div>
            <div className={styles.buttonWrapper}>
                <button 
                    className={styles.submitButton}
                    disabled={!isValidTodoTitle(workingTodoTitle)}
                >
                    Add Todo
                </button>
            </div>        
        </form>
    );
}

export default TodoForm;