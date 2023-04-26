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
					<div className="create-session1">
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
						<div className="user">
								<div className="placement-background">
									<p className="placement-text">#1</p>
								</div>
								<p className="username-text">Username</p>
								<pre className="score-text">123</pre>
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