import { useState } from "react";
import type { CreateShowDto, WatchParty } from "../types";
import { theme } from "../theme";

function AddShowModal({
    watchParty,
    onAdd,
    onClose
}: {
    watchParty: WatchParty,
    onAdd: (show: CreateShowDto) => void,
    onClose: () => void
}) {

    const [title, setTitle] = useState("");
    const [totalEpisodes, setTotalEpisodes] = useState(1);
    const [coverUrl, setCoverUrl] = useState("");

    function handleAdd() {

        if (!title.trim()) {
            return;
        }

        const newShow = {
            watchPartyId: watchParty.watchPartyId,
            title: title.trim(),
            totalEpisodes,
            currentEpisode: 0,
            coverUrl: coverUrl.trim() || null
        };

        onAdd(newShow);
        onClose();
    }

    return (
        <div
            className="flex flex-col gap-4 p-6 w-80"
            style={{
                backgroundColor: theme.card,
                borderRadius: theme.radius,
                border: `1px solid ${theme.border}`,
                alignItems: "center"
            }}
        >

            <h2 className="font-bold text-lg">
                Add Show
            </h2>


            <input
                placeholder="Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="px-3 py-2 rounded bg-black/30 outline-none w-full"
            />


            <div className="w-full">
                <label className="text-sm opacity-70 block text-center">
                    Episode count
                </label>

                <input
                    type="number"
                    min={1}
                    value={totalEpisodes}
                    onChange={e =>
                        setTotalEpisodes(Number(e.target.value))
                    }
                    className="px-3 py-2 rounded bg-black/30 outline-none w-full"
                />
            </div>


            <div className="w-full">
                <label className="text-sm opacity-70 block text-center">
                    Cover URL (optional)
                </label>

                <input
                    placeholder="https://..."
                    value={coverUrl}
                    onChange={e => setCoverUrl(e.target.value)}
                    className="px-3 py-2 rounded bg-black/30 outline-none w-full"
                />
            </div>


            <div className="flex gap-2">

                <button
                    onClick={handleAdd}
                    style={theme.buttonStyle}
                >
                    Add
                </button>

                <button
                    onClick={onClose}
                    style={theme.buttonStyle}
                >
                    Cancel
                </button>

            </div>

        </div>
    );
}

export default AddShowModal;