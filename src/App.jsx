import React, { useState, useEffect } from 'react';
import './App.css';
import { useKeyPress } from "./hooks";
import Clouds from './Clouds';

// calculated from width_of_container / width_of_monospace_char
const maxChars = 110;
const baseThought = "...";
const cursorInterval = 710;


/// returns true if input is an alphabetic char, a number, or a special symbol char
const isValidChar = (char) => {
  if (char.length > 1) {
    return false;
  }
  return true;
}

function App() {
  const [thought, setThought] = useState(baseThought);
  const [thoughts, setThoughts] = useState();

  const pushThought = (thought) => {
    let tempThoughts = thoughts || [];
    tempThoughts.push(thought);
    setThoughts(tempThoughts);
  }

  // for timer
  const [showCursor, setShowCursor] = useState(true);

  const handleKeypress = (letter) => {
    setShowCursor(false);
    if (letter === "Backspace") {
      if (thought.length === 1) {
        setThought(baseThought);
      }
      else {
        setThought(thought.slice(0, -1));
      }
    }
    else if (letter === "Enter") {
      pushThought(thought);
      setThought(baseThought);
    }
    else if (letter === " ") {
      // allow multiple spaces to be rendered
      if (thought !== baseThought)
        setThought(thought + '\xa0')
    }
    else if (isValidChar(letter)) {
      if (thought === baseThought) {
        setThought(letter);
      }
      else {
        setThought(thought + letter);
      }
    }
  }

  const upHandler = useKeyPress(handleKeypress)[1];

  useEffect(() => {
    // tick timer
    let interval = null;
    interval = setInterval(() => {
      setShowCursor(!showCursor);
    }, cursorInterval);

    // destructor
    return () => clearInterval(interval);
  }, [upHandler, showCursor, thoughts]);

  const night = {
    backgroundColor: "#0D0D0C",
    textColor: "#15C87C",
  };

  const styleTheme = theme => {
    return { color: theme.textColor, backgroundColor: theme.backgroundColor };
  }

  const getReverseThoughts = () => {
    if (!thoughts || thoughts.length === 0) {
      return [];
    }
    let revThoughts = [].concat(thoughts);
    return revThoughts.reverse();
  }

  /// trims thought for typing display to prevent screen-wise overflow
  const renderThought = (thought) => {
    return thought.slice(Math.max(thought.length - maxChars, 0), thought.length);
  }

  return (
    <>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div className="App monospace" style={{ ...styleTheme(night) }}>
          <div className="scoot-left" style={{ ...styleTheme(night) }}>
            {renderThought(thought)}
          </div>
        </div>
        <Clouds />
        <div style={{ ...styleTheme(night), paddingTop: 420 }}>
          {showCursor ? "|" : ""}
        </div>
        <div style={{ ...styleTheme(night), width: "100%" }}></div>
      </div>
      <div className="thoughts">
        {getReverseThoughts().map((thought, idx) => <p key={idx}>{thought}</p>)}
      </div>
    </>
  );
}

export default App;
