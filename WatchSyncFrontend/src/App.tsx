import './App.css'
import ShowList from './components/ShowList';
import './api/client';
import { useEffect, useState } from 'react';
import type { Show } from './types';
import { getShows } from './api/client';


function App() {

  // 1. useState – wo speicherst du die Shows?
  const [shows, setShows] = useState<Show[]>([]);

  // 2. useEffect – wann holst du sie?
  useEffect(() => {
    getShows().then(data => setShows(data));
  }, []);


  return (
    <div>
      <h1>WatchSync</h1>
      <ShowList shows={shows} />

    </div>
  )
}

export default App;
