import { useShows } from './hooks/useShows';
import { useWatchParty } from './hooks/useWatchParties';
import { useUsers } from './hooks/useUsers';
import { useState } from 'react';
import { theme } from './theme';
import WatchPartyBar from './components/WatchPartyBar';
import AddShowModal from './components/AddShowModal';
import ShowList from './components/ShowList';
import CreateWatchPartyModal from './components/CreateWatchPartyModal';
import type { Show } from './types';
import Modal from './components/Modal';

function App() {

  const { shows, handlePlusOne, handleMinusOne, handleAddShow, handleDelete, handleEdit } = useShows();
  const { watchParty, members, handleNextUser, handlePrevUser, handleCreateWatchParty, handleTurnCountUp, handleTurnCountDown } = useWatchParty();
  const { users } = useUsers();
  const [showModal, setShowModal] = useState(false);
  const [showWpModal, setShowWpModal] = useState(false);
  const [showTurnWarning, setShowTurnWarning] = useState(false);
  const currentMember = members.find(m => m.turnOrder === watchParty?.currentTurnOrder);
  const currentUser = users.find(u => u.userId === currentMember?.userId) ?? null;


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
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: `2px solid ${theme.accent}` }}
      >
        <h1 className="text-xl font-bold">WatchSync</h1>

        {watchParty && currentUser && (
          <WatchPartyBar watchParty={watchParty} currentUser={currentUser} onPrevUser={handlePrevUser} onNextUser={handleNextUser} />
        )}

        <div className="flex gap-2">
          <button onClick={() => setShowWpModal(true)} style={theme.buttonStyle}>+ WP </button>
          <button onClick={() => setShowModal(true)} style={theme.buttonStyle}> + Add </button>
        </div>
      </div>



      {showTurnWarning && watchParty && currentUser && (
        <Modal onClose={() => setShowTurnWarning(false)}>
          <div className="flex flex-col gap-4 p-6" style={{ backgroundColor: theme.card, borderRadius: theme.radius, border: `1px solid ${theme.border}` }}>
            <h2>That's it for {currentUser.name}!</h2>
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
          <CreateWatchPartyModal users={users} onClose={() => setShowWpModal(false)} onAdd={handleCreateWatchParty} />
        </Modal>
      )}

      {showModal && currentUser && watchParty && (
        <Modal onClose={() => setShowModal(false)}>
          <AddShowModal currentUser={currentUser} watchParty={watchParty} onClose={() => setShowModal(false)} onAdd={handleAddShow} />
        </Modal>
      )}

      {
        watchParty && (
          <ShowList shows={shows} onPlusOne={onPlusOne} onMinusOne={onMinusOne} users={users} onDelete={handleDelete} onEdit={handleEdit} />)
      }

    </div >
  )
}

export default App;
