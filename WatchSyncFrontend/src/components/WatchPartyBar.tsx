import type { User, WatchParty } from "../types/index.ts";

function WatchPartyBar({ watchParty, currentUser }: { watchParty: WatchParty, currentUser: User }) {
    return (
        <p>
            {currentUser.name} {watchParty.currentTurnCount} / {watchParty.turnLimit}
        </p>
    );
}

export default WatchPartyBar;