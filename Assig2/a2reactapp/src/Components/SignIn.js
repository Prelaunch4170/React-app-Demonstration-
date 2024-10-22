import React, { useState } from 'react'
import SHA256 from 'crypto-js/sha256';

const SignIn = ({ }) => {
    const [subData, setState] = useState([]);

    const [selectedSelect, setSelected] = useState(['']);

    const [qUserName, setUserName] = useState('');
    const [qPassword, setPassword] = useState('');

    React.useEffect(() => {
        console.log(`http://localhost:5147/api/Login?userName=${qUserName}&passwordHash=${qPassword}`);
        fetch(`http://localhost:5147/api/Login?userName=${qUserName}&passwordHash=${qPassword}`)
            .then(response => response.json())
            .then(data => setState(data))
            .catch(err => {
                console.log(err);
            });
        console.log(subData);
    }, [])
    //https://bobbyhadz.com/blog/react-select-onchange
    
    function logInQuery(evt) {
        const userName = document.querySelector('[name="userName"]').value;
        const password = document.querySelector('[name="password"]').value;
        const hashedPassword = SHA256(password).toString();
        console.log(hashedPassword);
        console.log(subData);
        setUserName(userName);
        setPassword(hashedPassword);
    }
    return (
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-4 mb-3">
                    <div class="form-floating">
                        <input type="text" name="userName" id="userName" class="form-control" />
                        <label for="userName">User Name</label>
                    </div>
                </div>
            </div>

            <div class="row justify-content-center">
                <div class="col-md-4 mb-3">
                    <div class="form-floating">
                        <input type="password" id="password" name="password" class="form-control" />
                        <label for="password">Password</label>
                    </div>
                </div>
            </div>

            <div class="row justify-content-center mt-4">
                <button type="button" class="btn btn-primary col-md-2" onClick={logInQuery}>Sign in</button>
            </div>
        </div>

    )
}

export default SignIn