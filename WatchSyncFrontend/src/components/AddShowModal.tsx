import { useState } from "react";
import type { CreateShowDto, WatchParty } from "../types";
import { theme } from "../theme";

function AddShowModal({ watchParty, onAdd, onClose }: { watchParty: WatchParty, onAdd: (show: CreateShowDto) => void, onClose: () => void }) {

    const [title, setTitle] = useState('');
    const [totalEpisodes, setTotalEpisodes] = useState(1);
    const [coverUrl, setCoverUrl] = useState('');

    function handleAdd() {
        const newShow = {
            watchPartyId: watchParty.watchPartyId,
            title,
            totalEpisodes,
            currentEpisode: 0,
            coverUrl: coverUrl || null
        };
        onAdd(newShow);
        onClose();
    }

    return (
        <div
            className="flex flex-col gap-4 p-6 w-80"
            style={{ backgroundColor: theme.card, borderRadius: theme.radius, border: `1px solid ${theme.border}`, alignItems: "center" }}>
            <h2>Add Show</h2>
            <input placeholder="title" value={title} onChange={e => setTitle(e.target.value)} />
            <label>Episode count:</label>
            <input placeholder="total episodes..." type="number" min={1} value={totalEpisodes} onChange={e => setTotalEpisodes(Number(e.target.value))} />
            <label>cover:</label>
            <input placeholder="URL" value={coverUrl} onChange={e => setCoverUrl(e.target.value)} />
            <button onClick={handleAdd} style={theme.buttonStyle}>Add</button>
            <button onClick={onClose} style={theme.buttonStyle}>Cancel</button>
        </div>
    )
}

export default AddShowModal