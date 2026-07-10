import { useEffect, useState } from "react";
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
    const [results, setResults] = useState<any[]>([]);
    const [selectedShow, setSelectedShow] = useState<any>(null);
    const [manualMode, setManualMode] = useState(false);

    const [totalEpisodes, setTotalEpisodes] = useState(1);


    useEffect(() => {

        if (title.length < 3) {
            setResults([]);
            return;
        }

        const timeout = setTimeout(async () => {

            const res = await fetch(
                `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(title)}`
            );

            const data = await res.json();

            setResults(data.slice(0, 5));

        }, 500);


        return () => clearTimeout(timeout);

    }, [title]);



    async function selectShow(show: any) {

        setSelectedShow(show);
        setTitle(show.name);

        setResults([]);

        const res = await fetch(
            `https://api.tvmaze.com/shows/${show.id}/episodes`
        );

        const episodes = await res.json();

        setTotalEpisodes(
            episodes.length
        );
    }


    function handleAdd() {

        if (!title.trim()) return;

        const newShow = {
            watchPartyId: watchParty.watchPartyId,
            title: title.trim(),
            totalEpisodes,
            currentEpisode: 0,
            coverUrl: selectedShow?.image?.original ?? null
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


            {!manualMode ? (
                <>
                    <div className="w-full relative">

                        <input
                            placeholder="Search show..."
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="px-3 py-2 rounded bg-black/30 outline-none w-full"
                        />

                        {results.length > 0 && (
                            <div
                                className="absolute top-full left-0 w-full z-10"
                                style={{
                                    backgroundColor: theme.card,
                                    border: `1px solid ${theme.border}`
                                }}
                            >
                                {results.map(result => (
                                    <button
                                        key={result.show.id}
                                        onClick={() => selectShow(result.show)}
                                        className="w-full text-left px-3 py-2"
                                    >
                                        {result.show.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => {
                            setManualMode(true);
                            setSelectedShow(null);
                            setResults([]);
                        }}
                        className="text-sm"
                        style={{
                            color: theme.accent
                        }}
                    >
                        Can't find it? Add your own show
                    </button>
                </>
            ) : (
                <>
                    <input
                        placeholder="Show title"
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
                            onChange={e => setTotalEpisodes(Number(e.target.value))}
                            className="px-3 py-2 rounded bg-black/30 outline-none w-full"
                        />
                    </div>

                    <button
                        onClick={() => {
                            setManualMode(false);
                            setTitle("");
                        }}
                        className="text-sm"
                        style={{
                            color: theme.accent
                        }}
                    >
                        ← Back to search
                    </button>
                </>

            )}

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