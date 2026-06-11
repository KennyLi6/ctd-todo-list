import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function ProfilePage() {
    const { email, token } = useAuth();
    const [todoStats, setTodoStats] = useState({
        total: 0,
        completed: 0,
        active: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchTodoStats() {
            if (!token) return;

            try {
                setLoading(true);
                setError('');

                const options = {
                    method: 'GET',
                    headers: { 'X-CSRF-TOKEN': token },
                    credentials: 'include',
                };

                const resp = await fetch('/api/tasks', options);

                if (resp.status === 401) {
                    throw new Error('Unauthorized');
                }

                if (!resp.ok) {
                    throw new Error('Failed to fetch todos');
                }

                const todos = await resp.json();
                const total = todos.tasks.length;
                const completed = todos.tasks.filter((todo) => todo.isCompleted).length;
                const active = total - completed;

                setTodoStats({ total, completed, active });
            } catch (error) {
                setError(`Error loading statistics: ${error.message}`);
            } finally {
                setLoading(false);
            }
        }

        fetchTodoStats();
    }, [token]);

    return (
        <div>
            <h2>User Profile</h2>

            <div>
                <h3>Account Information</h3>
                <p>
                    <strong>Name:</strong> {email}
                </p>
                <p>
                    <strong>Account Status:</strong> Active
                </p>
            </div>

            <div>
                <h3>Todo Statistics</h3>
                {loading ? (
                    <p>Loading statstics...</p>
                ) : error ? (
                    <div>
                        <p style={{ color: 'red' }}>{error}</p>
                        <p>
                            <em>
                                Unable to load todo statistics. Make sure you have acces to todos.
                            </em>
                        </p>
                    </div>
                ) : (
                    <div>
                        <p>
                            <strong>Total Todos:</strong> {todoStats.total}
                        </p>
                        <p>
                            <strong>Completed Todos:</strong> {todoStats.completed}
                        </p>
                        <p>
                            <strong>Active Todos:</strong> {todoStats.active}
                        </p>
                        {todoStats.total > 0 && (
                            <p>
                                <strong>Completion Rate:</strong>{' '}
                                {Math.round((todoStats.completed / todoStats.total) * 100)}%
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProfilePage;