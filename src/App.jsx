import React, { useState, useEffect } from 'react';
import './App.css';
import { useKeyPress } from "./hooks";
import Clouds from './Clouds';

// calculated from width_of_container / width_of_monospace_char
const maxChars = 114;
const baseThought = "...";
const cursorInterval = 710;

// theme
const night = {
  backgroundColor: "#0D0D0C",
  textColor: "#15C87C",
};

/// returns true if input is an alphabetic char, a number, or a special symbol char
const isValidChar = (char) => {
  if (char.length > 1) {
    return false;
  }
  return true;
}

/// Returns a style object given a theme.
const styleTheme = theme => {
  return { color: theme.textColor, backgroundColor: theme.backgroundColor };
}

function App() {
  const [thought, setThought] = useState(baseThought);
  const [thoughts, setThoughts] = useState();
  const [showCursor, setShowCursor] = useState(true);

  // Appends only valid chars to a thought.
  // Handles special chars & their actions.
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

  // register keypress handler
  const upHandler = useKeyPress(handleKeypress)[1];

  /// Pushes a thought to `thoughts`
  const pushThought = (thought) => {
    let tempThoughts = thoughts || [];
    tempThoughts.push(thought);
    setThoughts(tempThoughts);
  }

  /// Returns thoughts in reverse-order.
  const getReverseThoughts = () => {
    if (!thoughts || thoughts.length === 0) {
      return [];
    }
    return [].concat(thoughts).reverse();
  }

  /// Trims thought for typing display to prevent screen-wise overflow
  const renderThought = (thought) => {
    return thought.slice(Math.max(thought.length - maxChars, 0), thought.length);
  }

  const save = e => {
    e.preventDefault();
    if (!thoughts) return;
    const now = new Date();
    const time = now.toLocaleTimeString();
    const date = now.toLocaleDateString();
    let thoughtString = "";
    thoughts.map(thought => thoughtString += (thought + "\n"));
    
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(thoughtString));
    element.setAttribute('download', `thoughts-${date}-${time}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  useEffect(() => {
    // cursor timer
    let interval = null;
    interval = setInterval(() => {
      setShowCursor(!showCursor);
    }, cursorInterval);

    // destructor
    return () => clearInterval(interval);
  }, [upHandler, showCursor, thoughts]);

  return (
    <>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div className="App monospace" style={{ ...styleTheme(night) }}>
          <div className="scoot-left" style={{ ...styleTheme(night) }}>
            {renderThought(thought)}
          </div>
        </div>
        <Clouds />
        <div className="cursor" style={{ ...styleTheme(night), position: "absolute", left: 1097 }}>
          {showCursor ? "|" : ""}
        </div>
        <div className="right-sky" style={{ ...styleTheme(night) }}></div>
      </div>
      <div className="thoughts">
        <a href="/" onClick={save} style={{position: "fixed", bottom: 10, right: 10, fontFamily: "monospace", color: "whitesmoke"}}>save thoughts</a>
        <div style={{marginTop: 20}}>
          {getReverseThoughts().map((thought, idx) => <p style={{margin: 0, marginBottom: 8}} key={idx}>{thought}</p>)}
        </div>
      </div>
    </>
  );
}

export default App;
