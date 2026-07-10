import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PiArrowFatLineDownFill, PiArrowFatLineUpFill } from "react-icons/pi";
import { theme } from "../theme";
import { useAuth } from "../context/AuthContext";
import { useWatchParty } from "../hooks/useWatchParties";
import { updateProfile } from "../api/client";
import WatchPartyEditor from "../components/WatchPartyEditor";

export default function SettingPage() {
    const navigate = useNavigate();
    const { user, setUser, logout } = useAuth();
    const [savingProfile, setSavingProfile] = useState(false);

    const {
        watchParties,
        handleEditWatchParty,
        handleDeleteWatchParty
    } = useWatchParty();

    const [openSection, setOpenSection] = useState<string | null>(null);

    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        if (user) {
            setDisplayName(user.displayName);
            setEmail(user.email);
        }
    }, [user]);

    const toggleSection = (id: string) => {
        setOpenSection(openSection === id ? null : id);
    };



    async function handleSaveProfile() {
        try {
            setSavingProfile(true);

            const updatedUser = await updateProfile(displayName, email);

            setUser(updatedUser);

            sessionStorage.setItem(
                "user",
                JSON.stringify(updatedUser)
            );

            alert("Profile updated");
        }
        catch (err) {
            console.error(err);
            alert("Failed to update profile");
        }
        finally {
            setSavingProfile(false);
        }
    }

    return (
        <div
            className="min-h-screen"
            style={{
                backgroundColor: theme.background,
                color: theme.text
            }}
        >
            <div
                className="flex items-center justify-between px-6 py-4 border-b"
                style={{ borderColor: theme.border }}
            >
                <button
                    onClick={() => navigate(-1)}
                    className="text-sm opacity-70 hover:opacity-100"
                >
                    ← Back
                </button>

                <h1 className="text-lg font-bold">Settings</h1>

                <div className="w-10" />
            </div>

            <div className="max-w-xl mx-auto mt-8 px-4 flex flex-col gap-4">

                {/* PROFILE */}
                <div
                    className="rounded-lg overflow-hidden"
                    style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}` }}
                >
                    <button
                        onClick={() => toggleSection("profile")}
                        className="w-full flex justify-between items-center px-4 py-3 font-semibold"
                    >
                        Edit Profile

                        {openSection === "profile"
                            ? <PiArrowFatLineUpFill size={16} />
                            : <PiArrowFatLineDownFill size={16} />}
                    </button>

                    {openSection === "profile" && (
                        <div className="px-4 pb-4 flex flex-col gap-3">

                            <input
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="Username"
                                className="px-3 py-2 rounded bg-black/30 outline-none"
                            />

                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                className="px-3 py-2 rounded bg-black/30 outline-none"
                            />

                            <button
                                onClick={handleSaveProfile}
                                disabled={savingProfile}
                                className="self-start px-4 py-2 rounded font-bold"
                                style={{
                                    backgroundColor: theme.accent,
                                    color: theme.background
                                }}
                            >
                                {savingProfile ? "Saving..." : "Save"}
                            </button>
                        </div>
                    )}
                </div>

                {/* WATCH PARTIES */}
                <div
                    className="rounded-lg overflow-hidden"
                    style={{
                        backgroundColor: theme.card,
                        border: `1px solid ${theme.border}`
                    }}
                >
                    <button
                        onClick={() => toggleSection("watchparties")}
                        className="w-full flex justify-between items-center px-4 py-3 font-semibold"
                    >
                        Edit Watch Parties

                        {openSection === "watchparties"
                            ? <PiArrowFatLineUpFill size={16} />
                            : <PiArrowFatLineDownFill size={16} />}
                    </button>

                    {openSection === "watchparties" && (
                        <div className="px-4 pb-4 flex flex-col gap-4">

                            {watchParties.map((wp) => (
                                <WatchPartyEditor
                                    key={wp.watchPartyId}
                                    watchParty={wp}
                                    onSave={handleEditWatchParty}
                                    onDelete={handleDeleteWatchParty}
                                />
                            ))}

                        </div>
                    )}
                </div>

                <button
                    onClick={() => {
                        logout();
                        navigate("/login");
                    }}
                    className="w-full text-left px-4 py-3 rounded-lg font-semibold"
                    style={{
                        backgroundColor: theme.card,
                        color: theme.accent,
                        border: `1px solid ${theme.border}`
                    }}
                >
                    Logout
                </button>

            </div>
        </div>
    );
}

