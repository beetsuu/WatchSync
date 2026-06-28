import './App.css'
import ShowList from './components/ShowList';
import './api/client';
import { useEffect, useState } from 'react';
import type { CreateShowDto, Show, User, WatchParty } from './types';
import { addShow, getShows, getUsers, getWatchParties, updateWatchParty } from './api/client';
import WatchPartyBar from './components/WatchPartyBar';
import AddShowModal from './components/AddShowModal';


function App() {

  const [shows, setShows] = useState<Show[]>([]);
  const [watchParty, setWatchParty] = useState<WatchParty | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getShows().then(data => setShows(data.sort((a, b) => a.showId - b.showId)));
    getUsers().then(data => {
      setCurrentUser(data[0]);
      setUsers(data.sort((a, b) => a.userId - b.userId));
    });
    getWatchParties().then(data => setWatchParty(data[0]));

  }, []);

  function handlePlusOne(updatedShow: Show) {
    setShows(shows.map(s => s.showId === updatedShow.showId ? updatedShow : s));

    if (watchParty) {
      const updatedWatchParty = { ...watchParty, currentTurnCount: watchParty.currentTurnCount + 1 };
      updateWatchParty(updatedWatchParty);
      setWatchParty(updatedWatchParty);
    }
  }

  async function handleAddShow(newShow: CreateShowDto) {
    const createdShow = await addShow(newShow);
    setShows([...shows, createdShow]);
    setShowModal(false);
  }


  return (
    <div>
      <h1>WatchSync</h1>
      {watchParty && currentUser && (
        <WatchPartyBar watchParty={watchParty} currentUser={currentUser} />
      )}
      <button onClick={() => setShowModal(true)}>+ Show hinzufügen</button>
      {showModal && watchParty && currentUser && (
        <AddShowModal
          watchParty={watchParty}
          currentUser={currentUser}
          onClose={() => setShowModal(false)}
          onAdd={handleAddShow}
        />
      )}
      {watchParty && (
        <ShowList shows={shows} onPlusOne={handlePlusOne} users={users} />)}

    </div>
  )
}

export default App;
