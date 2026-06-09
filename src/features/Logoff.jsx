import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function Logoff() {
    const { logout } = useAuth();
    const [error, setError] = useState('');
    const [isLoggingOff, setIsLoggingOff] = useState(false);

    async function handleLogoff() {
        setIsLoggingOff(true);
        setError('');

        const resp = await logout();

        if (resp.success) {
            // Logout successful
        } else {
            setError(resp.error);
            setIsLoggingOff(false);
        }
    }

    return (
        <>
            <button onClick={handleLogoff} disabled={isLoggingOff}>
                {isLoggingOff ? <>Logging off...</> : <>Log Off</>}
            </button>
            {error && <p>{error}</p>}
        </>
    );
}

export default Logoff;