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
    

    return (
        
    )


}

export default SignIn