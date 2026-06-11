import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

function RequireAuth({ children }) {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', {
                state: { from: location },
                replace: false,
            });
        }
    }, [isAuthenticated, location, navigate]);

    if (!isAuthenticated) {
        return <div>Redirecting to login...</div>;
    }

    return children;
}

export default RequireAuth;