import logo from '../Images/sapolice.png';
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
            <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#0060A9' }}>
                <div className="container-fluid">
                    <p className="navbar-brand">
                        <img src={logo} width="340" height="100" alt="" />
                    </p>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link disabled" to="/Dash"> Dash</Link>
                            </li>
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
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="col-md-6">
                    <Outlet />
                </div>
            </div>
        </div>


    );
}

export default Login;