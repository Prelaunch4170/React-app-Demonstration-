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

            <div className="row mt-3">
                <div className="col-md-4">
                    <input type="date" className="form-control input-height" placeholder="" />
                </div>
                <div className="col-md-5 d-flex align-items-center">
                    <div className="form-check me-3">
                        <input type="radio" className="form-check-input" id="PToP" name="cameraType" />
                        <label className="form-check-label" htmlFor="PToP">P to P</label>
                    </div>
                    <div className="form-check">
                        <input type="radio" className="form-check-input" id="Inter" name="cameraType" />
                        <label className="form-check-label" htmlFor="Inter">Intersection</label>
                    </div>
                </div>
                <div className="col-md-3">
                    <button className="btn btn-success">
                        Get Report
                    </button>
                </div>
            </div>
        </div>

    )


}

export default Suburbs