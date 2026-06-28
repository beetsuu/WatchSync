import type { User, WatchParty } from "../types/index.ts";

function WatchPartyBar({ watchParty, currentUser, onPrevUser, onNextUser }: { watchParty: WatchParty, currentUser: User, onPrevUser: () => void, onNextUser: () => void }) {
    return (
        <p>
            <button onClick={onPrevUser}> {' <- '} </button> | {currentUser.avatarUrl}
            {currentUser.name} | {watchParty.currentTurnCount} / {watchParty.turnLimit} |
            <button onClick={onNextUser}> {' -> '} </button>
        </p>
    );
}

export default WatchPartyBar;