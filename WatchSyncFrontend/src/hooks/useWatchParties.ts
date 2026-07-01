import { useState, useEffect } from 'react';
import { getWatchParties, updateWatchParty, createWatchParty, getWatchPartyMembers } from '../api/client';
import type { WatchParty, WatchPartyMember } from '../types';

export function useWatchParty() {
    const [watchParties, setWatchParties] = useState<WatchParty[]>([]);
    const [selectedWatchParty, setSelectedWatchParty] = useState<WatchParty | null>(null);
    const [members, setMembers] = useState<WatchPartyMember[]>([]);

    useEffect(() => {
        getWatchParties().then(data => setWatchParties(data));
        getWatchPartyMembers().then(data => setMembers(data.sort((a, b) => a.turnOrder - b.turnOrder)));
    }, []);

    function handleTurnCountUp() {
        if (!selectedWatchParty) return;
        const updated = { ...selectedWatchParty, currentTurnCount: selectedWatchParty.currentTurnCount + 1 };
        updateWatchParty(updated);
        setSelectedWatchParty(updated);
    }

    function handleTurnCountDown() {
        if (!selectedWatchParty || selectedWatchParty.currentTurnCount <= 0) return;
        const updated = { ...selectedWatchParty, currentTurnCount: selectedWatchParty.currentTurnCount - 1 };
        updateWatchParty(updated);
        setSelectedWatchParty(updated);
    }
    function handleNextUser() {
        if (!selectedWatchParty || members.length === 0) return;
        const nextOrder = selectedWatchParty.currentTurnOrder % members.length + 1;
        const updated = { ...selectedWatchParty, currentTurnOrder: nextOrder, currentTurnCount: 0 };
        updateWatchParty(updated);
        setSelectedWatchParty(updated);
    }

    function handlePrevUser() {
        if (!selectedWatchParty || members.length === 0) return;
        const prevOrder = selectedWatchParty.currentTurnOrder === 1 ? members.length : selectedWatchParty.currentTurnOrder - 1;
        const updated = { ...selectedWatchParty, currentTurnOrder: prevOrder, currentTurnCount: 0 };
        updateWatchParty(updated);
        setSelectedWatchParty(updated);
    }

    async function handleCreateWatchParty(name: string, turnLimit: number) {
        const newWp = await createWatchParty({ name, turnLimit });
        setSelectedWatchParty(newWp);
        getWatchPartyMembers().then(data => setMembers(data.sort((a, b) => a.turnOrder - b.turnOrder)));
    }

    return { watchParties, selectedWatchParty, setSelectedWatchParty, members, handleTurnCountUp, handleTurnCountDown, handleNextUser, handlePrevUser, handleCreateWatchParty };
}