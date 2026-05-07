import TextInputWithLabel from "../../shared/TextInputWithLabel";
import { isValidTodoTitle } from "../../utils/todoValidation";
import { useEditableTitle } from "../../hooks/useEditableTitle";

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
    const {
        isEditing,
        workingTitle,
        startEditing,
        cancelEdit,
        updateTitle,
        finishEdit
    } = useEditableTitle(todo.title);

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