import logo from '../Images/sapolice.png';
import '../App.css';
import React, { useEffect, useState } from 'react';
import SHA256 from 'crypto-js/sha256';
import Suburbs from '../Components/Suburbs'
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function App() {
    const isSignedIn = Cookies.get("isSignedIn");
    const navigate = useNavigate();
    useEffect(() => {
        if (!isSignedIn) {
            navigate("/login");
        } else {
            document.getElementById('name').innerHTML = "Hello " + Cookies.get('Name');
        }
    })
    function SignOut() {
        Cookies.remove('isSignedIn');
        Cookies.remove('Name');
        window.location.reload();
    }
    return (
        <div className="App">
            <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#0060A9' }}>
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/Dash">
                        <img src={logo} width="340" height="100" alt=""/>
                    </Link>

                    <div className="collapse navbar-collapse" id="navbarNav">
                    </div> 
                    <div className="collapse navbar-collapse  justify-content-end">
                        <ul className="navbar-nav">
                            <li className="nav-item ">
                                <div className="nav-link" id="name">

                                </div>
                            </li>
                            <li className="nav-item link">
                                <div className="btn btn-outline-danger" onClick={SignOut}>
                                    Log Out
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <br />
            <Outlet />
        </div>
    );
}

export default App;
