import styles from "./TodosPage.module.css"

function AboutPage() {
    return (
        <div className={styles.container}>
            <h1>About Todo List</h1>
            <p>
                This todo list application made in React allows for organizing
                and managing tasks.
            </p>

            <h2>Features</h2>
            <ul>
                <li>Add todos</li>
                <li>Mark todos complete</li>
                <li>Edit todos</li>
                <li>Sort list by date or title</li>
                <li>Filter list for searched term</li>
                <li>User Authentication</li>
            </ul>

            <h2>Built With</h2>
            <ul>
                <li>Vite</li>
                <li>React 19.2.4</li>
                <li>React Router 7</li>
            </ul>
        </div>
    )
}

export default AboutPage;