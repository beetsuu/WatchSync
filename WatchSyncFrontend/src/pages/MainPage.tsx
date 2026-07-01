import { useShows } from '../hooks/useShows';
import { useWatchParty } from '../hooks/useWatchParties';
import { useState } from 'react';
import { theme } from '../theme';
import WatchPartyBar from '../components/WatchPartyBar';
import AddShowModal from '../components/AddShowModal';
import ShowList from '../components/ShowList';
import CreateWatchPartyModal from '../components/CreateWatchPartyModal';
import type { Show } from '../types';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';

export default function MainApp() {
    const { shows, handlePlusOne, handleMinusOne, handleAddShow, handleDelete, handleEdit } = useShows();
    const { watchParty, handleNextUser, handlePrevUser, handleCreateWatchParty, handleTurnCountUp, handleTurnCountDown } = useWatchParty();
    const { user: loggedInUser, logout } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [showWpModal, setShowWpModal] = useState(false);
    const [showTurnWarning, setShowTurnWarning] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    function onPlusOne(updatedShow: Show) {
        handlePlusOne(updatedShow);
        handleTurnCountUp();
        if (watchParty && watchParty.currentTurnCount + 1 == watchParty.turnLimit) {
            setShowTurnWarning(true);
        }
    }

    function onMinusOne(updatedShow: Show) {
        handleMinusOne(updatedShow);
        handleTurnCountDown();
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: theme.background, color: theme.text }}>
            <div
                className="flex items-center px-6 py-4 sticky top-0 z-40"
                style={{ borderBottom: `2px solid ${theme.accent}`, backgroundColor: theme.background }}
            >
                <div className="flex-1">
                    <h1 className="text-sm font-bold">WatchSync</h1>
                </div>

                <div className="flex-1 flex justify-center">
                    {watchParty && loggedInUser && (
                        <WatchPartyBar watchParty={watchParty} currentUser={loggedInUser} onPrevUser={handlePrevUser} onNextUser={handleNextUser} />
                    )}
                </div>

                <div className="flex-1 flex justify-end gap-2">
                    <div className="hidden md:flex gap-2">
                        <button onClick={() => setShowWpModal(true)} style={theme.buttonStyle}>+ WP</button>
                        <button onClick={() => setShowModal(true)} style={theme.buttonStyle}>+ Add</button>
                        <button onClick={logout} style={theme.buttonStyle}>Logout</button>
                    </div>
                    <div className="md:hidden relative">
                        <button onClick={() => setMenuOpen(!menuOpen)} style={theme.buttonStyle}>☰</button>
                        {menuOpen && (
                            <div
                                className="absolute right-0 top-12 flex flex-col gap-2 p-4 z-50"
                                style={{ backgroundColor: theme.card, borderRadius: theme.radius, border: `1px solid ${theme.border}` }}
                            >
                                <button onClick={() => { setShowWpModal(true); setMenuOpen(false); }} style={theme.buttonStyle}>+ WP</button>
                                <button onClick={() => { setShowModal(true); setMenuOpen(false); }} style={theme.buttonStyle}>+ Show</button>
                                <button onClick={() => { logout(); setMenuOpen(false); }} style={theme.buttonStyle}>Logout</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showTurnWarning && watchParty && loggedInUser && (
                <Modal onClose={() => setShowTurnWarning(false)}>
                    <div className="flex flex-col gap-4 p-6" style={{ backgroundColor: theme.card, borderRadius: theme.radius, border: `1px solid ${theme.border}` }}>
                        <h2>That's it for {loggedInUser.displayName}!</h2>
                        <p>Do you want to switch to the next person?</p>
                        <div className="flex gap-2">
                            <button style={theme.buttonStyle} onClick={() => { handleNextUser(); setShowTurnWarning(false); }}>Switch</button>
                            <button style={theme.buttonStyle} onClick={() => setShowTurnWarning(false)}>Keep going</button>
                        </div>
                    </div>
                </Modal>
            )}

            {showWpModal && (
                <Modal onClose={() => setShowWpModal(false)}>
                    <CreateWatchPartyModal onClose={() => setShowWpModal(false)} onAdd={handleCreateWatchParty} />
                </Modal>
            )}

            {showModal && loggedInUser && watchParty && (
                <Modal onClose={() => setShowModal(false)}>
                    <AddShowModal watchParty={watchParty} onClose={() => setShowModal(false)} onAdd={handleAddShow} />
                </Modal>
            )}

            {watchParty && (
                <ShowList shows={shows} onPlusOne={onPlusOne} onMinusOne={onMinusOne} onDelete={handleDelete} onEdit={handleEdit} />
            )}
        </div>
    );
}