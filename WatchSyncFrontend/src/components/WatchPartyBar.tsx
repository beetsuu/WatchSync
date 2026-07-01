import type { User, WatchParty } from "../types/index.ts";
import { theme } from "../theme";
import { PiArrowFatLineLeftFill, PiArrowFatLineRightFill } from "react-icons/pi";

function WatchPartyBar({ watchParty, currentUser, onPrevUser, onNextUser }: { watchParty: WatchParty, currentUser: User, onPrevUser: () => void, onNextUser: () => void }) {
    return (

        <div className="flex items-center gap-2">

            <button onClick={onPrevUser} style={theme.darkButton} className="h-10 px-4 flex items-center gap-2"><PiArrowFatLineLeftFill /></button>
            <div className="flex flex-col items-center">
                <span className="font-bold text-lg">{currentUser.displayName}</span>
                <span style={{ fontFamily: 'monospace', color: theme.textMuted, fontSize: '13px' }}>
                    {watchParty.currentTurnCount} / {watchParty.turnLimit}
                </span>
            </div>
            <button onClick={onNextUser} style={theme.darkButton} className="h-10 px-4 flex items-center gap-2"><PiArrowFatLineRightFill /></button>
        </div>
    );
}
export default WatchPartyBar;