import './App.css'
import ShowList from './components/ShowList';
import './api/client';
import { useEffect, useState } from 'react';
import type { Show, User, WatchParty } from './types';
import { getShows, getUsers, getWatchParties } from './api/client';
import WatchPartyBar from './components/WatchPartyBar';


function App() {

  // 1. useState – wo speicherst du die Shows?
  const [shows, setShows] = useState<Show[]>([]);
  const [watchParty, setWatchParty] = useState<WatchParty | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // 2. useEffect – wann holst du sie?
  useEffect(() => {
    getShows().then(data => setShows(data));
    getUsers().then(data => setCurrentUser(data[0]));
    getWatchParties().then(data => setWatchParty(data[0]));
  }, []);


  return (
    <div>
      {watchParty && currentUser && (
        <WatchPartyBar watchParty={watchParty} currentUser={currentUser} />
      )}
      <h1>WatchSync</h1>
      <ShowList shows={shows} />

    </div>
  )
}

export default App;
