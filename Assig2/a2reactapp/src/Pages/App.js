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
                    <p className="navbar-brand">
                        <img src={logo} width="340" height="100" alt=""/>
                    </p>

                    <div className="d-flex" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link active" to="/Dash"> Dash</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" to="/Report"> Report</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link disabled" to="/login"> Login</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link disabled" to="/login/Register"> Register</Link>
                            </li>
                        </ul>
                    </div> 


                    <div className="justify-content-end">
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
