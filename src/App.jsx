import React, { useState, useEffect } from 'react';
import './App.css';
import { useKeyPress } from "./hooks";

// calculated from width_of_container / width_of_monospace_char
const maxChars = () => 110;
const baseThought = "...";

/// returns true if input is an alphabetic char, a number, or a special symbol char
const isValidChar = (char) => {
  if (char.length > 1) {
    return false;
  }
  return true;
}

function App() {
  const [thought, setThought] = useState(baseThought);

  // for timer
  const [showCursor, setShowCursor] = useState(true);

  const handleKeypress = (letter) => {
    setShowCursor(false);
    if (thought === baseThought && letter.length > 0 && letter !== " ") {
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
  }

  const upHandler = useKeyPress(handleKeypress)[1];

  useEffect(() => {
    console.log("mount");
    // tick timer
    let interval = null;
    interval = setInterval(() => {
      setShowCursor(!showCursor);
    }, 710);
    return () => clearInterval(interval);
  }, [upHandler, showCursor]);

  // const tan = {
  //   backgroundColor: "#2E221E",
  //   textColor: "#DBDCB8",
  // };

  const night = {
    backgroundColor: "#0D0D0C",
    textColor: "#15C87C",
  };

  const styleTheme = theme => {
    return { color: theme.textColor, backgroundColor: theme.backgroundColor };
  }

  return (
    <div style={{display: "flex", flexDirection: "row"}}>
      <div className="App monospace" style={{...styleTheme(night)}}>
        <div className="scoot-left" style={{ ...styleTheme(night) }}>
          {thought}
        </div>
      </div>
      {/* TODO: figure out why the words go off to the right after a while. Spaces? Special chars? */}
      {/* <div className="monospace">{`\xa0`}</div>
      <div className="monospace">{`b`}</div> */}
      <div style={{...styleTheme(night), paddingTop: 420}}>
        {showCursor ? "|" : ""}
        </div>
      <div style={{...styleTheme(night), width: "100%"}}></div>
    </div>
  );
}

export default App;
