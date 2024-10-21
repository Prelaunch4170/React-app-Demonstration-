import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import SHA256 from 'crypto-js/sha256';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
              <p id="test">
                  Here's some test code for doing the SHA256 crypto stuff:
                  <br/>
                  hunter2 =&nbsp;
                  {
                      SHA256('hunter2').toString() //hash for hunter2 = f52fbd32b2b3b86ff88ef6c490628285f482af15ddcb29541f94bcf526a3f6c7
                  }
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Reactstart
        </a>
      </header>
    </div>
  );
}

export default App;
