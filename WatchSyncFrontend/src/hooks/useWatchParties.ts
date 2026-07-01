import { useState, useEffect } from 'react';
import { getWatchParties, updateWatchParty, createWatchParty, getWatchPartyMembers } from '../api/client';
import type { WatchParty, WatchPartyMember } from '../types';

export function useWatchParty() {
    const [watchParty, setWatchParty] = useState<WatchParty | null>(null);
    const [members, setMembers] = useState<WatchPartyMember[]>([]);

    useEffect(() => {
        getWatchParties().then(data => setWatchParty(data[0]));
        getWatchPartyMembers().then(data => setMembers(data.sort((a, b) => a.turnOrder - b.turnOrder)));
    }, []);

    function handleTurnCountUp() {
        if (!watchParty) return;
        const updated = { ...watchParty, currentTurnCount: watchParty.currentTurnCount + 1 };
        updateWatchParty(updated);
        setWatchParty(updated);
    }

    function handleTurnCountDown() {
        if (!watchParty || watchParty.currentTurnCount <= 0) return;
        const updated = { ...watchParty, currentTurnCount: watchParty.currentTurnCount - 1 };
        updateWatchParty(updated);
        setWatchParty(updated);
    }
    function handleNextUser() {
        if (!watchParty || members.length === 0) return;
        const nextOrder = watchParty.currentTurnOrder % members.length + 1;
        const updated = { ...watchParty, currentTurnOrder: nextOrder, currentTurnCount: 0 };
        updateWatchParty(updated);
        setWatchParty(updated);
    }

    function handlePrevUser() {
        if (!watchParty || members.length === 0) return;
        const prevOrder = watchParty.currentTurnOrder === 1 ? members.length : watchParty.currentTurnOrder - 1;
        const updated = { ...watchParty, currentTurnOrder: prevOrder, currentTurnCount: 0 };
        updateWatchParty(updated);
        setWatchParty(updated);
    }

    async function handleCreateWatchParty(name: string, turnLimit: number) {
        const newWp = await createWatchParty({ name, turnLimit });
        setWatchParty(newWp);
        getWatchPartyMembers().then(data => setMembers(data.sort((a, b) => a.turnOrder - b.turnOrder)));
    }

    return { watchParty, members, handleTurnCountUp, handleTurnCountDown, handleNextUser, handlePrevUser, handleCreateWatchParty };
}