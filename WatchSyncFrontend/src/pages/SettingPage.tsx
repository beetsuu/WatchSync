import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PiArrowFatLineDownFill, PiArrowFatLineLeftFill, PiArrowFatLineUpFill } from "react-icons/pi";
import { theme } from "../theme";
import { useAuth } from "../context/AuthContext";
import { useWatchParty } from "../hooks/useWatchParties";
import { updateProfile, uploadAvatar, getAvatarUrl } from "../api/client";
import WatchPartyEditor from "../components/WatchPartyEditor";
import Modal from "../components/Modal";

export default function SettingPage() {
    const navigate = useNavigate();
    const { user, setUser, logout } = useAuth();
    const [savingProfile, setSavingProfile] = useState(false);
    const [showSavedModal, setShowSavedModal] = useState(false);

    const {
        watchParties,
        handleEditWatchParty,
        handleDeleteWatchParty
    } = useWatchParty();

    const [openSection, setOpenSection] = useState<string | null>(null);

    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState("");
    const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState("");

    useEffect(() => {
        if (user) {
            setDisplayName(user.displayName);
            setEmail(user.email);
            setAvatar(user.avatarUrl || "");

            if (!selectedAvatarFile) {
                setAvatarPreview(user.avatarUrl || "");
            }
        }
    }, [user]);

    const toggleSection = (id: string) => {
        setOpenSection(openSection === id ? null : id);
    };

    function handleAvatarChange(
        e: React.ChangeEvent<HTMLInputElement>
    ) {
        const file = e.target.files?.[0];

        if (!file) return;
        console.log("selected", file);
        console.log("BEFORE STATE");
        setSelectedAvatarFile(file);
        console.log("AFTER STATE");

        const previewUrl = URL.createObjectURL(file);
        setAvatarPreview(previewUrl);
    }

    async function handleSaveProfile() {
        try {
            setSavingProfile(true);

            let avatarUrl = avatar;

            let uploadResult = null;

            if (selectedAvatarFile) {
                uploadResult = await uploadAvatar(selectedAvatarFile);
                avatarUrl = uploadResult.avatarUrl;
            }

            const updatedUser = await updateProfile(
                displayName,
                email,
                avatarUrl
            );

            console.log("upload result:", uploadResult);
            console.log("updated user:", updatedUser);

            setUser(updatedUser);

            sessionStorage.setItem(
                "user",
                JSON.stringify(updatedUser)
            );

            setAvatar(updatedUser.avatarUrl || "");

            setAvatarPreview(
                updatedUser.avatarUrl
                    ? getAvatarUrl(updatedUser.avatarUrl)
                    : ""
            );

            setSelectedAvatarFile(null);
            setShowSavedModal(true);

        } catch (err) {
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
                className="sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 py-3 border-b"
                style={{
                    borderColor: theme.border,
                    backgroundColor: theme.background
                }}
            >
                <button
                    onClick={() => navigate(-1)}
                    className="h-10  flex items-center gap-2 font-medium">
                    <PiArrowFatLineLeftFill></PiArrowFatLineLeftFill> <span>Back</span>
                </button>

                <h1 className="text-lg font-bold">Settings</h1>

                <div className="w-10" />
            </div>

            <div className="w-full max-w-xl mx-auto mt-6 sm:mt-8 px-3 sm:px-4 flex flex-col gap-4">
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

                            <img
                                src={
                                    avatarPreview
                                        ? avatarPreview.startsWith("blob:")
                                            ? avatarPreview
                                            : getAvatarUrl(avatarPreview)
                                        : "/default-avatar.png"
                                }
                                className="w-20 h-20 rounded-full object-cover mx-auto"
                            />
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
                            <div className="px-24 pb-2 flex flex-col gap-2 items-center">
                                <label
                                    htmlFor="avatar-upload"
                                    className="cursor-pointer px-4 py-2 rounded font-medium text-sm w-full text-center"
                                    style={{
                                        backgroundColor: theme.card,
                                        border: `1px solid ${theme.border}`,
                                        color: theme.text
                                    }}
                                >
                                    {selectedAvatarFile ? selectedAvatarFile.name : "Choose a photo"}
                                </label>
                                <input
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                            </div>
                            <button
                                onClick={handleSaveProfile}
                                disabled={savingProfile}
                                className="w-full sm:w-auto px-4 py-2 rounded font-bold"
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
                    {watchParties.length > 1 && (
                        <button
                            onClick={() => toggleSection("watchparties")}
                            className="w-full flex justify-between items-center px-4 py-3 font-semibold"
                        >
                            Edit Watch Parties

                            {

                                openSection === "watchparties"
                                    ? <PiArrowFatLineUpFill size={16} />
                                    : <PiArrowFatLineDownFill size={16} />
                            }
                        </button>
                    )}

                    {openSection === "watchparties" && (
                        <div className="px-3 sm:px-4 pb-4 flex flex-col gap-4">

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
                    className="w-full text-left px-4 py-3 rounded-lg font-semibold mt-2"
                    style={{
                        backgroundColor: theme.card,
                        color: theme.accent,
                        border: `1px solid ${theme.border}`
                    }}
                >
                    Logout
                </button>

            </div>

            <p className="text-xs text-center opacity-50 mt-8 px-4 pb-6 ">
                <u>
                    <a rel="TVMaze" href="https://www.tvmaze.com" >
                        Data and images provided by TV Maze
                    </a>
                </u>
            </p>

            {
                showSavedModal && (
                    <Modal onClose={() => setShowSavedModal(false)}>
                        <div
                            className="flex flex-col gap-4 p-6 w-80 items-center text-center"
                            style={{
                                backgroundColor: theme.card,
                                borderRadius: theme.radius,
                                border: `1px solid ${theme.border}`
                            }}
                        >
                            <h2 className="font-bold text-lg">
                                Saved!
                            </h2>

                            <p
                                className="text-sm"
                                style={{ color: theme.textMuted }}
                            >
                                Your changes have been saved successfully.
                            </p>

                            <button
                                onClick={() => setShowSavedModal(false)}
                                style={theme.buttonStyle}
                            >
                                OK
                            </button>
                        </div>
                    </Modal>
                )
            }
        </div >
    );
}

