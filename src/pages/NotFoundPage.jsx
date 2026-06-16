import { Link } from "react-router";
import styles from "./TodosPage.module.css"

function NotFoundPage() {
    return (
        <div className={styles.container}>
            <h2>404 - Page Not Found</h2>
            <p>The page you're looking for doesn't exist.</p>

            <div>
                <ul>
                    <li>
                        <Link to='/'>Go to Home page</Link>
                    </li>
                    <li>
                        <Link to='/todos'>Go to Todos page</Link>
                    </li>
                    <li>
                        <Link to='/about'>Go to About page</Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default NotFoundPage;