import React, { useState } from 'react'


const Suburbs = ({ }) => {
    const [subData, setState] = useState([]);

    const [selectedSelect, setSelected] = useState(['']);

    React.useEffect(() => {
        fetch("http://localhost:5147/api/Get_ListCameraSuburbs")
            .then(response => response.json())
            .then(data => setState(data))
            .catch(err => {
                console.log(err);
            });
    },[])
    //https://bobbyhadz.com/blog/react-select-onchange
    const selectChanged = event => {
        setSelected(event.target.value);
    }

    return (
        <div className="container">
            <div className="row justify-content-md-center form-floating">
                <div className="form-floating col-4">
                    <select className="form-select" id="selectSub" value={selectedSelect} onChange={selectChanged}>
                        <option value=""></option>
                        {subData.map((suburb, index) => (
                            <option key={index} value={suburb}>{suburb}</option>
                        ) )}
                </select>
                        <label htmlfor="selectSub">Select Suburb</label>
                </div>
            </div>
        </div>
    )


}

export default Suburbs