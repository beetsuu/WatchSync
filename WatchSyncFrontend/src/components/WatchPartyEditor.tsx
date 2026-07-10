import { useEffect, useState } from "react";
import { getWatchPartyMembers, leaveWatchParty, updateWatchPartyMembers } from "../api/client";
import { theme } from "../theme";
import type { WatchPartyMember } from "../types";
import { useAuth } from "../context/AuthContext";

function WatchPartyEditor({
    watchParty,
    onSave,
    onDelete
}: any) {

    const { user } = useAuth();
    const [name, setName] = useState(watchParty.name);
    const [turnLimit, setTurnLimit] = useState(watchParty.turnLimit);

    const [members, setMembers] = useState<WatchPartyMember[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

    const currentUserIsOwner = members.some(
        m => m.userId === user?.id && m.isOwner
    );

    useEffect(() => {
        getWatchPartyMembers(watchParty.watchPartyId)
            .then(data => {
                setMembers(data);

                setSelectedMembers(
                    data.map(m => m.userId)
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
                className="px-3 py-2 rounded bg-black/30 outline-none"
            />


            <input
                type="number"
                min={1}
                disabled={!currentUserIsOwner}
                value={turnLimit}
                onChange={(e) =>
                    setTurnLimit(Number(e.target.value))
                }
                className="px-3 py-2 rounded bg-black/30 outline-none"
            />


            <div className="flex flex-col gap-2">

                <span className="font-semibold">
                    Members
                </span>


                {members.map(member => (

                    <label
                        key={member.userId}
                        className="flex items-center gap-2"
                    >

                        {currentUserIsOwner && !member.isOwner && (
                            <input
                                type="checkbox"
                                checked={selectedMembers.includes(member.userId)}
                                onChange={() =>
                                    toggleMember(member.userId)
                                }
                            />
                        )}


                        <span>
                            {member.displayName}

                            {member.isOwner && (
                                <span
                                    style={{
                                        color: theme.accent
                                    }}
                                >
                                    {" "}Owner
                                </span>
                            )}

                        </span>

                    </label>

                ))}

            </div>


            {currentUserIsOwner && (

                <div className="flex gap-2">

                    <button
                        style={theme.buttonStyle}
                        onClick={handleSave}
                    >
                        Save
                    </button>


                    <button
                        onClick={() => {

                            if (
                                window.confirm(
                                    `Delete "${watchParty.name}"?`
                                )
                            ) {
                                onDelete(
                                    watchParty.watchPartyId
                                );
                            }

                        }}
                        className="px-4 py-2 rounded font-bold"
                        style={theme.errorButton}
                    >
                        Delete
                    </button>

                </div>

            )}
            {!currentUserIsOwner && (
                <button
                    onClick={handleLeave}
                    className="px-4 py-2 rounded font-bold"
                    style={theme.errorButton}
                >
                    Leave Watch Party
                </button>
            )}

        </div>
    );

}
export default WatchPartyEditor;