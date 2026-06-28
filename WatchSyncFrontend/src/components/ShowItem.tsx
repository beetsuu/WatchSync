import { updateShow } from "../api/client";
import type { Show } from "../types";

function ShowItem({ show, onPlusOne, addedByUserName }: { show: Show, onPlusOne: (show: Show) => void, addedByUserName: string }) {

    function handlePlusOne(): void {
        const updatedShow = { ...show, currentEpisode: show.currentEpisode + 1 };
        updateShow(updatedShow);
        onPlusOne(updatedShow);
    }

    return (
        <div>
            {/*<p>{show.showId} </p>*/}
            <p> {show.title} </p>
            <p> {show.currentEpisode} / {show.totalEpisodes}</p>
            <p> {addedByUserName}</p>
            <button onClick={handlePlusOne}>+1</button>
        </div>)
}
export default ShowItem;