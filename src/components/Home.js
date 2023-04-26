import React from 'react';
import '../styles/home.css';
import {FiLogOut} from 'react-icons/fi';

const Home = () => {
  return (
    <>
			<div className="blurred-screen">
					<div className="new-game">
							<p className="new-game-text">Start a New Game</p>
					</div>
					<p className="play-friends-text">or Play with Friends</p>
					<div className="create-session">
							<p className="create-session-text">Create a Session</p>
					</div>
					<input className="session-input" type="text" placeholder="Session Code"/>
					<div className="session-join">
							<p className="session-join-text">Join</p>
					</div>
			</div>
			<div className="leaderboard">
					<div className="leaderboard-header">
							<p className="leaderboard-text">Leaderboard</p>
					</div>
					<div className="user-1">
							<div className="placement-background">
									<p className="placement-text">#1</p>
							</div>
							<p className="username-text">Username</p>
							<pre className="score-text">123</pre>
					</div>
					<div className="user-2">
							<div className="placement-background">
									<p className="placement-text">#2</p>
							</div>
							<p className="username-text">Username</p>
							<pre className="score-text">  23</pre>
					</div>
					<div className="user-3">
							<div className="placement-background">
									<p className="placement-text">#3</p>
							</div>
							<p className="username-text">Username</p>
							<pre className="score-text">     3</pre>
					</div>
					<div className="user-4">
							<div className="placement-background">
									<p className="placement-text">#4</p>
							</div>
							<p className="username-text">Username</p>
							<pre className="score-text">     2</pre>
					</div>
					<div className="user-5">
							<div className="placement-background">
									<p className="placement-text">#5</p>
							</div>
							<p className="username-text">Username</p>
							<pre className="score-text">     1</pre>
					</div>
					<div className="user-6">
							<div className="placement-background">
									<p className="placement-text">#6</p>
							</div>
							<p className="username-text">Username</p>
							<pre className="score-text">     0</pre>
					</div>
					<div className="user-7">
							<div className="placement-background">
									<p className="placement-text">#7</p>
							</div>
							<p className="username-text">Username</p>
							<pre className="score-text">     0</pre>
					</div>
					<div className="user-8">
							<div className="placement-background">
									<p className="placement-text">#8</p>
							</div>
							<p className="username-text">Username</p>
							<pre className="score-text">     0</pre>
					</div>
					<div className="user-9">
							<div className="placement-background">
									<p className="placement-text">#9</p>
							</div>
							<p className="username-text">Username</p>
							<pre className="score-text">     0</pre>
					</div>
					<div className="user-10">
							<div className="placement-background">
									<p className="placement-text">#10</p>
							</div>
							<p className="username-text">Username</p>
							<pre className="score-text">     0</pre>
					</div>
					<div className="logged-in-user">
							<p className="user-text">Username</p>
							<p className="user-email">name@example.com</p>
							<p className="logout-icon"><FiLogOut/></p>
					</div>
			</div>
    </>
  );
}

export default Home;