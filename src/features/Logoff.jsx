import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";
import styles from "./Todos/TodoForm.module.css"

function Logoff() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoggingOff, setIsLoggingOff] = useState(false);

    async function handleLogoff() {
        setIsLoggingOff(true);
        setError('');

        const resp = await logout();

        if (resp.success) {
            navigate('/login');
        } else {
            setError(resp.error);
            setIsLoggingOff(false);
        }
    }

    return (
        <>
            <button 
                className={styles.submitButton}
                onClick={handleLogoff} disabled={isLoggingOff}
            >
                {isLoggingOff ? <>Logging off...</> : <>Log Off</>}
            </button>
            {error && <p>{error}</p>}
        </>
    );
}

export default Logoff;