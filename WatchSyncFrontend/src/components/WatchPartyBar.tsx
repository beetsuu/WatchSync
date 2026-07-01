import type { User, WatchParty } from "../types/index.ts";
import { theme } from "../theme";

function WatchPartyBar({ watchParty, currentUser, onPrevUser, onNextUser }: { watchParty: WatchParty, currentUser: User, onPrevUser: () => void, onNextUser: () => void }) {
    return (
        <div className="flex items-center gap-2">
            <button onClick={onPrevUser} style={theme.buttonStyle}>←</button>
            <div className="flex flex-col items-center">
                <span style={{ color: theme.textMuted, fontSize: '11px' }}>{watchParty.name}</span>
                <span className="font-bold text-sm">{currentUser.displayName}</span>
                <span style={{ fontFamily: 'monospace', color: theme.textMuted, fontSize: '11px' }}>
                    {watchParty.currentTurnCount} / {watchParty.turnLimit}
                </span>
            </div>
            <button onClick={onNextUser} style={theme.buttonStyle}>→</button>
        </div>
    );
}
export default WatchPartyBar;