import { useState, useEffect } from 'react';
import { getShows, updateShow, createShow, deleteShow } from '../api/client';
import type { Show, CreateShowDto } from '../types';

export function useShows(selectedWatchPartyId: number | null) {
    const [allShows, setAllShows] = useState<Show[]>([]);

    useEffect(() => {
        getShows().then(data => setAllShows(data.sort((a, b) => a.showId - b.showId)));
    }, []);

    // Nur Shows der ausgewählten WatchParty
    const shows = selectedWatchPartyId
        ? allShows.filter(s => s.watchPartyId === selectedWatchPartyId)
        : [];

    function handlePlusOne(updatedShow: Show) {
        setAllShows(allShows.map(s => s.showId === updatedShow.showId ? updatedShow : s));
        updateShow(updatedShow);
    }

    function handleMinusOne(updatedShow: Show) {
        setAllShows(allShows.map(s => s.showId === updatedShow.showId ? updatedShow : s));
        updateShow(updatedShow);
    }

    async function handleAddShow(newShow: CreateShowDto) {
        const createdShow = await createShow(newShow);
        setAllShows(prev => [...prev, createdShow]);
    }

    async function handleDelete(showId: number) {
        await deleteShow(showId);
        setAllShows(prev => prev.filter(s => s.showId !== showId));
    }

    async function handleEdit(updatedShow: Show) {
        await updateShow(updatedShow);
        setAllShows(prev => prev.map(s => s.showId === updatedShow.showId ? updatedShow : s));
    }

    return { shows, handlePlusOne, handleMinusOne, handleAddShow, handleDelete, handleEdit };
}