import { useState } from "react";
import { theme } from "../theme";

function CreateWatchPartyModal({ onAdd, onClose }: { onAdd: (name: string, turnLimit: number) => void, onClose: () => void }) {
    const [name, setName] = useState('');
    const [turnLimit, setTurnLimit] = useState(13);

    function handleCreate() {
        onAdd(name, turnLimit);
        onClose();
    }

    return (
        <div className="flex flex-col gap-4 p-6 w-80" style={{ backgroundColor: theme.card, borderRadius: theme.radius, border: `1px solid ${theme.border}`, alignItems: "center" }}>
            <h2>Create Watch Party</h2>
            <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
            <input type="number" placeholder="Turn Limit" value={turnLimit} onChange={e => setTurnLimit(Number(e.target.value))} />
            <div className="flex gap-2">
                <button style={theme.buttonStyle} onClick={handleCreate}>Create</button>
                <button style={theme.buttonStyle} onClick={onClose}>Cancel</button>
            </div>
        </div>
    )
}

export default CreateWatchPartyModal