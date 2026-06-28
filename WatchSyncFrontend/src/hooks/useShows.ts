import { useState, useEffect } from 'react';
import { getShows, updateShow, createShow, deleteShow } from '../api/client';
import type { Show, CreateShowDto } from '../types';

export function useShows() {
    const [shows, setShows] = useState<Show[]>([]);

    useEffect(() => {
        getShows().then(data => setShows(data.sort((a, b) => a.showId - b.showId)));
    }, []);

    function handlePlusOne(updatedShow: Show) {
        setShows(shows.map(s => s.showId === updatedShow.showId ? updatedShow : s));
        updateShow(updatedShow);
    }

    function handleMinusOne(updatedShow: Show) {
        setShows(shows.map(s => s.showId === updatedShow.showId ? updatedShow : s));
        updateShow(updatedShow);
    }

    async function handleAddShow(newShow: CreateShowDto) {
        const createdShow = await createShow(newShow);
        setShows([...shows, createdShow]);
    }

    async function handleDelete(showId: number) {
        await deleteShow(showId);
        setShows(shows.filter(s => s.showId !== showId));
    }

    async function handleEdit(updatedShow: Show) {
        await updateShow(updatedShow);
        setShows(shows.map(s => s.showId === updatedShow.showId ? updatedShow : s));
    }

    return { shows, handlePlusOne, handleMinusOne, handleAddShow, handleDelete, handleEdit };
}