import { useState } from "react";
import type { WatchParty } from "../types";
import { theme } from "../theme";
import { PiArrowFatLineDownFill, PiArrowFatLineUpFill } from "react-icons/pi";

function WatchPartyDropdown({ watchParties, selected, onSelect }: { watchParties: WatchParty[], selected: WatchParty, onSelect: (wp: WatchParty) => void }) {
    const [open, setOpen] = useState(false);

    const sortedWatchParties = [...watchParties].sort(
        (a, b) => Number(b.isPersonal) - Number(a.isPersonal)
    );
    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="h-10 w-30 px-4 flex items-center gap-2 font-medium"
                style={{ backgroundColor: theme.card, borderRadius: theme.radius, border: `1px solid ${theme.border}`, color: theme.text }}
            >
                <span
                    className="truncate min-w-0 flex-1 text-left"
                    style={{
                        color: selected.isPersonal ? theme.accent : theme.text
                    }}
                >
                    {selected.name}
                </span>
                {watchParties.length > 1 && (
                    <span className="shrink-0">{open ? <PiArrowFatLineUpFill size={12} /> : <PiArrowFatLineDownFill size={12} />}</span>
                )}
            </button>
            {open && watchParties.length > 1 && (
                <div
                    className="absolute top-full left-0 mt-1 flex flex-col w-full z-50"
                    style={{ backgroundColor: theme.card, borderRadius: theme.radius, border: `1px solid ${theme.border}` }}
                >
                    {sortedWatchParties
                        .filter(wp => wp.watchPartyId !== selected.watchPartyId)
                        .map(wp => (
                            <button
                                key={wp.watchPartyId}
                                onClick={() => { onSelect(wp); setOpen(false); }}
                                className="px-3 py-2 text-left hover:opacity-80 truncate"
                                style={{
                                    color: wp.isPersonal ? theme.accent : theme.text,
                                    fontWeight: wp.isPersonal ? 600 : 400
                                }}
                            >
                                {wp.isPersonal ? wp.name : wp.name}
                            </button>
                        ))}
                </div>
            )}
        </div>
    );
}
export default WatchPartyDropdown;