import './App.css'
import Logon from './features/Logon'
import TodosPage from './features/Todos/TodosPage'
import Header from './shared/Header'
import { useAuth } from './contexts/AuthContext';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Header />
      {isAuthenticated ? (
        <TodosPage/>
      ) : (
        <Logon/>
      )}
    </>
  );
}

export default App
