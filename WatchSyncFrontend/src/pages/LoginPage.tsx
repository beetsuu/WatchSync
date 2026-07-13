import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { theme } from '../theme';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);


    async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(username, password);
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.background }}>
            <div className="w-full max-w-sm p-8" style={{ backgroundColor: theme.card, borderRadius: theme.radius, border: `1px solid ${theme.border}` }}>
                <h1 className="text-2xl font-bold mb-6 text-center" style={{ color: theme.accent }}>WatchSync</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                        className="px-4 py-2 rounded"
                        style={{ backgroundColor: theme.background, color: theme.text, border: `1px solid ${theme.border}` }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        className="px-4 py-2 rounded"
                        style={{ backgroundColor: theme.background, color: theme.text, border: `1px solid ${theme.border}` }}
                    />
                    {error && <p style={{ color: '#ff6b6b' }}>{error}</p>}
                    <button type="submit" disabled={loading} style={theme.buttonStyle}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p className="mt-3 text-center text-sm">
                    <Link
                        to="/forgot-password"
                        style={{ color: theme.accent }}
                    >
                        Forgot password?
                    </Link>
                </p>
                <p className="mt-1 text-center text-sm" style={{ color: theme.textMuted }}>
                    No account? <Link to="/register" style={{ color: theme.accent }}>Register</Link>
                </p>
            </div>
        </div>
    );
}