import React, { useEffect, useState } from 'react';
import Home from './components/Home';
import GamePlay from './components/Gameplay';
import CreateSession from './components/CreateSession';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import JoinSession from './components/JoinSession';
import Account from './components/Account';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './config/firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';

function App() {
  const [isGameStarted,setIsGameStarted] = useState(false);
  const [isLoggedIn,setIsLoggedIn] = useState(false);
  const [leaderboard,setLeaderboard] = useState([{username:'fff',score:0}]);

  useEffect(()=>{
    onAuthStateChanged(auth,(res)=>{
      if(res){
        setIsLoggedIn(true)
      }else {
        setIsLoggedIn(false)
      }
    })

    const ref = doc(db,'leaderboard','leaderboard');
    onSnapshot(ref,(res)=>{
      setLeaderboard(res.data().topTen)
    })
  },[])
  return (
    <>
    {!isLoggedIn ?
      <Account />
    :
      <main className="App">
          <Router>
            <Routes>
                <Route 
                path='/' 
                element={<>
                  <Home isGameStarted={isGameStarted}   setIsGameStarted={setIsGameStarted} leaderboard={leaderboard} />
                  <GamePlay isGameStarted={isGameStarted}   setIsGameStarted={setIsGameStarted} leaderboard={leaderboard} />
                </>}/>
                <Route 
                    path='/createsession' 
                    element={<CreateSession />}
                />
                <Route 
                    path='/join/:uid' 
                    element={<JoinSession />}
                />
            </Routes>
          </Router>
      </main>
    }
    </>
  );
}

export default App;
