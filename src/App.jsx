import React, { useState, useEffect } from 'react';
import './App.css';
import { useKeyPress } from "./hooks";

const notLetters = [
  "Shift",
  "Alt",
  "Meta",
  "Control",
  "ArrowRight",
  "ArrowLeft",
  "ArrowUp",
  "ArrowDown",
  "Tab",
  "CapsLock",
  "Backspace",
  "Enter"
];

// hard-coding max chars for now; 
// prob more than can fit on a 4K monitor at native resolution
const maxChars = () => 420;
const baseThought = "...";

function App() {
  let [thought, setThought] = useState(baseThought);
  const appendThought = letter => {
    console.log("letter", letter);
    console.log("thought", thought);
    if (thought === baseThought) {
      if (!notLetters.includes(letter)) {
        setThought(letter);
      }
    }
    else if (letter === "Backspace") {
      if (thought.length === 1) {
        setThought(baseThought);
      }
      else {
        setThought(thought.slice(0, -1));
      }
    }
    else if (letter === "Enter") {
      setThought(baseThought);
    }
    else if (letter === " ") {
      setThought(thought + ' ')
    }
    else if (!notLetters.includes(letter)) {
      if (thought.length > maxChars()) {
        // trim front of thought
        setThought(thought.slice(1, thought.length) + letter)
      }
      else {
        setThought(thought + letter);
      }
    }
  }
  // const [keyPressed, upHandler] = useKeyPress(appendThought);
  const upHandler = useKeyPress(appendThought)[1];

  useEffect(() => {
  }, [thought, upHandler]);

  const Y = 420;
  const X = 600;

  const style = {
    paddingRight: X,
    paddingTop: Y,
    overflow: "hidden",
    fontFamily: "monospace",
    fontSize: "large",
  };

  // const cursor = () => {
  //   return keyPressed ? "|" : "";
  // }

  const tan = {
    backgroundColor: "#2E221E",
    textColor: "#DBDCB8",
  };

  const night = {
    backgroundColor: "#0D0D0C",
    textColor: "#15C87C",
  };

  const styleTheme = theme => {
    return { color: theme.textColor, backgroundColor: theme.backgroundColor };
  }

  return (
    <>
      <div className="App">
        <div className="scoot-left" style={{ ...style, ...styleTheme(night) }}>
          {thought}
        </div>
      </div>
    </>
  );
}

export default App;
