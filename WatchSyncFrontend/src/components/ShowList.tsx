import type { Show, User } from "../types";
import ShowItem from "../components/ShowItem";

function ShowList({ shows, onPlusOne, onMinusOne, users }: { shows: Show[], onPlusOne: (show: Show) => void, onMinusOne: (show: Show) => void, users: User[] }) {


    return (
        <div className="grid grid-cols-4 gap-4 p-6">

            {shows.map(show => {
                const user = users.find(u => u.userId === show.addedByUserId);
                return <ShowItem
                    key={show.showId}
                    show={show}
                    onMinusOne={onMinusOne}
                    onPlusOne={onPlusOne}
                    addedByUserName={user?.name ?? 'Unknown'}
                />
            })}
        </div>
    )
}

export default ShowList;