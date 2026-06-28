import { useShows } from './hooks/useShows';
import { useWatchParty } from './hooks/useWatchParties';
import { useUsers } from './hooks/useUsers';
import { useState } from 'react';
import { theme } from './theme';
import WatchPartyBar from './components/WatchPartyBar';
import AddShowModal from './components/AddShowModal';
import ShowList from './components/ShowList';

function App() {

  const { shows, handlePlusOne, handleMinusOne, handleAddShow } = useShows();
  const { watchParty, members, handleNextUser, handlePrevUser, handleCreateWatchParty, handleTurnCountUp, handleTurnCountDown } = useWatchParty();
  const { users, currentUser } = useUsers();
  const [showModal, setShowModal] = useState(false);
  const [showWpModal, setShowWpModal] = useState(false);

  function onPlusOne(updatedShow: Show) {
    handlePlusOne(updatedShow);
    handleTurnCountUp();
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

        <button
          onClick={() => setShowModal(true)}
          style={theme.buttonStyle}
        >
          + Add
        </button>
      </div>
      {showModal && currentUser && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
          onClick={() => setShowModal(false)}
        >
          <div onClick={e => e.stopPropagation()}>
            <AddShowModal
              currentUser={currentUser}
              onClose={() => setShowModal(false)}
              onAdd={handleAddShow}
            />
          </div>
        </div>
      )}
      {watchParty && (
        <ShowList shows={shows} onPlusOne={onPlusOne} onMinusOne={onMinusOne} users={users} />)}

    </div>
  )
}

export default App;
