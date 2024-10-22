import React, {useEffect, useState } from 'react'
import SHA256 from 'crypto-js/sha256';
import { useNavigate } from 'react-router-dom';

const SignIn = ({ }) => {
    const [subData, setState] = useState([]);

    const [selectedSelect, setSelected] = useState(['']);

    const [qUserName, setUserName] = useState('');
    const [qPassword, setPassword] = useState('');
    const [attemptLogin, setAttemptLogin] = useState(false); //the query was running twice on load


    const navigate = useNavigate();
    useEffect(() => {
        
        if (attemptLogin) {

            fetch(`http://localhost:5147/api/Login?userName=${qUserName}&passwordHash=${qPassword}`)
                .then(response => response.json())
                .then(data => setState(data))
                .catch(err => {
                    console.log(err);
                });
                if (subData == true) {
                    navigate("/Dash");
                } else {

                    console.log("Login failed:");
                }
        }
    }, [attemptLogin, qUserName, qPassword, navigate])
    //https://bobbyhadz.com/blog/react-select-onchange




    function logInQuery(evt) {
        const userName = document.querySelector('[name="userName"]').value;
        const password = document.querySelector('[name="password"]').value;
        const hashedPassword = SHA256(password).toString();
       
        setUserName(userName);
        setPassword(hashedPassword);
        setAttemptLogin(true)
    }
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-4 mb-3">
                    <div className="form-floating">
                        <input type="text" name="userName" id="userName" className="form-control" />
                        <label for="userName">User Name</label>
                    </div>
                </div>
            </div>

            <div className="row justify-content-center">
                <div className="col-md-4 mb-3">
                    <div className="form-floating">
                        <input type="password" id="password" name="password" className="form-control" />
                        <label for="password">Password</label>
                    </div>
                </div>
            </div>

            <div className="row justify-content-center mt-4">
                <button type="button" className="btn btn-primary col-md-2" onClick={logInQuery}>Sign in</button>
            </div>
        </div>

    )
}

export default SignIn