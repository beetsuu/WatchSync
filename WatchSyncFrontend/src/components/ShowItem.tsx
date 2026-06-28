import { updateShow } from "../api/client";
import { theme } from "../theme";
import type { Show } from "../types";

function ShowItem({ show, onPlusOne, onMinusOne, addedByUserName }: { show: Show, onPlusOne: (show: Show) => void, onMinusOne: (show: Show) => void, addedByUserName: string }) {

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

    return (
        <div className="flex flex-col border overflow-hidden" style={{ backgroundColor: theme.card, borderColor: theme.border, borderRadius: theme.radius }}>

            {/* Bild oben */}
            <div className="w-full h-40" style={{ backgroundColor: theme.border }}>
                {show.coverUrl
                    ? <img src={show.coverUrl} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center" style={{ color: theme.textMuted }}>no image</div>
                }
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1 p-4">
                <p className="font-bold">{show.title}</p>
                <p style={{ color: theme.textMuted, fontSize: '12px' }}>{addedByUserName}</p>
                <p style={{ fontFamily: 'monospace' }}>{show.currentEpisode} / {show.totalEpisodes}</p>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 p-4 pt-0">
                <button onClick={handleMinusOne} className="flex-1 py-2 font-bold" style={theme.buttonStyle}>-1</button>
                <button onClick={handlePlusOne} className="flex-1 py-2 font-bold" style={theme.buttonStyle}>+1</button>
            </div>
        </div>
    )
}
export default ShowItem;