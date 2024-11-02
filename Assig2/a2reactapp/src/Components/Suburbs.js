import React, { useState } from 'react'
import './CSS/Form.css'

const Suburbs = ({ }) => {
    const [subData, setState] = useState([]);
    const [selectedSelect, setSelected] = useState(['']);

    const [locations, setLocations] = useState([]);

    


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


    
    async function loadLocations() {
        let failedCheck = true
        let suburb = document.getElementById('selectSub').value;
        let offence = document.getElementById('offenceSelect').value;
        let date = document.getElementById('dateSelect').value;
        let cameras = document.querySelectorAll('input[name="cameraType"]');
        let selectedCamera = "";


        if (!suburb) {
            document.getElementById('selectSubError').innerHTML = "Please select a suburb";
        } else {
            document.getElementById('selectSubError').innerHTML = "";
            failedCheck = false;
        }
        if (!offence) {
            document.getElementById('offenceError').innerHTML = "Please select an offence";
        } else {
            document.getElementById('offenceError').innerHTML = "";
            failedCheck = false;
        }
        if (!date) {
            document.getElementById('dateError').innerHTML = "Please select a Date";
        } else {

            document.getElementById('dateError').innerHTML = "";
            failedCheck = false;
        }//https://www.javascripttutorial.net/javascript-dom/javascript-radio-button/
        for (const cameraButton of cameras) {
            if (cameraButton.checked) {
                selectedCamera = cameraButton.value;
                break
            }
        }
        if (!selectedCamera) {
            document.getElementById('cameraError').innerHTML = "Please select a CameraType";
        } else {
            document.getElementById('cameraError').innerHTML = "";
            failedCheck = false;
        } 
        console.log(failedCheck);
        locationId
        if (!failedCheck) {
            try {
                const locations = await fetch(`http://localhost:5147/api/Get_ListCamerasInSuburb?suburb=${suburb}`);
                const locationData = locations.json()


            }



            fetch(`http://localhost:5147/api/Get_ListCamerasInSuburb?suburb=${suburb}`)
                .then(response => response.json())
                .then(data => fetch(`http://localhost:5147/api/Get_ExpiationsForLocationId?locationId=${data.locationId}`)
                    .then(response => response.json())
                    .then(data => setLocations(data))
                    .catch(err => {
                        console.log(err);
                    });)
                .catch(err => {
                    console.log(err);
                });
            
        }
        
    }


    return (
        <div className="container-fluid ">
            <div className="row">
                <div className="col-md-4 form-floating">
                    <select className="form-select" id="selectSub" value={selectedSelect} onChange={selectChanged}>
                        <option value=""></option>
                        {subData.map((suburb, index) => (
                            <option key={index} value={suburb}>{suburb}</option>
                        ))}
                    </select>
                    <label htmlFor="selectSub">Select Suburb</label>
                    <div id="selectSubError" className="text-danger" ></div>
                </div>

                <div className="col-md-4">
                    <input type="text" className="form-control input-height" list="Offence" placeholder="Input Text" id="offenceSelect"/>
                    <datalist id="Offence">
                        <option value="Exceed Signed Speed by 1-9km/h">Exceed Signed Speed by 1-9km/h</option>
                        <option value="Exceed Signed Speed by 10-19km/h">Exceed Signed Speed by 10-19km/h</option>
                        <option value="Exceed Signed Speed by 20-29km/h">Exceed Signed Speed by 20-29km/h</option>
                        <option value="Exceed Signed Speed by 30-44km/h">Exceed Signed Speed by 30-44km/h</option>
                        <option value="Exceed Speed by 45km/h or more">Exceed Speed by 45km/h or more</option>
                        <option value="HV Bus > 5 tonne exceed 100km/h by 1-9km/h">HV Bus > 5 tonne exceed 100km/h by 1-9km/h</option>
                        <option value="HV Bus > 5 tonne exceed 100km/h by 10-19km/h">HV Bus > 5 tonne exceed 100km/h by 10-19km/h</option>
                        <option value="HV Bus > 5 tonne exceed 100km/h by 20-29km/h">HV Bus > 5 tonne exceed 100km/h by 20-29km/h</option>
                        <option value="HV Bus > 5 tonne exceed 100km/h by 30-44km/h">HV Bus > 5 tonne exceed 100km/h by 30-44km/h</option>
                        <option value="HV Vehicle > 12 tonne exceed 100km/h by 1-9km/h">HV Vehicle > 12 tonne exceed 100km/h by 1-9km/h</option>
                        <option value="HV Vehicle > 12 tonne exceed 100km/h by 10-19km/h">HV Vehicle > 12 tonne exceed 100km/h by 10-19km/h</option>
                        <option value="HV Vehicle > 12 tonne exceed 100km/h by 20-29km/h">HV Vehicle > 12 tonne exceed 100km/h by 20-29km/h</option>
                        <option value="HV Vehicle > 12 tonne exceed 100km/h by 30-44km/h">HV Vehicle > 12 tonne exceed 100km/h by 30-44km/h</option>

                    </datalist>
                    <div id="offenceError" className="text-danger" ></div>
                </div>
                <div className="col-md-2">
                    <button className="btn btn-success" onClick={loadLocations}>
                        Load Cameras
                    </button>
                </div>
            </div>

            <div className="row mt-3">
                <div className="col-md-4">
                    <input type="date" className="form-control input-height" placeholder="" id="dateSelect"/>
                    <div id="dateError" className="text-danger" ></div>
                </div>
                <div className="col-md-4 d-flex align-items-center">
                    <div>
                        <div className="form-check me-3">
                            <input type="radio" className="form-check-input" id="PToP" name="cameraType" value="M" />
                            <label className="form-check-label" htmlFor="PToP">mobile</label>
                        </div>
                        <div className="form-check">
                            <input type="radio" className="form-check-input" id="Inter" name="cameraType" value="I/section" />
                            <label className="form-check-label" htmlFor="Inter">Intersection</label>
                        </div>
                    </div>
                    <div id="cameraError" className="text-danger" ></div>
                </div>
                <div className="col-md-2">
                    <button className="btn btn-success" >
                        Get Report
                    </button>
                </div>
            </div>




        </div>



    )


}

export default Suburbs