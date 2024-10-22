import React, { useState } from 'react'


const SignIn = ({ }) => {
    const [subData, setState] = useState([]);

    const [selectedSelect, setSelected] = useState(['']);

    React.useEffect(() => {
        fetch(`http://localhost:5147/api/Login`)
            .then(response => response.json())
            .then(data => setState(data))
            .catch(err => {
                console.log(err);
            });
    }, [])
    //https://bobbyhadz.com/blog/react-select-onchange
    
    function logInQuery(evt) {

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

        </div>

    )


}

export default SignIn