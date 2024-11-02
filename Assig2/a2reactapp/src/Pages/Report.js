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
        <p>
         Report Page
            118

        </p>

    );
}

export default App;
