import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";

function LoginPage() {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [authError, setAuthError] = useState("");
    const [isLoggingOn, setIsLoggingOn] = useState(false);

    const from = location.state?.from?.pathname || '/todos'

    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

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
                <button disabled={isLoggingOn}>
                    {isLoggingOn ? <>Logging In...</> : <>Log On</>}
                </button>
            </form>
            { authError && <p>{authError}</p>}
        </>
    )
}

export default LoginPage;