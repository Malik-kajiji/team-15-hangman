import React, { useState } from 'react';
import '../styles/home.css';
import {FiLogOut} from 'react-icons/fi';
import { Link,useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firebaseConfig';
import { doc , getDoc } from 'firebase/firestore';
import { AlertData } from '../context/AlertContext';
import { signOut } from 'firebase/auth';

const Home = ({isGameStarted , setIsGameStarted,leaderboard}) => {
	const { setAlertData } = AlertData()
	const [inputData,setInputData] = useState('');
	const navigate = useNavigate()
	const handleLogOut = () => {
		signOut(auth)
	}

	const handleClick =  () => {
		if(inputData === ''){
			setAlertData({type:'warrning',showen:true,msg:'make sure to fill up the input'})
		} else {
			const ref = doc(db,'sessions',inputData);
			getDoc(ref)
			.then((res)=>{
				if(res.exists()){
					navigate(`/join/${inputData}`);
				}else {
					setAlertData({type:'warrning',showen:true,msg:'the code you have entered does not exists'})
				}
			})
			.catch((err)=>{
				setAlertData({type:'error',showen:true,msg:err.message})
			})
		}
	};
	return (
			<>
				<div className={`blurred-screen ${isGameStarted? 'hide':''}`}>
					<div className="new-game" onClick={()=>setIsGameStarted(true)}>
						<p className="new-game-text">Start a New Game</p>
					</div>
					<p className="play-friends-text">or Play with Friends</p>
					<div className="create-session1">
						<Link to='/createsession'>
							<p className="create-session-text">Create a Session</p>
						</Link>
					</div>
					<input value={inputData} onChange={(e)=>setInputData(e.target.value)} className="session-input" type="text" placeholder="Session Code"/>
					<div className="session-join" onClick={handleClick}>
							<p className="session-join-text">Join</p>
					</div>
				</div>
				<div className={`leaderboard ${isGameStarted? 'hide':''}`}>
						<div className="leaderboard-header">
								<p className="leaderboard-text">Leaderboard</p>
						</div>
						{leaderboard.map((user,index) => (
							<div className="user" key={index}>
							<div className="placement-background">
								<p className="placement-text">#{index + 1}</p>
							</div>
							<p className="username-text">{user.username}</p>
							<pre className="score-text">{user.score}</pre>
							</div>
						))
						
						}
						{/* <div className="user">
								<div className="placement-background">
									<p className="placement-text">#1</p>
								</div>
								<p className="username-text">Username</p>
								<pre className="score-text">123</pre>
						</div> */}
						<div className="logged-in-user" onClick={handleLogOut}>
								<p className="user-text">{auth.currentUser.displayName}</p>
								<p className="user-email">{auth.currentUser.email}</p>
								<p className="logout-icon"><FiLogOut/></p>
						</div>
				</div>
			</>
		);
	}

export default Home;