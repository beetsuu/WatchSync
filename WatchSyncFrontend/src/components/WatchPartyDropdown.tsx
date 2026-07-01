import { useState } from "react";
import type { WatchParty } from "../types";
import { theme } from "../theme";
import { PiArrowFatLineDownFill, PiArrowFatLineUpFill } from "react-icons/pi";

function WatchPartyDropdown({ watchParties, selected, onSelect }: { watchParties: WatchParty[], selected: WatchParty, onSelect: (wp: WatchParty) => void }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="h-10 px-4 flex items-center gap-2 font-medium"
                style={{ backgroundColor: theme.card, borderRadius: theme.radius, border: `1px solid ${theme.border}`, color: theme.text }}
            >
                {selected.name}
                <span>{open ? <PiArrowFatLineUpFill size={16} /> : <PiArrowFatLineDownFill size={16} />}</span>
            </button>

            {open && (
                <div
                    className="absolute top-full left-0 mt-1 flex flex-col w-full z-50"
                    style={{ backgroundColor: theme.card, borderRadius: theme.radius, border: `1px solid ${theme.border}` }}
                >
                    {watchParties
                        .filter(wp => wp.watchPartyId !== selected.watchPartyId)
                        .map(wp => (
                            <button
                                key={wp.watchPartyId}
                                onClick={() => { onSelect(wp); setOpen(false); }}
                                className="px-3 py-2 text-left hover:opacity-80"
                                style={{ color: theme.text }}
                            >
                                {wp.name}
                            </button>
                        ))}
                </div>
            )}
        </div>
    );
}

export default WatchPartyDropdown;