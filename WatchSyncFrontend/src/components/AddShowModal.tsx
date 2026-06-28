import { useState } from "react";
import type { CreateShowDto, User } from "../types";

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
        <div>
            <h2>Show hinzufügen</h2>
            <input placeholder="Titel" value={title} onChange={e => setTitle(e.target.value)} />
            <input placeholder="Episoden gesamt" type="number" value={totalEpisodes} onChange={e => setTotalEpisodes(Number(e.target.value))} />
            <button onClick={onClose}>Abbrechen</button>
            <button onClick={handleAdd}>Hinzufügen</button>
        </div>
    )
}

export default AddShowModal