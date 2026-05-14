import TextInputWithLabel from "../../../shared/TextInputWithLabel";
import { isValidTodoTitle } from "../../../utils/todoValidation";
import { useEditableTitle } from "../../../hooks/useEditableTitle"
import { useRef } from "react";

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
        onUpdateTodo({ ...todo, title: finalTitle });
    }
    
    return (
        <li>
            <form
                onSubmit={handleUpdate}
            >
                {isEditing ? (
                    <>
                        <TextInputWithLabel 
                            value={workingTitle}
                            onChange={handleEdit}
                            ref={todoInput}
                            elementId={todo.id}
                            labelText="Todo"
                        />
                        <button
                            type="button"
                            onClick={handleCancel}
                        >
                        Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleUpdate}
                            disabled={!isValidTodoTitle(workingTitle)}
                        >
                        Update
                        </button>
                    </>
                ) : (
                    <>
                        <label>
                            <input
                                type="checkbox"
                                id={`checkbox${todo.id}`}
                                checked={todo.isCompleted}
                                onChange={() => onCompleteTodo(todo.id)}
                            />
                        </label>
                        <span onClick={() => startEditing()}>{todo.title}</span>
                    </>
                )}
            </form>
        </li>
    );
}

export default TodoListItem;