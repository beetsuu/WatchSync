import type { Show, User } from "../types";
import ShowItem from "../components/ShowItem";

function ShowList({ shows, onPlusOne, users }: { shows: Show[], onPlusOne: (show: Show) => void, users: User[] }) {


    return (
        shows.map(show => {
            const user = users.find(u => u.userId === show.addedByUserId);
            return <ShowItem
                key={show.showId}
                show={show}
                onPlusOne={onPlusOne}
                addedByUserName={user?.name ?? 'Unknown'}
            />
        }))
}

export default ShowList;