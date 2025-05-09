import React, { useEffect, useRef, useState } from 'react';
import { message } from 'antd';
import { Keyboard } from './Keyboard';
import Fireworks from 'react-canvas-confetti/dist/presets/fireworks';
import { clsx } from 'clsx';
import { checkForWin, isSingleLetter } from './helpers';


const N_GUESSES = 6;
const WORD_LENGTH = 5;

export const Wordle = () => {

  /**
   * Game board configuration
   * [
   *  [(y+0, x+0), (y+0, x+1), (y+0, x+2), ...],
   *  [(y+1, x+0), (y+1, x+1), (y+1, x+2), ...],
   *  ...
   * ]
   */
  const [board, setBoard] = useState(Array(N_GUESSES).fill(null).map(() => Array(WORD_LENGTH).fill('')));
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Used to trigger animation
  const [lastPosition, setLastPosition] = useState(null);

  /**
   * -1: Square is empty
   * 0: Character is not in the word, square is grey
   * 1: Character is in the word but not in the correct position, square is yellow
   * 2: Character is in the word and in the correct position, square is green
   */
  const [scores, setScores] = useState(Array(N_GUESSES).fill(null).map(() => Array(WORD_LENGTH).fill(-1)));
  const [validCharacters, setValidCharacters] = useState({});
  
  /**
   * Messages
   */
  const [messageApi, contextHolder] = message.useMessage();
  const showMessage = (type, message) => {
    messageApi.open({
      type: type,
      content: message,
      style: { marginTop: '20vh' }
    });
  };

  const conductorRef = useRef(null);  // Firewords conductor reference

  /**
   * API call to validate guess
   */
  const onEnter = async () => {
    try {
      const response = await fetch('https://wordle-apis.vercel.app/api/validate', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ guess: board[y].join('') }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.is_valid_word) {
        showMessage('warning', 'Invalid word');
        return;
      }

      // valid word
      for (let i=0; i<WORD_LENGTH; i++) {
        setTimeout(() => {
          setScores(prev => {
            const newScores = prev.map(row => [...row]);
            newScores[y][i] = data.score[i];
            if (data.score[i] === 1 || data.score[i] === 2) {
              setValidCharacters(prevCharacters => ({...prevCharacters, [board[y][i]]: data.score[i]}));
            }
            return newScores;
          })
        }, i*300);
      }
      if (checkForWin(data.score)) {
        setGameOver(true);
        setTimeout(() => {
          showMessage('success', 'Congratulations — you won!');
          conductorRef.current.run({speed: 3, duration: 10});
        }, WORD_LENGTH*300);
      } else {
        if (y+1 === N_GUESSES) {
          setGameOver(true);
          setTimeout(() => {
            showMessage('warning', 'Game over — All six guesses have been used');
          }, WORD_LENGTH*300);    
        }
      }
      setX(0); setY(y+1);
    } catch (error) {
      console.error(error);
    }
  }

  const onKeyPress = (key) => {
    if (gameOver) return;

    const upperCaseKey = key.toUpperCase();
    if (upperCaseKey === 'ENTER') {
      if (x !== WORD_LENGTH) {
        showMessage('warning', 'The word must be exactly 5 letters long');
        return;
      }
      setLastPosition(null);
      onEnter();
    } else if (upperCaseKey === "BACKSPACE") {
      if (x === 0) return;
      setLastPosition(null);
      setBoard(prev => {
        const newBpard = prev.map(row => [...row]);
        newBpard[y][x-1] = '';
        setX(x-1);
        return newBpard;
      });
    } else if (isSingleLetter(upperCaseKey) && x < WORD_LENGTH) {
      setBoard(prev => {
        const newBoard = prev.map(row => [...row]);
        newBoard[y][x] = upperCaseKey;
        setLastPosition([y, x]);
        setX(x+1);
        return newBoard;
      });
    }
  };

  useEffect(() => {
    const handleKeyPress = (event) => onKeyPress(event.key);
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [x, y]);

  return (
    <>
      {contextHolder}
      <h1>Wordle</h1>
      <div className="flex flex-col gap-2 my-8">
        {board.map((row, i) => (
          <div key={i} className="flex items-center justify-center gap-2">
            {row.map((letter, j) => (
              <div key={j} className="w-18 h-18 perspective-midrange">
                <div className={clsx(
                  "relative w-full h-full transition-transform duration-800 transform-3d",
                  scores[i][j] !== -1 && "rotate-y-180"
                )}>
                <div
                  className={clsx(
                    "absolute w-full h-full flex items-center justify-center border text-3xl font-black backface-hidden",
                    letter === '' ? "border-gray-300" : "border-black",
                    lastPosition && lastPosition[0] === i && lastPosition[1] === j && "animate-fade-in-scale",
                  )}>
                    {letter}
                  </div>
                  <div className={clsx(
                    "absolute w-full h-full flex items-center justify-center border text-3xl font-black backface-hidden rotate-y-180",
                    scores[i][j] === -1 && "bg-white text-black",
                    scores[i][j] === 0 && "bg-gray-500 text-white border-none",
                    scores[i][j] === 1 && "bg-amber-400 text-white border-none",
                    scores[i][j] === 2 && "bg-lime-500 text-white border-none",
                  )}>
                    {letter}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div><Keyboard onKeyPress={onKeyPress} validCharacters={validCharacters} /></div>
      <Fireworks onInit={params => {conductorRef.current = params.conductor;}} />
    </>
  );
}

