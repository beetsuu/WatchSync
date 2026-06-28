import type { Show } from "../types";
import ShowItem from "../components/ShowItem";

function ShowList({ shows, onPlusOne }: { shows: Show[], onPlusOne: (show: Show) => void }) {
    return (
        <div>
            {shows.map(show => (
                <ShowItem key={show.showId} show={show} onPlusOne={onPlusOne} />
            ))}
        </div>
    );
}

export default ShowList;