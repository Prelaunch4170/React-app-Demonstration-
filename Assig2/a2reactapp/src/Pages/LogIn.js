
import '../App.css';
import React, { useState, useEffect } from 'react';
import Signin from '../Components/SignIn';
import Register from '../Components/Register';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function Login() {
    const isSignedIn = Cookies.get("isSignedIn");
    const navigate = useNavigate();
    useEffect(() => {
        if (isSignedIn) {
            navigate("/Dash");
        }
    })


    return (
        <div className="App">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <p className="navbar-brand">Log In</p>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link active" to="Signin">Sign In</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" to="Register">Register</Link>
                            </li>
                        </ul>
                    </div> 
                </div>

            </nav>
            <Outlet />
        </div>


    );
}

export default Login;