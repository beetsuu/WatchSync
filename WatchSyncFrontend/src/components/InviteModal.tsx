import { useState } from "react";
import type { WatchParty } from "../types";
import { theme } from "../theme";
import { joinWatchParty } from "../api/client";

export default function InviteModal({ watchParty, onClose, onJoined }: {
    watchParty: WatchParty | null,
    onClose: () => void,
    onJoined: (wp: WatchParty) => void
}) {
    const [copied, setCopied] = useState(false);
    const [joinCode, setJoinCode] = useState('');
    const [error, setError] = useState('');
    const [joining, setJoining] = useState(false);


    function handleCopy() {
        if (!watchParty) return;
        navigator.clipboard.writeText(watchParty.inviteCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    async function handleJoin() {
        if (!joinCode.trim()) return;
        setError('');
        setJoining(true);
        try {
            const wp = await joinWatchParty(joinCode.trim().toUpperCase());
            onJoined(wp);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to join');
        } finally {
            setJoining(false);
        }
    }

    return (
        <div className="flex flex-col gap-5 p-6 w-80"
            style={{ backgroundColor: theme.card, borderRadius: theme.radius, border: `1px solid ${theme.border}` }}>

            {watchParty && !watchParty.isPersonal && (
                <>
                    <div className="flex flex-col items-center gap-2">
                        <h2 className="font-bold text-lg">Invite to {watchParty.name}</h2>
                        <p style={{ color: theme.textMuted, fontSize: '14px' }}>Share this code with friends</p>
                    </div>
                    <div
                        className="w-full py-4 text-center tracking-widest text-2xl font-bold cursor-pointer"
                        onClick={handleCopy}
                        style={{
                            backgroundColor: theme.background,
                            borderRadius: theme.radius,
                            border: `1px solid ${theme.border}`,
                            color: theme.accent,
                            fontFamily: 'monospace'
                        }}
                    >
                        {watchParty.inviteCode}
                    </div>
                    <button onClick={handleCopy} style={theme.buttonStyle} className="w-full">
                        {copied ? '✓ Copied!' : 'Copy Code'}
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-px" style={{ backgroundColor: theme.border }} />
                        <span style={{ color: theme.textMuted, fontSize: '13px' }}>or join one</span>
                        <div className="flex-1 h-px" style={{ backgroundColor: theme.border }} />
                    </div>
                </>
            )}

            {/* Untere Hälfte: Code eingeben zum Beitreten */}
            <div className="flex flex-col items-center gap-2">
                <input
                    placeholder="Enter invite code"
                    value={joinCode}
                    onChange={e => setJoinCode(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 text-center uppercase tracking-widest"
                    style={{
                        backgroundColor: theme.background,
                        color: theme.text,
                        border: `1px solid ${theme.border}`,
                        borderRadius: theme.radius,
                        fontFamily: 'monospace',
                        fontSize: '18px'
                    }}
                />
                <div></div>
                {error && <p style={{ color: '#ff6b6b', fontSize: '14px' }}>{error}</p>}
                <button onClick={handleJoin} disabled={joining} style={theme.buttonStyle} className="w-full">
                    {joining ? 'Joining...' : 'Join Watch Party'}
                </button>

                <button onClick={onClose} style={theme.errorButton} className="w-full">
                    Close
                </button>
            </div>
        </div>
    );
}