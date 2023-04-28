import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../styles/game-play.css';
import { AiOutlineCheck,AiOutlineClose } from 'react-icons/ai';
import { doc,getDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { AlertData } from '../context/AlertContext';

const MAX_GUESSES = 11;

const JoinSession = () => {
    const { setAlertData } = AlertData()
    const { uid } = useParams();
    const [currentWord,setCurrentWord] = useState(0);
    const [data,setData] = useState([]);
    const [isDataFetched,setIsDataFetched] = useState(false);
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
        if(currentWord < data.length){
            const word = data[currentWord];
            console.log('##########################')
            console.log(`the answer is: ${word.wordStr}`)
            console.log('I have logged the answer to the console for testing the game :)')
            console.log('##########################')
            //
            let wordSrt = word.wordStr;
            //
            let wordChars = word.word;
            //
            let visibility = word.visibility;
            //
            let wordSuggs = [];
            for(let i=0;i<wordChars.length;i++){
                const suggsArray = createSuggs(wordChars[i]);
                wordSuggs.push(suggsArray)
            }
            //
            let wordSuggsState = Array(wordChars.length).fill(Array(wordSuggs[0].length).fill(null));
            setWordData({wordSrt,wordChars,wordSuggs,wordSuggsState,visibility})
            setCurrentChar(0)
        }
        setCurrentWord(prev => prev + 1)
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
            setCurrentWord(0);
            setGameState('lost');
        }
    },[guessesLeft])

    useEffect(()=>{
        if(currentWord === data.length + 1 ){
            setGameState('won')
        }
    },[currentWord])

    const handleRestart = () => {
        setGameState('playing');
        setGuessesLeft(MAX_GUESSES);
        setNewWord();
        setCurrentScore(0);
    };


    useEffect(()=>{
        const ref = doc(db,'sessions',uid);
        getDoc(ref)
        .then((res)=>{
            setData(res.data().allwords);
            setIsDataFetched(true);
        })
        .catch((err)=>{
            setAlertData({type:'error',showen:true,msg:err.message});
        })
    },[])

    useEffect(()=>{
        if(isDataFetched){
            setNewWord()
        }
    },[isDataFetched])

    useEffect(()=>{
        if(gameState !== 'playing'){
            setCurrentWord(0);
        }
    },[gameState])
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
                        <div className={`hangman-piece platform ${guessesLeft < 11  ? 'show' : ''}`}></div>
                        <div className={`hangman-piece stand ${guessesLeft < 10  ? 'show' : ''}`}></div>
                        <div className={`hangman-piece top ${guessesLeft < 9  ? 'show' : ''}`}></div>
                        <div className={`hangman-piece rope-top ${guessesLeft < 8  ? 'show' : ''}`}></div>
                        <div className={`hangman-piece rope-head ${guessesLeft < 7  ? 'show' : ''}`}></div>
                        <div className={`hangman-piece head ${guessesLeft < 6  ? 'show' : ''}`}></div>
                        <div className={`hangman-piece body ${guessesLeft < 5 ? 'show' : ''}`}></div>
                        <div className={`hangman-piece left-arm ${guessesLeft < 4  ? 'show' : ''}`}></div>
                        <div className={`hangman-piece right-arm ${guessesLeft < 3  ? 'show' : ''}`}></div>
                        <div className={`hangman-piece left-leg ${guessesLeft < 2  ? 'show' : ''}`}></div>
                        <div className={`hangman-piece right-leg ${guessesLeft < 1  ? 'show' : ''}`}></div>
                    </div>
                </div>
            :
            <>
            {gameState === 'won'?
                <div className="game-over">
                    <div className="game-over-message">congrats you won</div>
                    <div className='game-over-score-container'>
                        <div className="game-over-score-text">your score is</div>
                        <div className="game-over-score">{`${currentScore}`}</div>
                    </div>
                    <button className="game-over-restart" onClick={handleRestart}>play again</button>
                    <Link to='/'>
                        <button className="game-over-go-back" >go back to home page</button>
                    </Link>
                </div>
            :
                <div className="game-over">
                    <div className="game-over-message">game over</div>
                    <div className='game-over-score-container'>
                        <div className="game-over-score-text">your score is</div>
                        <div className="game-over-score">{`${currentScore}`}</div>
                    </div>
                    <button className="game-over-restart" onClick={handleRestart}>play again</button>
                    <Link to='/'>
                        <button className="game-over-go-back" >go back to home page</button>
                    </Link>
                </div>
            }
            </>
            }  
        </>
    </div>
    )
}

export default JoinSession




// const Hangman = ({isGameStarted , setIsGameStarted}) => {




//     return (

//     );};

// export default Hangman;