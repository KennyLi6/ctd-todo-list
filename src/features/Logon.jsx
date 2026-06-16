import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import formStyles from "./Todos/TodoForm.module.css";
import styles from "../pages/TodosPage.module.css"

function Logon() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [authError, setAuthError] = useState("");
    const [isLoggingOn, setIsLoggingOn] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setIsLoggingOn(true);
        setAuthError('');

        try {
            const resp = await login(email, password);
            
            if (resp.success) {
                // Login success
            } else {
                setAuthError(resp.error);
            }
        } catch (error) {
            setAuthError(`Error: ${error.name} | ${error.message}`);
        } finally {
            setIsLoggingOn(false);
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <p>Log on to get started</p>
                <label htmlFor="email">Email</label>
                <input
                    type="text"
                    name="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />
                <label htmlFor="password">Password</label>
                <input 
                    type="password"
                    name="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />
                <button 
                    style={{gap: 140}}
                    className={formStyles.submitButton}
                    disabled={isLoggingOn}
                >
                    {isLoggingOn ? <>Logging In...</> : <>Log On</>}
                </button>
            </form>
            { authError && (
                <div className={styles.errorBox}>
                    <p>{authError}</p>
                </div>
            )}
        </>
    )
}

export default Logon;