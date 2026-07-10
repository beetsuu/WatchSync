import type { WatchParty } from "../types/index.ts";
import { theme } from "../theme";
import { PiArrowFatLineLeftFill, PiArrowFatLineRightFill } from "react-icons/pi";


function WatchPartyBar({ watchParty, currentTurnName, onPrevUser, onNextUser, memberCount }: { watchParty: WatchParty, currentTurnName: string, onPrevUser: () => void, onNextUser: () => void, memberCount: number }) {
    return (
        <div className="flex items-center gap-2">
            {memberCount > 1 && (
                <button onClick={onPrevUser} style={theme.darkButton} className="h-10 px-4 flex items-center gap-2">
                    <PiArrowFatLineLeftFill />
                </button>
            )}

            <div className="flex flex-col items-center">
                <span className="font-bold text-lg">{currentTurnName}</span>
                {watchParty.turnLimit > 0 &&
                    <span style={{ fontFamily: 'monospace', color: theme.textMuted, fontSize: '13px' }}>
                        {watchParty.currentTurnCount} / {watchParty.turnLimit}
                    </span>
                }
            </div>
            {memberCount > 1 && (
                <button onClick={onNextUser} style={theme.darkButton} className="h-10 px-4 flex items-center gap-2">
                    <PiArrowFatLineRightFill />
                </button>
            )}
        </div>
    );
}
export default WatchPartyBar;