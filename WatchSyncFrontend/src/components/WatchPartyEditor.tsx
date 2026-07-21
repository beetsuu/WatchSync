import { useEffect, useState } from "react";
import { getWatchPartyMembers, leaveWatchParty, updateWatchPartyMembers, getAvatarUrl } from "../api/client";
import { theme } from "../theme";
import type { WatchPartyMember } from "../types";
import { useAuth } from "../context/AuthContext";
import Modal from "./Modal";

function WatchPartyEditor({
    watchParty,
    onSave,
    onDelete
}: any) {

    const { user } = useAuth();
    const [name, setName] = useState(watchParty.name);
    const [turnLimit, setTurnLimit] = useState(watchParty.turnLimit);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showSavedModal, setShowSavedModal] = useState(false);

    const [members, setMembers] = useState<WatchPartyMember[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

    const currentUserIsOwner = members.some(
        m => m.userId === user?.id && m.isOwner
    );

    useEffect(() => {
        getWatchPartyMembers(watchParty.watchPartyId)
            .then(data => {
                console.log("watch party members:", JSON.stringify(data, null, 2));

                const sortedMembers = [...data].sort((a, b) => {
                    if (a.isOwner === b.isOwner) return 0;
                    return a.isOwner ? -1 : 1;
                });

                setMembers(sortedMembers);

                setSelectedMembers(
                    sortedMembers.map(m => m.userId)
                );
            })
            .catch(console.error);

    }, [watchParty.watchPartyId]);

    function toggleMember(userId: string) {
        setSelectedMembers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    }

    async function handleSave() {

        await onSave({
            ...watchParty,
            name,
            turnLimit
        });

        if (currentUserIsOwner) {
            await updateWatchPartyMembers(
                watchParty.watchPartyId,
                selectedMembers
            );
        }

        setShowSavedModal(true);

    }

    async function handleLeave() {
        if (!window.confirm(`Leave "${watchParty.name}"?`))
            return;

        try {
            await leaveWatchParty(watchParty.watchPartyId);

            window.location.reload();
        }
        catch (err) {
            console.error(err);
            alert("Failed to leave watch party");
        }
    }

    if (watchParty.isPersonal) {
        return null;
    }

    return (
        <div
            className="rounded-lg p-4 flex flex-col gap-3"
            style={{
                border: `1px solid ${theme.border}`
            }}
        >

            <input
                value={name}
                disabled={!currentUserIsOwner}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded bg-black/30 outline-none"
            />

            <input
                type="number"
                min={1}
                disabled={!currentUserIsOwner}
                value={turnLimit}
                onChange={(e) =>
                    setTurnLimit(Number(e.target.value))
                }
                className="w-full px-3 py-2 rounded bg-black/30 outline-none"
            />

            <div className="flex flex-col gap-2">

                <span className="font-semibold">
                    Members
                </span>

                {members.map(member => (
                    <label
                        key={member.userId}
                        className="flex items-center justify-between gap-3 px-2 py-1.5 rounded-lg"
                        style={{
                            backgroundColor: "rgba(255,255,255,0.03)"
                        }}
                    >

                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>

                            <img
                                src={getAvatarUrl(member.avatarUrl)}
                                alt={member.displayName}
                                style={{
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "9999px",
                                    objectFit: "cover",
                                    flexShrink: 0
                                }}
                            />

                            <span>{member.displayName}</span>

                        </div>

                        {member.isOwner && (
                            <span style={{ color: theme.accent }}>
                                (Owner)
                            </span>
                        )}

                        {currentUserIsOwner && !member.isOwner && (
                            <input
                                type="checkbox"
                                checked={selectedMembers.includes(member.userId)}
                                onChange={() => toggleMember(member.userId)}
                            />
                        )}

                    </label>
                ))}
            </div>

            {currentUserIsOwner && (

                <div className="flex flex-col gap-2">

                    <button
                        onClick={handleSave}
                        className="w-full sm:w-auto px-4 py-2 rounded font-bold"
                        style={{
                            backgroundColor: theme.accent,
                            color: theme.background
                        }}
                    >
                        Save
                    </button>

                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="w-full sm:w-auto px-4 py-2 rounded font-bold"
                        style={{
                            backgroundColor: theme.errorButton.backgroundColor,
                            color: theme.errorButton.color
                        }}
                    >
                        Delete
                    </button>

                </div>

            )}

            {!currentUserIsOwner && (
                <button
                    onClick={handleLeave}
                    className="w-full px-4 py-2 rounded font-bold"
                    style={theme.errorButton}
                >
                    Leave Watch Party
                </button>
            )}

            {showDeleteConfirm && (
                <Modal onClose={() => setShowDeleteConfirm(false)}>
                    <div
                        className="flex flex-col gap-4 p-6 w-80"
                        style={{
                            backgroundColor: theme.card,
                            borderRadius: theme.radius,
                            border: `1px solid ${theme.border}`
                        }}
                    >
                        <h2>Are you sure?</h2>

                        <p style={{ color: theme.textMuted }}>
                            This will permanently delete "{watchParty.name}".
                        </p>

                        <div className="flex gap-2">
                            <button
                                style={{
                                    ...theme.buttonStyle,
                                    backgroundColor: "#C0392B",
                                    borderColor: "#C0392B"
                                }}
                                onClick={() => {
                                    onDelete(watchParty.watchPartyId);
                                    setShowDeleteConfirm(false);
                                }}
                            >
                                Yes, delete
                            </button>

                            <button
                                style={theme.buttonStyle}
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {showSavedModal && (
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
            )}

        </div>
    );

}
export default WatchPartyEditor;