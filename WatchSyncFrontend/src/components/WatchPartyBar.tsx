import type { User, WatchParty } from "../types/index.ts";
import { theme } from "../theme";

function WatchPartyBar({ watchParty, currentUser, onPrevUser, onNextUser }: { watchParty: WatchParty, currentUser: User, onPrevUser: () => void, onNextUser: () => void }) {
    return (
        <div className="flex flex-col items-center">
            <span style={{ color: theme.textMuted, fontSize: '12px' }}>{watchParty.name}</span>
            <div className="flex items-center gap-4">
                <button onClick={onPrevUser} style={theme.buttonStyle}>←</button>
                <div className="flex flex-col items-center">
                    <span className="font-bold">{currentUser.name}</span>
                    <span style={{ fontFamily: 'monospace', color: theme.textMuted }}>
                        {watchParty.currentTurnCount} / {watchParty.turnLimit}
                    </span>
                </div>
                <button onClick={onNextUser} style={theme.buttonStyle}>→</button>
            </div>
        </div>
    );
}
export default WatchPartyBar;