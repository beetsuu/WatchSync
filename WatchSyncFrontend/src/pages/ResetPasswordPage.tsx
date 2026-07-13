import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { theme } from "../theme";
import { resetPassword } from "../api/client";

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const email = searchParams.get("email") || "";
    const token = searchParams.get("token") || "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!email || !token) {
            setError("Invalid reset link");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            await resetPassword(
                email,
                token,
                password
            );

            setMessage("Password changed successfully");

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (err: any) {
            setError(err.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    }


    return (
        <div
            className="min-h-screen flex items-center justify-center"
            style={{ backgroundColor: theme.background }}
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
                    style={{ color: theme.accent }}
                >
                    Reset Password
                </h1>


                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                >

                    <input
                        type="password"
                        placeholder="New password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        className="px-4 py-2 rounded"
                        style={{
                            backgroundColor: theme.background,
                            color: theme.text,
                            border: `1px solid theme.border`
                        }}
                    />


                    <input
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                        className="px-4 py-2 rounded"
                        style={{
                            backgroundColor: theme.background,
                            color: theme.text,
                            border: `1px solid theme.border`
                        }}
                    />


                    {error && (
                        <p style={{ color: "#ff6b6b" }}>
                            {error}
                        </p>
                    )}

                    {message && (
                        <p style={{ color: "#6bff95" }}>
                            {message}
                        </p>
                    )}


                    <button
                        type="submit"
                        disabled={loading}
                        style={theme.buttonStyle}
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>

                </form>
            </div>
        </div>
    );
}