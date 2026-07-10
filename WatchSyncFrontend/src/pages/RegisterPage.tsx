import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import { registerUser } from '../api/client';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);


    async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await registerUser(email, password, displayName);
            navigate('/login');
        } catch (err: any) {
            setError(err.message || 'Registration failed');
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
                        value={displayName}
                        onChange={e => setDisplayName(e.target.value)}
                        required
                        className="px-4 py-2 rounded"
                        style={{ backgroundColor: theme.background, color: theme.text, border: `1px solid ${theme.border}` }}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
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
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <p className="mt-4 text-center text-sm" style={{ color: theme.textMuted }}>
                    Already have an Account? <Link to="/login" style={{ color: theme.accent }}>Login</Link>
                </p>
            </div>
        </div>
    );
}