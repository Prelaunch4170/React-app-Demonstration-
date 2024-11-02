import React, { useEffect, useState } from 'react'
import SHA256 from 'crypto-js/sha256';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';


const SignIn = ({ }) => {
    const navigate = useNavigate();
    function logInQuery(evt) {
        const userName = document.querySelector('[name="userName"]').value;
        const password = document.querySelector('[name="password"]').value;
        const hashedPassword = SHA256(password).toString();

        fetch(`http://localhost:5147/api/Register?userName=${userName}&passwordHash=${hashedPassword}`)
            .then(response => response.json())
            .then(data => {
                if (data === true) {
                    Cookies.set("isSignedIn", true);
                    Cookies.set("Name", userName);
                    navigate("/Dash");
                } else {
                    console.log("Login failed:");
                    document.getElementById("Error_Text").innerHTML = "Could not make Account";
                }
            })
            .catch(err => {
                console.log("Error during login:", err);
            });
    }
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6 mb-3">
                    <div className="form-floating">
                        <h2>Register</h2>
                    </div>
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-md-6 mb-3">
                    <div className="form-floating">
                        <input type="text" name="userName" id="userName" className="form-control" />
                        <label for="userName">User Name</label>
                    </div>
                </div>
            </div>

            <div className="row justify-content-center">
                <div className="col-md-6 mb-3">
                    <div className="form-floating">
                        <input type="password" id="password" name="password" className="form-control" />
                        <label for="password">Password</label>
                    </div>
                </div>
            </div>

            <div className="row justify-content-center mt-4">
                <button type="button" className="btn btn-primary col-md-2" onClick={logInQuery}>Register</button>
            </div>
            <div className="row justify-content-center mt-4">
                <div className="col-md-6 text-center" style={{ color: 'red' }} id="Error_Text">

                </div>
            </div>
        </div>

    )
}

export default SignIn