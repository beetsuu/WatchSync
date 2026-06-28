import { useState } from "react";
import type { User } from "../types";
import { theme } from "../theme";

function CreateWatchPartyModal({ users, onAdd, onClose }: { users: User[], onAdd: (name: string, turnLimit: number, userIds: number[]) => void, onClose: () => void }) {
    const [name, setName] = useState('');
    const [turnLimit, setTurnLimit] = useState(13);
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

    function handleCreate() {
        onAdd(name, turnLimit, selectedUsers);
    }

    return (
        <div className="flex flex-col gap-4 p-6 w-80" style={{ backgroundColor: theme.card, borderRadius: theme.radius, border: `1px solid ${theme.border}` }}>
            <h2>Create Watch Party</h2>
            <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
            <input type="number" placeholder="Turn Limit" value={turnLimit} onChange={e => setTurnLimit(Number(e.target.value))} />

            {/* User Auswahl */}
            {users.map(user => (
                <label key={user.userId}>
                    <input
                        type="checkbox"
                        onChange={e => {
                            if (e.target.checked) setSelectedUsers([...selectedUsers, user.userId]);
                            else setSelectedUsers(selectedUsers.filter(id => id !== user.userId));
                        }}
                    /> {user.name}
                </label>
            ))}
            <div className="flex gap-2">
                <button style={theme.buttonStyle} onClick={handleCreate}>Create</button>
                <button style={theme.buttonStyle} onClick={onClose}>Cancel</button>
            </div>
        </div>
    )
}

export default CreateWatchPartyModal