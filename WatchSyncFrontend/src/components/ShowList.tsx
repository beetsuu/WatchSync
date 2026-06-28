import type { Show, User } from "../types";
import ShowItem from "../components/ShowItem";

function ShowList({ shows, onPlusOne, onMinusOne, users, onDelete, onEdit }:
    { shows: Show[], onPlusOne: (show: Show) => void, onMinusOne: (show: Show) => void, users: User[], onDelete: (showId: number) => void, onEdit: (show: Show) => void }) {


    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">

            {shows.map(show => {
                const user = users.find(u => u.userId === show.addedByUserId);
                return <ShowItem
                    key={show.showId}
                    show={show}
                    onMinusOne={onMinusOne}
                    onPlusOne={onPlusOne}
                    addedByUserName={user?.name ?? 'Unknown'}
                    onDelete={onDelete}
                    onEdit={onEdit}

                />
            })}
        </div>
    )
}

export default ShowList;