import { useAuth } from "../contexts/AuthContext";
import Logoff from "../features/Logoff";
import Navigation from "./Navigation";
import styles from "./Header.module.css"

function Header() {
    const { isAuthenticated } = useAuth();

    return (
        <>
            <div className={styles.navigation}>
                <h1 className={styles.title}>Todo List</h1>
                <Navigation/>
            </div>
            {isAuthenticated && <Logoff/>}
        </>
    )
}

export default Header;