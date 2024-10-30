import React, { useState } from 'react'
import './CSS/Form.css'

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
        <div className="container text-center">
            <div className="row">
                <div className="col-md-6 form-floating">
                    <select className="form-select" id="selectSub" value={selectedSelect} onChange={selectChanged}>
                        <option value=""></option>
                        {subData.map((suburb, index) => (
                            <option key={index} value={suburb}>{suburb}</option>
                        ))}
                    </select>
                    <label htmlFor="selectSub">Select Suburb</label>
                </div>

                <div className="col-md-6">
                    <input type="text" className="form-control input-height" placeholder="Input Text" />
                </div>
            </div>

        </div>

    )


}

export default Suburbs