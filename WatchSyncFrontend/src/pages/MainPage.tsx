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
import WatchPartyDropdown from '../components/WatchPartyDropdown';
import { HiOutlineMenu } from 'react-icons/hi';

export default function MainApp() {
    const { watchParties, selectedWatchParty, setSelectedWatchParty, handleNextUser, handlePrevUser, handleCreateWatchParty, handleTurnCountUp, handleTurnCountDown } = useWatchParty();
    const { user: loggedInUser, logout } = useAuth();
    const { shows, handlePlusOne, handleMinusOne, handleAddShow, handleDelete, handleEdit } = useShows(selectedWatchParty?.watchPartyId ?? null);
    const [showModal, setShowModal] = useState(false);
    const [showWpModal, setShowWpModal] = useState(false);
    const [showTurnWarning, setShowTurnWarning] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    function onPlusOne(updatedShow: Show) {
        handlePlusOne(updatedShow);
        handleTurnCountUp();
        if (selectedWatchParty && selectedWatchParty.currentTurnCount + 1 == selectedWatchParty.turnLimit) {
            setShowTurnWarning(true);
        }
    }

    function onMinusOne(updatedShow: Show) {
        handleMinusOne(updatedShow);
        handleTurnCountDown();
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: theme.background, color: theme.text }}>
            <div className="sticky top-0 z-40" style={{ borderBottom: `2px solid ${theme.accent}`, backgroundColor: theme.background }}>
                <div className="flex flex-wrap items-center px-6 py-3">
                    {/* Links: Logo + Dropdown */}
                    <div className="flex-1 flex items-center gap-2">
                        <h1 className="text-sm font-bold hidden sm:block">WatchSync</h1>
                        {selectedWatchParty && (
                            <WatchPartyDropdown
                                watchParties={watchParties}
                                selected={selectedWatchParty}
                                onSelect={setSelectedWatchParty}
                            />
                        )}
                    </div>

                    {/* Mitte: Turn-Counter — auf Desktop inline zentriert, auf Mobile eigene Zeile */}
                    {selectedWatchParty && loggedInUser && (
                        <div className="order-3 w-full sm:order-2 sm:flex-1 sm:w-auto flex justify-center py-2 sm:py-0">
                            <WatchPartyBar watchParty={selectedWatchParty} currentUser={loggedInUser} onPrevUser={handlePrevUser} onNextUser={handleNextUser} />
                        </div>
                    )}

                    {/* Rechts: Menü */}
                    <div className="flex-1 flex justify-end order-2 sm:order-3">
                        <div className="relative">
                            <button onClick={() => setMenuOpen(!menuOpen)}
                                className="h-10 px-4 flex items-center gap-2 font-medium"
                                style={{ backgroundColor: theme.card, borderRadius: theme.radius, border: `1px solid ${theme.border}`, fontSize: '16px', }}>
                                <span>Menu</span>
                                <HiOutlineMenu size={18} />
                            </button>

                            {menuOpen && (
                                <div
                                    className="absolute right-0 top-12 w-full overflow-hidden z-50"
                                    style={{ backgroundColor: theme.card, borderRadius: theme.radius, border: `1px solid ${theme.border}` }}
                                >
                                    <button onClick={() => { setShowWpModal(true); setMenuOpen(false); }}
                                        className="w-full px-4 py-3 text-left hover:opacity-80"
                                        style={{ color: theme.text }}>
                                        + Watch Party
                                    </button>
                                    <button onClick={() => { setShowModal(true); setMenuOpen(false); }}
                                        className="w-full px-4 py-3 text-left hover:opacity-80"
                                        style={{ color: theme.text, borderTop: `1px solid ${theme.border}` }}>
                                        + Show
                                    </button>
                                    <button onClick={() => { logout(); setMenuOpen(false); }}
                                        className="w-full px-4 py-3 text-left hover:opacity-80"
                                        style={{ color: theme.text, borderTop: `1px solid ${theme.border}` }}>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {
                !selectedWatchParty && watchParties.length > 0 && (
                    <div className="flex flex-col items-center gap-4 p-8">
                        <h2 className="text-xl font-bold">Select a Watch Party</h2>
                        {watchParties.map(wp => (
                            <button
                                key={wp.watchPartyId}
                                onClick={() => setSelectedWatchParty(wp)}
                                className="w-64 p-4 text-left"
                                style={{ backgroundColor: theme.card, borderRadius: theme.radius, border: `1px solid ${theme.border}` }}
                            >
                                {wp.name}
                            </button>
                        ))}
                    </div>
                )
            }

            {
                !selectedWatchParty && watchParties.length === 0 && (
                    <div className="flex flex-col items-center gap-4 p-8">
                        <p>No watch parties yet — create one!</p>
                    </div>
                )
            }

            {
                showTurnWarning && selectedWatchParty && loggedInUser && (
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
                )
            }

            {
                showWpModal && (
                    <Modal onClose={() => setShowWpModal(false)}>
                        <CreateWatchPartyModal onClose={() => setShowWpModal(false)} onAdd={handleCreateWatchParty} />
                    </Modal>
                )
            }

            {
                showModal && loggedInUser && selectedWatchParty && (
                    <Modal onClose={() => setShowModal(false)}>
                        <AddShowModal watchParty={selectedWatchParty} onClose={() => setShowModal(false)} onAdd={handleAddShow} />
                    </Modal>
                )
            }

            {
                selectedWatchParty && (
                    <ShowList shows={shows} onPlusOne={onPlusOne} onMinusOne={onMinusOne} onDelete={handleDelete} onEdit={handleEdit} />
                )
            }
        </div >
    );
}