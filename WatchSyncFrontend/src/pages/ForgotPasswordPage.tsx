import { useState } from "react";
import { Link } from "react-router-dom";
import { theme } from "../theme";
import { forgotPassword } from "../api/client";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setMessage("");
        setError("");
        setLoading(true);

        try {
            await forgotPassword(email);

            setMessage(
                "If an account exists with this email, a reset link has been sent."
            );

        } catch (err: any) {
            setError(err.message || "Failed to send reset email");
        } finally {
            setLoading(false);
        }
    }


    return (
        <div
            className="min-h-screen flex items-center justify-center"
            style={{
                backgroundColor: theme.background
            }}
        >
            <div
                className="w-full max-w-sm p-8"
                style={{
                    backgroundColor: theme.card,
                    borderRadius: theme.radius,
                    border: `1px solid ${theme.border}`
                }}
            >
                <h1
                    className="text-2xl font-bold mb-6 text-center"
                    style={{
                        color: theme.accent
                    }}
                >
                    Reset Password
                </h1>

                <p
                    className="text-sm mb-4 text-center"
                    style={{
                        color: theme.textMuted
                    }}
                >
                    Enter your email address and we will send you a reset link.
                </p>


                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                >
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="px-4 py-2 rounded"
                        style={{
                            backgroundColor: theme.background,
                            color: theme.text,
                            border: `1px solid ${theme.border}`
                        }}
                    />

                    {error && (
                        <p style={{ color: "#ff6b6b" }}>
                            {error}
                        </p>
                    )}

                    {message && (
                        <p style={{ color: theme.accent }}>
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={theme.buttonStyle}
                    >
                        {loading
                            ? "Sending..."
                            : "Send reset link"}
                    </button>
                </form>


                <p
                    className="mt-4 text-center text-sm"
                    style={{
                        color: theme.textMuted
                    }}
                >
                    Remember your password?{" "}
                    <Link
                        to="/login"
                        style={{
                            color: theme.accent
                        }}
                    >
                        Login
                    </Link>
                </p>

            </div>
        </div>
    );
}