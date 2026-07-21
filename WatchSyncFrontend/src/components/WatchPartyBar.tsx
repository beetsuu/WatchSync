import type { WatchParty, WatchPartyMember } from "../types/index.ts";
import { theme } from "../theme";
import { PiArrowFatLineLeftFill, PiArrowFatLineRightFill } from "react-icons/pi";
import { getAvatarUrl } from "../api/client";


function WatchPartyBar({ watchParty, currentTurnMember, onPrevUser, onNextUser, memberCount }: { watchParty: WatchParty, currentTurnMember: WatchPartyMember | null | undefined, onPrevUser: () => void, onNextUser: () => void, memberCount: number }) {

    console.log(currentTurnMember);
    return (
        <div className="flex items-center gap-2">
            {memberCount > 1 && (
                <button onClick={onPrevUser} style={theme.darkButton} className="h-10 px-4 flex items-center gap-2">
                    <PiArrowFatLineLeftFill />
                </button>
            )}

            <div className="flex flex-col items-center">
                {currentTurnMember ? (
                    <div className="flex items-center gap-2">
                        <img
                            src={
                                currentTurnMember.avatarUrl
                                    ? getAvatarUrl(currentTurnMember.avatarUrl)
                                    : "/default-avatar.png"
                            }
                            alt="Profile"
                            className="w-8 h-8 rounded-full object-cover"
                        />

                        <span className="font-bold text-lg">
                            {currentTurnMember.displayName}
                        </span>
                    </div>
                ) : (
                    <span className="font-bold text-lg">
                        Unknown
                    </span>
                )}

                {watchParty.turnLimit > 0 &&
                    <span
                        style={{
                            fontFamily: 'monospace',
                            color: theme.textMuted,
                            fontSize: '13px'
                        }}
                    >
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