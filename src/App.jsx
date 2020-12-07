import React, { useState, useEffect } from 'react';
import './App.css';
import { useKeyPress } from "./hooks";

// hard-coding max chars for now; 
// prob more than can fit on a 4K monitor at native resolution
const maxChars = () => 83;
const baseThought = "...";

/// returns true if input is an alphabetic char, a number, or a special symbol char
const isValidChar = (char) => {
  if (char.length > 1) {
    console.log("invalid")
    return false;
  }
  console.log("valid");
  return true;
}

function App() {
  const [thought, setThought] = useState(baseThought);
  const [letter, setLetter] = useState("");

  const upHandler = useKeyPress(setLetter)[1];

  useEffect(() => {
    console.log("mounting...");
    console.log("letter", `'${letter}'`);
    console.log("thought", `'${thought}'`);
    if (thought === baseThought && letter.length > 0) {
      if (isValidChar(letter)) {
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
      setThought(thought + '\xa0')
    }
    else if (isValidChar(letter)) {
      if (thought.length > maxChars()) {
        // trim front of thought
        setThought(thought.slice(1, thought.length) + letter)
      }
      else {
        setThought(thought + letter);
      }
    }
    setLetter("");
  }, [thought, upHandler]);



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
    <div className="App">
      <div className="scoot-left" style={{ ...styleTheme(night) }}>
        {thought}
      </div>
    </div>
  );
}

export default App;
