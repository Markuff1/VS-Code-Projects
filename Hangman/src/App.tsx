import { useCallback, useEffect, useState } from "react"
import words from "./wordlist.json"
import { HangmanDrawing } from "./HangmanDrawing"
import { HangmanWord } from "./HangmanWord"
import { Keyboard } from "./Keyboard"
import styles from "./keyboard.module.css"

function getWord(){
  return words[Math.floor(Math.random()* words.length)]
}

function App() {
  const[wordToGuess, setWordToGuess] = useState(() => {
    return words[Math.floor(Math.random()* words.length)]
  })

  const[guessedLetters, setGuessedLetters] = useState<string[]>([])

  const incorrectLetters = guessedLetters.filter(
    letter => !wordToGuess.includes(letter))

  
    const isLoser = incorrectLetters.length >= 6
    const isWinner = wordToGuess.split("").every(letter => guessedLetters.includes(letter))

    
  const addGuessedLetter = useCallback((letter: string) => {
    if (guessedLetters.includes(letter) || isLoser || isWinner) return

    setGuessedLetters(currentLetter => [...currentLetter,letter])
  },[guessedLetters])

  useEffect(() =>{
    const handler = (e: KeyboardEvent) =>{
      const key = e.key

      if (key !== "Enter") return

      e.preventDefault
      setGuessedLetters([])
      setWordToGuess(getWord())
    }

    document.addEventListener("keypress",handler)

    return () => {
      document.removeEventListener("keypress", handler)
    }
  }, [guessedLetters])



  useEffect(() =>{
    const handler = (e: KeyboardEvent) =>{
      const key = e.key

      if (!key.match(/^[a-z]$/)) return

      e.preventDefault
      addGuessedLetter(key)
    }

    document.addEventListener("keypress",handler)

    return () => {
      document.removeEventListener("keypress", handler)
    }
  }, [guessedLetters])

  function Restart(){
    setGuessedLetters([])
    setWordToGuess(getWord())
  }

  const modal = document.querySelector<HTMLDialogElement>("#modal");
  const openModal = document.querySelector<HTMLButtonElement>("#openModal");
  const closeModal = document.querySelector<HTMLButtonElement>("#closeModal");

  if (modal) {
    openModal &&
      openModal.addEventListener("click", () => modal.showModal());

    closeModal &&
      closeModal.addEventListener("click", () => modal.close());
  }


  return (
    <div
      style={{
        maxWidth:"800px",
        display:"flex",
        flexDirection:"column",
        gap:"2rem",
        margin:"0 auto",
        alignItems:"center"
      }}
    >
      <div
      style={
        {
          fontSize:"5rem",
          textAlign:"center",
          paddingTop:"10px",
          fontWeight:"bold",
          textDecoration:"underline",
          fontFamily: 'Franklin Gothic Medium',
        }}>
        Hangman


      <button 
        id="openModal"
        className={`${styles.helpButton}`} >?
      </button>

      <dialog id ="modal" style={{
        height: "30rem",
        width: "50%",
        borderRadius: "75px",
      }}>
      <h1 style={{
          fontSize:"3rem",
          fontWeight:"bold",
          textDecoration: "underline",
          fontFamily: 'Franklin Gothic Medium',
          marginTop: "S0px",
        }}>
          HELP</h1>
        <p style={{
          fontSize:"1.5rem",
          fontWeight:"bold",
          fontFamily: 'Franklin Gothic Medium',
        }}>
          This is Hangman, where you are trying to guess the hiden work, but be careful, if you don't guess it before the Man is completed, you lose. 
          To Type in letter, either use your keyboard or the one provided on-screen
        </p>
        <p style={{
        fontSize:"1.5rem",
        fontWeight:"bold",
        fontFamily: 'Franklin Gothic Medium',
        }}>
          If you fail or need a restart, either Press the Restart button, Click Enter on your keyboard or click the refresh button on the top of your browser
          </p>
        <button 
          id="closeModal"
          className={`${styles.closeButton}`} >Close
        </button>
      </dialog>


      </div>
      <div style={{fontSize:"2rem", textAlign: "center", fontFamily: 'Franklin Gothic Medium'}}>
        {isWinner && "Winner! - Refresh to try again"}
        {isLoser && "Woah Loser - Refresh to try again"}
        </div>
      <HangmanDrawing numberOfGuesses={incorrectLetters.length}/>
      <HangmanWord reveal = {isLoser} guessedLetters = {guessedLetters} wordToGuess={wordToGuess}/>
      <div style={{ alignSelf: "stretch" }}>
        <Keyboard 
          disabled={isWinner || isLoser}
          activeLetters={guessedLetters.filter(letter =>
          wordToGuess.includes(letter)
          )}
          inactiveLetters={incorrectLetters}
          addGuessedLetter={addGuessedLetter}
        />

        <button 
        onClick={() => Restart()}
        className={`${styles.restartButton}`} >Restart</button>
      </div>
    </div>
  )
}


export default App
