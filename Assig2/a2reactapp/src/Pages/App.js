import logo from '../logo.svg';
import '../App.css';
import React, { useState } from 'react';
import SHA256 from 'crypto-js/sha256';
import Suburbs from '../Components/Suburbs'
import { Link, Outlet } from 'react-router-dom';
function App() {
  return (
    <div className="App">
          <nav class="navbar navbar-expand-lg navbar-light bg-light">
              <div class="container-fluid">
                  <p class="navbar-brand">Navbar</p>

                  <div class="collapse navbar-collapse" id="navbarNav">
                      <ul class="navbar-nav">
                          <li class="nav-item">
                              <a class="nav-link active" aria-current="page" href="#">Home</a>
                          </li>
                          <li class="nav-item">
                              <Link className="nav-link active" to="/Login"> Login</Link>
                          </li>
                          <li class="nav-item">
                              <Link className="nav-link active" to="/Dash"> Dash</Link>
                          </li>
                      </ul>
                  </div>
              </div>

          </nav>
          <Outlet />
    </div>
  );
}

export default App;
