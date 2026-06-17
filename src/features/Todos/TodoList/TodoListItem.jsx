import TextInputWithLabel from "../../../shared/TextInputWithLabel";
import { isValidTodoTitle } from "../../../utils/todoValidation";
import { useEditableTitle } from "../../../hooks/useEditableTitle"
import { useRef } from "react";
import { sanitizeInput } from "../../../utils/sanitize";
import styles from "./TodoListItem.module.css";

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
    const {
        isEditing,
        workingTitle,
        startEditing,
        cancelEdit,
        updateTitle,
        finishEdit
    } = useEditableTitle(todo.title);
    const todoInput = useRef(null);

    function handleCancel() {
        cancelEdit();
    }

    function handleEdit(event) {
        updateTitle(event.target.value);
    }

    function handleUpdate(event) {
        if (!isEditing) return;
        event.preventDefault();
        const finalTitle = finishEdit();
        const sanitizedTitle = sanitizeInput(finalTitle);
        onUpdateTodo({ ...todo, title: sanitizedTitle });
    }
    
    return (
        <li className={styles.itemCard}>
            <form
                className={styles.itemForm}
                onSubmit={handleUpdate}
            >
                {isEditing ? (
                    <>
                        <div className={styles.editWrapper}>
                            <TextInputWithLabel 
                                value={workingTitle}
                                onChange={handleEdit}
                                ref={todoInput}
                                elementId={todo.id}
                                labelText="Todo"
                            />
                        </div>
                        <div className={styles.actionWrapper}>
                            <button
                                className={`${styles.button} ${styles.cancelButton}`}
                                type="button"
                                onClick={handleCancel}
                            >
                            Cancel
                            </button>
                            <button
                                className={`${styles.button} ${styles.UpdateButton}`}
                                type="button"
                                onClick={handleUpdate}
                                disabled={!isValidTodoTitle(workingTitle)}
                            >
                            Update
                            </button>
                        </div>
                    </>
                ) : (
                    <div className={styles.viewContainer}>
                        <label className={styles.checkboxLabel}>
                            <input
                                className={styles.checkboxInput}
                                type="checkbox"
                                id={`checkbox${todo.id}`}
                                checked={todo.isCompleted}
                                onChange={() => onCompleteTodo(todo.id)}
                            />
                        </label>
                        <span 
                            className={`${styles.todoText} ${todo.isCompleted ? styles.completedText : ''}`}
                            onClick={() => startEditing()}
                        >
                            {todo.title}
                        </span>
                    </div>
                )}
            </form>
        </li>
    );
}

export default TodoListItem;