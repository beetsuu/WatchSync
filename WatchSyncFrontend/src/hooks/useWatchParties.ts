import { useState, useEffect } from 'react';
import { getWatchParties, getWatchPartyMembers, updateWatchParty, createWatchParty, getAllWatchPartyMembers, deleteWatchParty, leaveWatchParty } from '../api/client';
import type { WatchParty, WatchPartyMember } from '../types';

export function useWatchParty() {
    const [watchParties, setWatchParties] = useState<WatchParty[]>([]);
    const [selectedWatchParty, setSelectedWatchParty] = useState<WatchParty | null>(null);
    const [allMembers, setAllMembers] = useState<WatchPartyMember[]>([]);

    useEffect(() => {
        getWatchParties().then(data => setWatchParties(data));
    }, []);

    useEffect(() => {
        if (!selectedWatchParty) {
            setAllMembers([]);
            return;
        }

        getWatchPartyMembers(selectedWatchParty.watchPartyId)
            .then(data =>
                setAllMembers(
                    data.sort((a, b) => a.turnOrder - b.turnOrder)
                )
            );
    }, [selectedWatchParty]);

    const members = allMembers;

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

        setWatchParties(prev => [...prev, newWp]);

        const data = await getAllWatchPartyMembers();

        setAllMembers(
            data.sort((a, b) => a.turnOrder - b.turnOrder)
        );

        setSelectedWatchParty(newWp);
    }

    async function handleEditWatchParty(updatedWP: WatchParty) {
        await updateWatchParty(updatedWP);
        setWatchParties(prev =>
            prev.map(wp =>
                wp.watchPartyId === updatedWP.watchPartyId
                    ? updatedWP
                    : wp
            )
        );
        if (selectedWatchParty?.watchPartyId === updatedWP.watchPartyId) {
            setSelectedWatchParty(updatedWP);
        }
    }

    async function handleDeleteWatchParty(id: number) {
        await deleteWatchParty(id);

        setWatchParties(prev =>
            prev.filter(wp => wp.watchPartyId !== id)
        );

        if (selectedWatchParty?.watchPartyId === id) {
            setSelectedWatchParty(null);
        }
    }

    async function handleLeaveWatchParty(id: number) {
        await leaveWatchParty(id);

        setWatchParties(prev =>
            prev.filter(wp => wp.watchPartyId !== id)
        );

        setAllMembers(prev =>
            prev.filter(m => m.watchPartyId !== id)
        );

        if (selectedWatchParty?.watchPartyId === id) {
            setSelectedWatchParty(null);
        }
    }

    return { watchParties, setWatchParties, selectedWatchParty, setSelectedWatchParty, members, handleTurnCountUp, handleTurnCountDown, handleNextUser, handlePrevUser, handleCreateWatchParty, handleEditWatchParty, handleDeleteWatchParty, handleLeaveWatchParty };
}