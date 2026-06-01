import { useAuth } from "../contexts/AuthContext";
import Logoff from "../features/Logoff";

function Header() {
    const { isAuthenticated } = useAuth();

    return (
        <>
            <h1>Todo List</h1>
            {isAuthenticated && <Logoff/>}
        </>
    )
}

export default Header;