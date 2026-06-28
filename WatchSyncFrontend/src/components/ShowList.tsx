import type { Show } from "../types";

function ShowList({ shows }: { shows: Show[] }) {
    return (
        <div>
            {shows.map(show => (
                <div key={show.showId}>
                    <p> {show.title}</p>
                    <p> {show.currentEpisode} / {show.totalEpisodes}</p>
                    <p> {show.addedByUserId}</p>
                </div>
            ))}
        </div>
    );
}

export default ShowList;