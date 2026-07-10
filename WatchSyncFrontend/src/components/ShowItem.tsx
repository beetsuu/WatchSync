import { useEffect, useRef, useState } from "react";
import { deleteShow, updateShow } from "../api/client";
import { theme } from "../theme";
import { IoMdSettings } from "react-icons/io";
import type { Show } from "../types";
import Modal from "./Modal";

const HOLD_DELAY_MS = 500;
const HOLD_INTERVAL_MS = 200;

type ShowItemProps = {
    show: Show;
    onPlusOne: (show: Show) => void;
    onMinusOne: (show: Show) => void;
    onDelete: (showId: number) => void;
    onEdit: (show: Show) => void;
};

function ShowItem({ show, onPlusOne, onMinusOne, onDelete, onEdit }: ShowItemProps) {
    const [showSettings, setShowSettings] = useState(false);
    const [editTitle, setEditTitle] = useState(show.title);
    const [editEpisodes, setEditEpisodes] = useState(show.totalEpisodes);
    const [editCoverUrl, setEditCoverUrl] = useState(show.coverUrl ?? "");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const isFinished = show.currentEpisode >= show.totalEpisodes && show.totalEpisodes > 0;


    const holdTimeout = useRef<number | null>(null);
    const holdInterval = useRef<number | null>(null);

    const showRef = useRef(show);
    useEffect(() => {
        showRef.current = show;
    }, [show]);

    function clearHoldTimers() {
        if (holdTimeout.current) {
            clearTimeout(holdTimeout.current);
            holdTimeout.current = null;
        }
        if (holdInterval.current) {
            clearInterval(holdInterval.current);
            holdInterval.current = null;
        }
        window.removeEventListener("pointerup", stopHold);
        window.removeEventListener("pointercancel", stopHold);
    }

    function handleStep(delta: 1 | -1) {
        const current = showRef.current;
        const next = current.currentEpisode + delta;
        if (next < 0 || next > current.totalEpisodes) {
            clearHoldTimers();
            return;
        }

        const updatedShow = { ...current, currentEpisode: next };
        if (delta === 1) {
            onPlusOne(updatedShow);
        } else {
            onMinusOne(updatedShow);
        }
    }


    function startHold(delta: 1 | -1) {
        clearHoldTimers();
        handleStep(delta);

        holdTimeout.current = window.setTimeout(() => {
            holdInterval.current = window.setInterval(() => {
                handleStep(delta);
            }, HOLD_INTERVAL_MS);
        }, HOLD_DELAY_MS);

        window.addEventListener("pointerup", stopHold);
        window.addEventListener("pointercancel", stopHold);
    }

    function stopHold() {
        clearHoldTimers();
    }

    useEffect(() => clearHoldTimers, []);

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
        <div
            className="flex flex-col overflow-hidden relative transition-opacity"
            style={{
                backgroundColor: theme.card,
                borderRadius: theme.radius,
                border: isFinished ? `1px solid ${theme.accent}` : `1px solid ${theme.border}`,
                opacity: isFinished ? 0.75 : 1,
            }}
        >
            <div className="w-full relative" style={{ height: "200px", backgroundColor: theme.border }}>
                {isFinished && (
                    <div
                        className="absolute top-2 left-2 px-2 py-1 text-xs font-bold"
                        style={{ backgroundColor: theme.darkButton.backgroundColor, borderRadius: "6px", color: "#ffffff" }}
                    >
                        ✓ Done
                    </div>
                )}
                {show.coverUrl ? (
                    <img src={show.coverUrl} className="w-full h-full object-cover" alt={show.title} />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm" style={{ color: theme.textMuted }}>
                        no image
                    </div>
                )}
                <button
                    onClick={() => setShowSettings(true)}
                    className="absolute top-2 right-2 text-xs px-2 py-1"
                    style={{ backgroundColor: "rgba(0,0,0,0.6)", borderRadius: "6px", color: "#ffffff", height: "30px", fontSize: "16px" }}
                >
                    <IoMdSettings />
                </button>
                <div
                    className="absolute bottom-2 left-2 px-2 py-1 text-xs font-mono font-bold"
                    style={{ backgroundColor: "rgba(0,0,0,0.8)", borderRadius: "6px", color: theme.accent }}
                >
                    {show.currentEpisode} / {show.totalEpisodes}
                </div>
            </div>

            <div className="p-3 flex flex-col gap-1">
                <p className="font-bold text-sm">{show.title}</p>
                <p className="text-xs" style={{ color: theme.textMuted }}>{show.addedByUserName}</p>
            </div>

            <div className="flex border-t" style={{ borderColor: theme.border }}>
                <button
                    onPointerDown={() => startHold(-1)}
                    disabled={show.currentEpisode <= 0}
                    className="flex-1 py-2 font-bold text-base select-none"
                    style={{ color: theme.accent, backgroundColor: "transparent", touchAction: "none" }}
                >
                    −
                </button>
                <div style={{ width: "1px", backgroundColor: theme.border }}></div>
                <button
                    onPointerDown={() => startHold(1)}
                    disabled={show.currentEpisode >= show.totalEpisodes}
                    className="flex-1 py-2 font-bold text-base select-none"
                    style={{ color: theme.accent, backgroundColor: "transparent", touchAction: "none" }}
                >
                    +
                </button>
            </div>

            {showSettings && (
                <Modal onClose={() => setShowSettings(false)}>
                    <div className="flex flex-col gap-4 p-6 w-80" style={{ backgroundColor: theme.card, borderRadius: theme.radius, border: `1px solid ${theme.border}` }}>
                        <h2>Edit Show</h2>
                        <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Title" />
                        <input type="number" value={editEpisodes} onChange={(e) => setEditEpisodes(Number(e.target.value))} placeholder="Total Episodes" />
                        <input value={editCoverUrl} onChange={(e) => setEditCoverUrl(e.target.value)} placeholder="Cover URL" />
                        <button style={theme.buttonStyle} onClick={handleSave}>Save</button>
                        <button style={{ ...theme.buttonStyle, backgroundColor: "#C0392B", borderColor: "#C0392B" }} onClick={() => setShowDeleteConfirm(true)}>Delete</button>
                    </div>
                </Modal>
            )}

            {showDeleteConfirm && (
                <Modal onClose={() => setShowDeleteConfirm(false)}>
                    <div className="flex flex-col gap-4 p-6 w-80" style={{ backgroundColor: theme.card, borderRadius: theme.radius, border: `1px solid ${theme.border}` }}>
                        <h2>Are you sure?</h2>
                        <p style={{ color: theme.textMuted }}>This will permanently delete "{show.title}".</p>
                        <div className="flex gap-2">
                            <button style={{ ...theme.buttonStyle, backgroundColor: "#C0392B" }} onClick={handleDelete}>Yes, delete</button>
                            <button style={theme.buttonStyle} onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}

export default ShowItem;