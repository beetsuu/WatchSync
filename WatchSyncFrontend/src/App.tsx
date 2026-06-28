import './App.css'
import ShowList from './components/ShowList';
import './api/client';
import { useEffect, useState } from 'react';
import type { Show, User, WatchParty } from './types';
import { getShows, getUsers, getWatchParties, updateWatchParty } from './api/client';
import WatchPartyBar from './components/WatchPartyBar';


function App() {

  const [shows, setShows] = useState<Show[]>([]);
  const [watchParty, setWatchParty] = useState<WatchParty | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    getShows().then(data => setShows(data.sort((a, b) => a.showId - b.showId)));
    getUsers().then(data => setCurrentUser(data[0]));
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


  return (
    <div>
      {watchParty && currentUser && (
        <WatchPartyBar watchParty={watchParty} currentUser={currentUser} />
      )}
      <h1>WatchSync</h1>
      {watchParty && (
        <ShowList shows={shows} onPlusOne={handlePlusOne} />)}

    </div>
  )
}

export default App;
