import React, { useState, useEffect } from 'react';
import '../styles/game-play.css';

const wordList = ['react', 'javascript', 'html', 'css', 'nodejs', 'mongodb'];
const MAX_GUESSES = 11;

const Hangman = () => {
    const [word, setWord] = useState('');
    const [displayWord, setDisplayWord] = useState('');
    const [guessedLetters, setGuessedLetters] = useState([]);
    const [guessesLeft, setGuessesLeft] = useState(MAX_GUESSES);
    const [gameState, setGameState] = useState('playing');
    const [currentScore, setCurrentScore] = useState(0);
    const [highestScore, setHighestScore] = useState(0);

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * wordList.length);
        const randomWord = wordList[randomIndex].toUpperCase();
        setWord(randomWord);
        setDisplayWord(' '.repeat(randomWord.length));
    }, []);

    const handleGuess = (letter) => {
        if (gameState !== 'playing') {
            return;
        }
        if (word.includes(letter)) {
            const updatedDisplayWord = displayWord.split('').map((char, index) => {
                if (word[index] === letter) {
                    return letter;
                }
                return char;
            }).join('');
            setDisplayWord(updatedDisplayWord);
            if (!updatedDisplayWord.includes(' ')) {
                setGameState('won');
                setCurrentScore(currentScore + 1);
                if (currentScore + 1 > highestScore) {
                    setHighestScore(currentScore + 1);
                }
            }
        } else {
            setGuessesLeft(guessesLeft - 1);
            setGuessedLetters([...guessedLetters, letter]);
            if (guessesLeft === 1) {
                setGameState('lost');
                setCurrentScore(0);
            }
        }
    };
    const handleRestart = () => {
        setGameState('playing');
        setGuessesLeft(MAX_GUESSES);
        setGuessedLetters([]);
        const randomIndex = Math.floor(Math.random() * wordList.length);
        const randomWord = wordList[randomIndex].toUpperCase();setWord(randomWord);
        setDisplayWord(' '.repeat(randomWord.length));
        setCurrentScore(0);
    };

    const renderHangman = () => {
        let numWrongGuesses = MAX_GUESSES - guessesLeft;
        
        return (
        <div className="hangman">
            <div className={`hangman-piece platform ${numWrongGuesses >= 1 ? 'show' : ''}`}></div>
            <div className={`hangman-piece stand ${numWrongGuesses >= 2 ? 'show' : ''}`}></div>
            <div className={`hangman-piece top ${numWrongGuesses >= 3 ? 'show' : ''}`}></div>
            <div className={`hangman-piece rope-top ${numWrongGuesses >= 4 ? 'show' : ''}`}></div>
            <div className={`hangman-piece rope-head ${numWrongGuesses >= 5 ? 'show' : ''}`}></div>
            <div className={`hangman-piece head ${numWrongGuesses >= 6 ? 'show' : ''}`}></div>
            <div className={`hangman-piece body ${numWrongGuesses >= 7 ? 'show' : ''}`}></div>
            <div className={`hangman-piece left-arm ${numWrongGuesses >= 8 ? 'show' : ''}`}></div>
            <div className={`hangman-piece left-leg ${numWrongGuesses >= 10 ? 'show' : ''}`}></div>
            <div className={`hangman-piece right-leg ${numWrongGuesses >= 11 ? 'show' : ''}`}></div>
            </div>
            );
        };
        
        const renderGame = () => {
            if (gameState === 'playing') {
                return (
                <div className="game-play">
                    <div className="display-word">{displayWord.split('').map((char, index) => (
                        <span key={index} className="display-char">{char}</span>
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
                            {Array.from({ length: 26 }, (_, i) => String.fromCharCode('A'.charCodeAt() + i)).map((letter) => (
                            <button 
                                key={letter} 
                                onClick={() => handleGuess(letter)} 
                                className={`alphabet-btn ${guessedLetters.includes(letter) ? 'disabled' : ''}`}
                                disabled={guessedLetters.includes(letter)}>
                                {letter}
                            </button>
                            ))}
                            </div>
                            {renderHangman()}
                            </div>
                            );
                        } else if (gameState === 'won') {
                            return (
                            <div className="game-over">
                                <div className="game-over-message">you won</div>
                                <div className='game-over-score-container'>
                                    <div className="game-over-score-text">your score is</div>
                                    <div className="game-over-score">{`${currentScore}`}</div>
                                </div>
                                <button className="game-over-restart" onClick={handleRestart}>continue</button>
                                </div>
                            );
                            } else if (gameState === 'lost') {
                                return (
                                <div className="game-over">
                                    <div className="game-over-message">game over</div>
                                    <div className='game-over-score-container'>
                                        <div className="game-over-score-text">your score is</div>
                                        <div className="game-over-score">{`${currentScore}`}</div>
                                    </div>
                                    <button className="game-over-restart" onClick={handleRestart}>continue</button>
                                    </div>
                                );}};
                                return (
                                <div className="hangman-game">
                                    
                                    {renderGame()}
                                </div>
                                );};

export default Hangman;