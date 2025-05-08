import { useEffect } from 'react';
import { Wordle } from './Wordle'
import './App.css'

function App() {

  useEffect(() => {

      document.body.classList.add("dark");

  }, []);

  return (
    <>
     <Wordle />
    </>
  )
}

export default App
