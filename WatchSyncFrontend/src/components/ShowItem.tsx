import { useState } from "react";
import { deleteShow, updateShow } from "../api/client";
import { theme } from "../theme";
import { IoMdSettings } from "react-icons/io";
import type { Show } from "../types";
import Modal from "./Modal";

function ShowItem({ show, onPlusOne, onMinusOne, onDelete, onEdit }:
    { show: Show, onPlusOne: (show: Show) => void, onMinusOne: (show: Show) => void, onDelete: (showid: number) => void, onEdit: (show: Show) => void }) {


    const [showSettings, setShowSettings] = useState(false);
    const [editTitle, setEditTitle] = useState(show.title);
    const [editEpisodes, setEditEpisodes] = useState(show.totalEpisodes);
    const [editCoverUrl, setEditCoverUrl] = useState(show.coverUrl ?? '');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const isFinished = show.currentEpisode >= show.totalEpisodes && show.totalEpisodes > 0;

    function handlePlusOne(): void {
        const updatedShow = { ...show, currentEpisode: show.currentEpisode + 1 };
        onPlusOne(updatedShow);
    }
    function handleMinusOne(): void {
        const updatedShow = { ...show, currentEpisode: show.currentEpisode - 1 };
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
        <div className="flex flex-col overflow-hidden relative transition-opacity" style={{
            backgroundColor: theme.card,
            borderRadius: theme.radius,
            border: isFinished ? `1px solid ${theme.accent}` : `1px solid ${theme.border}`,
            opacity: isFinished ? 0.75 : 1
        }}>
            <div className="w-full relative" style={{ height: '200px', backgroundColor: theme.border }}>
                {isFinished && (
                    <div className="absolute top-2 left-2 px-2 py-1 text-xs font-bold"
                        style={{ backgroundColor: theme.darkButton.backgroundColor, borderRadius: '6px', color: '#ffffff' }}>
                        ✓ Done
                    </div>
                )}
                {show.coverUrl
                    ? <img src={show.coverUrl} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-sm" style={{ color: theme.textMuted }}>no image</div>
                }
                <button
                    onClick={() => setShowSettings(true)}
                    className="absolute top-2 right-2 text-xs px-2 py-1"
                    style={{ backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: '6px', color: '#ffffff', height: '30px', fontSize: '16px' }}
                >
                    <IoMdSettings />
                </button>
                <div className="absolute bottom-2 left-2 px-2 py-1 text-xs font-mono font-bold"
                    style={{ backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '6px', color: theme.accent }}>
                    {show.currentEpisode} / {show.totalEpisodes}
                </div>
            </div>

            <div className="p-3 flex flex-col gap-1">
                <p className="font-bold text-sm">{show.title}</p>
                <p className="text-xs" style={{ color: theme.textMuted }}>{show.addedByUserName}</p>
            </div>




            <div className="flex border-t" style={{ borderColor: theme.border }}>
                <button
                    onClick={handleMinusOne}
                    disabled={show.currentEpisode <= 0}
                    className="flex-1 py-2 font-bold text-base"
                    style={{ color: theme.accent, backgroundColor: 'transparent' }}
                >
                    −
                </button>
                <div style={{ width: '1px', backgroundColor: theme.border }}></div>
                <button
                    onClick={handlePlusOne}
                    disabled={show.currentEpisode >= show.totalEpisodes}
                    className="flex-1 py-2 font-bold text-base"
                    style={{ color: theme.accent, backgroundColor: 'transparent' }}
                >
                    +
                </button>
            </div>

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


