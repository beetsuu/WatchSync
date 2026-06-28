import { useState } from "react";
import type { CreateShowDto, User, WatchParty } from "../types";
import { theme } from "../theme";

function AddShowModal({ currentUser, watchParty, onAdd, onClose }: { currentUser: User, watchParty: WatchParty, onAdd: (show: CreateShowDto) => void, onClose: () => void }) {

    const [title, setTitle] = useState('');
    const [totalEpisodes, setTotalEpisodes] = useState(0);
    const [coverUrl, setCoverUrl] = useState('');

    function handleAdd() {
        const newShow = {
            watchPartyId: watchParty.watchPartyId,
            addedByUserId: currentUser.userId,
            title,
            totalEpisodes,
            currentEpisode: 0,
            coverUrl: coverUrl || null
        };
        onAdd(newShow);
    }

    return (
        <div
            className="flex flex-col gap-4 p-6 w-80"
            style={{ backgroundColor: theme.card, borderRadius: theme.radius, border: `1px solid ${theme.border}`, alignItems: "center" }}>
            <h2>Add Show</h2>
            <input placeholder="Titel" value={title} onChange={e => setTitle(e.target.value)} />
            <label>Episode count:</label>
            <input placeholder="Episoden gesamt" type="number" value={totalEpisodes} onChange={e => setTotalEpisodes(Number(e.target.value))} />
            <label>cover:</label>
            <input placeholder="URL" value={coverUrl} onChange={e => setCoverUrl(e.target.value)} />
            <button onClick={handleAdd} style={theme.buttonStyle}>Add</button>
            <button onClick={onClose} style={theme.buttonStyle}>Cancel</button>
        </div>
    )
}

export default AddShowModal