import React, { useState, useEffect } from 'react';
import '../styles/game-play.css';
import { AiOutlineCheck,AiOutlineClose } from 'react-icons/ai';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';

const MAX_GUESSES = 11;

const Hangman = ({isGameStarted , setIsGameStarted,leaderboard}) => {
    const [guessesLeft, setGuessesLeft] = useState(MAX_GUESSES);
    const [currentChar,setCurrentChar] = useState(0);
    const [gameState, setGameState] = useState('playing');
    const [currentScore, setCurrentScore] = useState(0);
    const [wordData,setWordData] = useState(
        {
            wordSrt:'',
            wordChars:[],
            visibility:[],
            wordSuggs:[
                [],
            ],
            wordSuggsState:[
                [],
            ]
        }
    )


    function setNewWord(){
        fetch('https://random-word-api.herokuapp.com/word')
        .then(res=>res.json())
        .then(data => {
            if(data[0].length > 12){
                setNewWord()
            }else {
                const word = data[0];
                console.log('##########################')
                console.log(`the answer is: ${word}`)
                console.log('I have logged the answer to the console for testing the game :)')
                console.log('##########################')
                //
                let wordSrt = word;
                //
                let wordChars = [];
                for(let i=0;i<word.length;i++) wordChars.push(word[i])
                let randomIndex1 = Math.floor(Math.random() * word.length)
                let randomIndex2 = Math.floor(Math.random() * word.length)
                //
                let visibility = Array(wordChars.length).fill(false);
                visibility[randomIndex1] = true;
                visibility[randomIndex2] = true;
                //
                let wordSuggs = [];
                for(let i=0;i<word.length;i++){
                    const suggsArray = createSuggs(word[i]);
                    wordSuggs.push(suggsArray)
                }
                //
                let wordSuggsState = Array(wordChars.length).fill(Array(wordSuggs[0].length).fill(null));
                setWordData({wordSrt,wordChars,wordSuggs,wordSuggsState,visibility})
                setCurrentChar(0)
            }
        })
    }

    function createSuggs(mustInclude){
        let allLetters = 'abcdefghijklmnopqrstuvwxyz';
        let suggsArray = [];
        let randomIndex = Math.floor(Math.random() * 6);
        let counter = 0;

        while(counter < 6){
            if(counter === randomIndex){
                suggsArray.push(mustInclude);
                counter++;
            } else {
                let isExist = false;
                let random = Math.floor(Math.random() * allLetters.length);
                for(let i = 0; i < suggsArray.length && !isExist ; i++){
                    if(suggsArray[i] === allLetters[random]){
                        isExist = true;
                    }
                }
                if(!isExist){
                    suggsArray.push(allLetters[random])
                    counter++;
                }
            }
        }
        return suggsArray;
    }

    const handleGuess = (letter,index) => {
        if (gameState !== 'playing') {
            return;
        }
        
        setWordData(prev => {
            let newArr = [...prev.wordSuggsState[currentChar]];
            newArr[index] = wordData.wordChars[currentChar] === letter

            let wordSuggsState = [...prev.wordSuggsState]
            wordSuggsState[currentChar] = newArr
            return {...prev,wordSuggsState}
        })
        if(wordData.wordChars[currentChar] === letter){
            setCurrentScore(prev => prev + 1);
            setWordData(prev => {
                let newArr = [...prev.visibility];
                newArr[currentChar] = true;
                let bool = true;
                for(let i = 0;i<newArr.length ; i++ ) {
                    if(newArr[i] === false) bool = false;
                }
                if(bool){
                    setNewWord();
                }
                return {...prev,visibility:newArr}
            })
        }else {
            setGuessesLeft(prev => prev - 1);
        }
    };
    useEffect(()=>{
        if (guessesLeft === 0) {
            setGameState('lost');
            if(leaderboard.length < 10){
                let newArr = [...leaderboard];
                newArr.push({username:auth.currentUser.displayName,score:currentScore});
                newArr = newArr.sort((a, b) => a.score < b.score? 1 : -1);
                const Ref = doc(db,'leaderboard','leaderboard')
                setDoc(Ref,{topTen:newArr})
            }else {
                if(leaderboard[10].score < currentScore){
                    let newArr = [...leaderboard];
                    leaderboard[10] = {username:auth.currentUser.displayName,score:currentScore};
                    newArr = newArr.sort((a, b) => a.score < b.score? 1 : -1);
                    const Ref = doc(db,'leaderboard','leaderboard')
                    setDoc(Ref,{topTen:newArr})
                }
            }
        }
    },[guessesLeft])

    const handleRestart = () => {
        setGameState('playing');
        setGuessesLeft(MAX_GUESSES);
        setNewWord();
        setCurrentScore(0);
        setIsGameStarted(false)
    };

    useEffect(()=>{
        setNewWord()
    },[])
    return (
    <div className="hangman-game">
        <>
            {gameState === 'playing'?
                <div className="game-play">
                <div className="display-word">{wordData.wordChars.map((char, index) => (
                    <div key={index} onClick={()=>setCurrentChar(index)}>
                        <span 
                            className={`display-char  ${!wordData.visibility[index]?'hidden' :''} ${currentChar === index ? 'choosen':''}`}
                            >
                            {char} </span>
                    </div>
                    ))}
                    
                </div>
                <div className="guess-info">
                    <p className="guesses-left">Guesses Left:</p>
                    <p className="guesses-count">{`${guessesLeft}`}</p>
                </div>
                <div className="score-container">
                    <p className="current-score">score:</p>
                    <p className="score">{`${currentScore}`}</p>
                </div>
                    <div className="alphabet">
                    {wordData.wordSuggs[currentChar].map((letter,i) => (
                    <button 
                        key={i} 
                        onClick={() => handleGuess(letter,i)}
                        className={`alphabet-btn ${wordData.wordSuggsState[currentChar][i] === true ? 'true':'' } ${wordData.wordSuggsState[currentChar][i] === false ? 'false':''}`}
                        disabled={wordData.visibility[currentChar]}
                        >
                            <span className='wrong'>{AiOutlineClose({})}</span>
                            <span className='right'>{AiOutlineCheck({})}</span>
                        {letter}
                    </button>
                    ))}
                    </div>
                    <div className="hangman">
                        <div className={`hangman-piece platform ${guessesLeft < 11 || !isGameStarted ? 'show' : ''}`}></div>
                        <div className={`hangman-piece stand ${guessesLeft < 10 || !isGameStarted ? 'show' : ''}`}></div>
                        <div className={`hangman-piece top ${guessesLeft < 9 || !isGameStarted ? 'show' : ''}`}></div>
                        <div className={`hangman-piece rope-top ${guessesLeft < 8 || !isGameStarted ? 'show' : ''}`}></div>
                        <div className={`hangman-piece rope-head ${guessesLeft < 7 || !isGameStarted ? 'show' : ''}`}></div>
                        <div className={`hangman-piece head ${guessesLeft < 6 || !isGameStarted ? 'show' : ''}`}></div>
                        <div className={`hangman-piece body ${guessesLeft < 5 || !isGameStarted ? 'show' : ''}`}></div>
                        <div className={`hangman-piece left-arm ${guessesLeft < 4 || !isGameStarted ? 'show' : ''}`}></div>
                        <div className={`hangman-piece right-arm ${guessesLeft < 3 || !isGameStarted ? 'show' : ''}`}></div>
                        <div className={`hangman-piece left-leg ${guessesLeft < 2 || !isGameStarted ? 'show' : ''}`}></div>
                        <div className={`hangman-piece right-leg ${guessesLeft < 1 || !isGameStarted ? 'show' : ''}`}></div>
                    </div>
                </div>
            :
            <div className="game-over">
                <div className="game-over-message">game over</div>
                <div className='game-over-score-container'>
                    <div className="game-over-score-text">your score is</div>
                    <div className="game-over-score">{`${currentScore}`}</div>
                </div>
                <button className="game-over-restart" onClick={handleRestart}>continue</button>
            </div>
            }  
        </>
    </div>
    );};

export default Hangman;