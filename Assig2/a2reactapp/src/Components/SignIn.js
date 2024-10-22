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
        <div className="row justify-content-start mb-3">
            <div class="form-outline mb-4">
                <input type="text" name="userName" id="userName" class="form-control" />
                <label class="form-label" for="userName">User Name</label>
            </div>

            <div class="form-outline mb-4">
                <input type="password" id="password" name="password" class="form-control" />
                <label class="form-label" for="password">Password</label>
            </div>

            <button type="button" class="btn btn-primary btn-block mb-4" onClick={logInQuery}>Sign in</button>
        </div>

    )
}

export default SignIn