import type { Show } from "../types";
import ShowItem from "../components/ShowItem";

function ShowList({ shows, onPlusOne, onMinusOne, onDelete, onEdit }:
    { shows: Show[], onPlusOne: (show: Show) => void, onMinusOne: (show: Show) => void, onDelete: (showId: number) => void, onEdit: (show: Show) => void }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
            {shows.map(show => (
                <ShowItem
                    key={show.showId}
                    show={show}
                    onMinusOne={onMinusOne}
                    onPlusOne={onPlusOne}
                    onDelete={onDelete}
                    onEdit={onEdit}
                />
            ))}
        </div>
    )
}

export default ShowList;