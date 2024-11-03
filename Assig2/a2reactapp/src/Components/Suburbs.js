import React, { useState } from 'react'
import './CSS/Form.css'
import { useNavigate } from 'react-router-dom';

const Suburbs = ({ }) => {
    const [subData, setState] = useState([]);
    const [selectedSelect, setSelected] = useState(['']);

    const [locations, setLocations] = useState([]);
    const navigate = useNavigate();
    


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

    function makeReport() {
        if (locations.length < 1) {
            document.getElementById('reportError').innerHTML = "Please fill fields";
        } else {
            //https://stackoverflow.com/a/22938796
            if (document.querySelectorAll('input[type="checkbox"]:checked').length != 2) {
                document.getElementById('reportError').innerHTML = "Please select only 2 locations";
            } else {
                navigate('/Report')
            }
        }
    }
    
    async function loadLocations() {
        let failedCheck = true
        let suburb = document.getElementById('selectSub').value;
        let offence = document.getElementById('offenceSelect').value;
        let date = document.getElementById('dateSelect').value;
        let cameras = document.querySelectorAll('input[name="cameraType"]');
        let selectedCamera = "";
        let locationsWithExpiations = [];

        document.getElementById('loading').style.display = 'initial';
        //validation
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
            //convert date
            const jsDate = new Date(date);
            var dateConvert = Math.floor(jsDate.getTime() / 1000);
            
            document.getElementById('dateError').innerHTML = "";
            failedCheck = false;
        }
        //https://www.javascripttutorial.net/javascript-dom/javascript-radio-button/
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
        


        if (!failedCheck) {
            try {
                // queries im going to need
                const locations = await fetch(`http://localhost:5147/api/Get_ListCamerasInSuburb?suburb=${suburb}`);
                const locationData = await locations.json();

                const offencesCall = await fetch(`http://localhost:5147/api/Get_SearchOffencesByDescription?searchTerm=${offence}`)
                const offenceData = await offencesCall.json();

                

                let offencesList = ""
                
                offenceData.forEach(offence => offencesList += `&offenceCodes=${offence.offenceCode}`)
                 
                console.log("locations")
                //going into each camera location then merging the location with expiations
                for (const location of locationData) {
                    try {
                        console.log(location)
                        if (location.cameraTypeCode == selectedCamera) {
                            const camerasCall = await fetch(`http://localhost:5147/api/Get_ExpiationsForLocationId?locationId=${location.locationId}&cameraTypeCode=${selectedCamera}&startTime=${dateConvert}&endTime=2147483647${offencesList}`);
                            const cameraData = await camerasCall.json();
                            //merging data to be displayed 
                            if (cameraData.length > 0) {
                                
                                locationsWithExpiations.push({
                                    locationSuburb: location.suburb,
                                    locationId: location.locationId,
                                    expiations: cameraData.length,
                                    road: location.roadName,
                                    roadType: location.roadType == null ? ("RD") : (location.roadType),
                                    cameraType: cameraData[0].cameraTypeCode,
                                    cameraType1: location.cameraType1

                                })
                            }
                        }
                        
                    } catch (err) {
                        console.error(`Error fetching for locationId ${location.locationId}:`, err);
                    }
                }
                //sort by number of expiations https://www.javascripttutorial.net/array/javascript-sort-an-array-of-objects/
                locationsWithExpiations.sort((a, b) => b.expiations - a.expiations);
                setLocations(locationsWithExpiations);
              
            } catch (error) {
                console.error("Error in fetching data:", error);
            }        
        }
        document.getElementById('loading').style.display = 'none';
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
                    <div id="selectSubError" className="text-warning" ></div>
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
                    <div id="offenceError" className="text-warning" ></div>
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
                    <div id="dateError" className="text-warning" ></div>
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
                    <div id="cameraError" className="text-warning" ></div>
                </div>
                <div className="col-md-2">
                    <button className="btn btn-success" onClick={makeReport }>
                        Get Report
                    </button>
                    <div id="reportError" className="text-warning" ></div>
                </div>
            </div>
            <div className="mt-3">
                <ul class="list-group list-group-flush ">
                    <li style={{display:'none'} } id="loading">Loading...</li>
                    {locations.length > 0 ? (
                        locations.map((location, index) => (
                            <li key={index} className="list-group-item" id="location-item">

                                {`Location ${location.locationId} in ${location.locationSuburb.charAt(0) + location.locationSuburb.slice(1).toLowerCase()} on ${location.road.charAt(0) + location.road.slice(1).toLowerCase() +" " + location.roadType} has ${location.expiations} expiations from a ${location.cameraType1} `}
                                <input type="checkbox" class="chooseLocation" name="locations" value={ location.locationId}/>
                            </li>
                        ))
                    ) : (
                        <li className="list-group-item" id="testing">No locations with expiations found</li>
                    )}
                </ul>
            </div>
        </div>
    )
}

export default Suburbs