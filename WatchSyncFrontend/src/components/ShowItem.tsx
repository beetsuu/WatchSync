import { useState } from "react";
import { deleteShow, updateShow } from "../api/client";
import { theme } from "../theme";
import type { Show } from "../types";
import Modal from "./Modal";

function ShowItem({ show, onPlusOne, onMinusOne, addedByUserName, onDelete, onEdit }:
    { show: Show, onPlusOne: (show: Show) => void, onMinusOne: (show: Show) => void, addedByUserName: string, onDelete: (showid: number) => void, onEdit: (show: Show) => void }) {


    const [showSettings, setShowSettings] = useState(false);
    const [editTitle, setEditTitle] = useState(show.title);
    const [editEpisodes, setEditEpisodes] = useState(show.totalEpisodes);
    const [editCoverUrl, setEditCoverUrl] = useState(show.coverUrl ?? '');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    function handlePlusOne(): void {
        const updatedShow = { ...show, currentEpisode: show.currentEpisode + 1 };
        updateShow(updatedShow);
        onPlusOne(updatedShow);
    }
    function handleMinusOne(): void {
        const updatedShow = { ...show, currentEpisode: show.currentEpisode - 1 };
        updateShow(updatedShow);
        onMinusOne(updatedShow);
    }

    async function handleSave() {
        const updatedShow = { ...show, title: editTitle, totalEpisodes: editEpisodes, coverUrl: editCoverUrl || null };
        await updateShow(updatedShow);
        onEdit(updatedShow);
        setShowSettings(false);
    }

    async function handleDelete() {
        await deleteShow(show.showId);
        onDelete(show.showId);
        setShowSettings(false);
    }

    return (
        <div className="flex flex-col border overflow-hidden" style={{ backgroundColor: theme.card, borderColor: theme.border, borderRadius: theme.radius }}>

            {/* Bild oben */}
            <div className="w-full h-32 md:h-40 relative" style={{ backgroundColor: theme.border }}>
                {show.coverUrl
                    ? <img src={show.coverUrl} className="w-full h-full object-contain" />
                    : <div className="w-full h-full flex items-center justify-center" style={{ color: theme.textMuted }}>no image</div>
                }
                <button
                    onClick={() => setShowSettings(true)}
                    className="absolute top-2 right-2 p-1"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '6px' }}
                >
                    ⚙️
                </button>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1 p-4">
                <p className="font-bold">{show.title}</p>
                <p style={{ color: theme.textMuted, fontSize: '12px' }}>{addedByUserName}</p>
                <p style={{ fontFamily: 'monospace' }}>{show.currentEpisode} / {show.totalEpisodes}</p>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 p-4 pt-0">
                <button onClick={handleMinusOne} disabled={show.currentEpisode <= 0} className="flex-1 py-2 font-bold" style={theme.buttonStyle}>-1</button>
                <button onClick={handlePlusOne} disabled={show.currentEpisode >= show.totalEpisodes} className="flex-1 py-2 font-bold" style={theme.buttonStyle}>+1</button>
            </div>

            {/* Settings Modal */}
            {showSettings && (
                <Modal onClose={() => setShowSettings(false)}>
                    <div className="flex flex-col gap-4 p-6 w-80" style={{ backgroundColor: theme.card, borderRadius: theme.radius, border: `1px solid ${theme.border}` }}>
                        <h2>Edit Show</h2>
                        <input value={editTitle} onChange={e => setEditTitle(e.target.value)} placeholder="Title" />
                        <input type="number" value={editEpisodes} onChange={e => setEditEpisodes(Number(e.target.value))} placeholder="Total Episodes" />
                        <input value={editCoverUrl} onChange={e => setEditCoverUrl(e.target.value)} placeholder="Cover URL" />
                        <button style={theme.buttonStyle} onClick={handleSave}>Save</button>
                        <button style={{ ...theme.buttonStyle, backgroundColor: '#C0392B', borderColor: '#C0392B' }} onClick={() => setShowDeleteConfirm(true)}>Delete</button>
                    </div>
                </Modal>
            )}

            {showDeleteConfirm && (
                <Modal onClose={() => setShowDeleteConfirm(false)}>
                    <div className="flex flex-col gap-4 p-6 w-80" style={{ backgroundColor: theme.card, borderRadius: theme.radius, border: `1px solid ${theme.border}` }}>
                        <h2>Are you sure?</h2>
                        <p style={{ color: theme.textMuted }}>This will permanently delete "{show.title}".</p>
                        <div className="flex gap-2">
                            <button style={{ ...theme.buttonStyle, backgroundColor: '#C0392B' }} onClick={handleDelete}>Yes, delete</button>
                            <button style={theme.buttonStyle} onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    )
}
export default ShowItem;


