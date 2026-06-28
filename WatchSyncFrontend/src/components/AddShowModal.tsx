import { useState } from "react";
import type { CreateShowDto, User } from "../types";
import { theme } from "../theme";

function AddShowModal({ currentUser, onAdd, onClose }: { currentUser: User, onAdd: (show: CreateShowDto) => void, onClose: () => void }) {

    const [title, setTitle] = useState('');
    const [totalEpisodes, setTotalEpisodes] = useState(0);

    function handleAdd() {
        const newShow = {
            addedByUserId: currentUser.userId,
            title,
            totalEpisodes,
            currentEpisode: 0,
            coverUrl: null
        };
        onAdd(newShow);
    }

    return (
        <div
            className="flex flex-col gap-4 p-6 w-80"
            style={{ backgroundColor: theme.card, borderRadius: theme.radius, border: `1px solid ${theme.border}`, alignItems: "center" }}>
            <h2>Add Show</h2>
            <input placeholder="Titel" value={title} onChange={e => setTitle(e.target.value)} />
            <input placeholder="Episoden gesamt" type="number" value={totalEpisodes} onChange={e => setTotalEpisodes(Number(e.target.value))} />
            <button onClick={onClose}>Cancel</button>
            <button onClick={handleAdd}>Add</button>
        </div>
    )
}

export default AddShowModal