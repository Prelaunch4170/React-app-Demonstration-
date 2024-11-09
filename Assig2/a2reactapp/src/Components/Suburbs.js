import React, { useEffect, useState } from 'react'
import './CSS/Form.css'
import { useNavigate } from 'react-router-dom';

const Suburbs = ({ }) => {
    const [subData, setState] = useState([]);
    const [selectedSelect, setSelected] = useState(['']);

    const [locations, setLocations] = useState([]);
    const navigate = useNavigate();
    

    useEffect(() => {
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
            if (document.querySelectorAll('input[type="checkbox"]:checked').length !== 2) {
                document.getElementById('reportError').innerHTML = "Please select only 2 locations";
            } else {
                navigate(`/Report/118/51/I%2Fsection`)
            }
        }
    }

    //#region getting cameras in suburbs
    const [searchSuburb, setSearchSuburb] = useState('');
    const [searchSuburbD, setSuburbData] = useState([]);//need for last query
    useEffect(() => {
        console.log(searchSuburb)
        if (searchSuburb) {
            fetch(`http://localhost:5147/api/Get_ListCamerasInSuburb?suburb=${searchSuburb}`)
                .then(response => response.json())
                .then(data => setSuburbData(data));
            
        }

    }, [searchSuburb]);

    //#endregion


    //#region getting and making offence query
    const [searchOffence, setSearchOffence] = useState('');
    const [offenceSearchQuery, setOffenceSearchQuery] = useState('');//need for last query

    
    useEffect(() => {
        if (searchOffence && searchOffence !== "All") {
            console.log("\nSpecific\n")
            fetch(`http://localhost:5147/api/Get_SearchOffencesByDescription?searchTerm=${searchOffence}`)
                .then(response => response.json())
                .then(data => {
                    let offenceQuery = "";

                    data.forEach(offence => offenceQuery += `&offenceCodes=${offence.offenceCode}`)
                    
                    setOffenceSearchQuery(offenceQuery)
                })
        } else if (searchOffence && searchOffence === "All"){
            setOffenceSearchQuery('');
            console.log("All\n")
        }
       

    }, [searchOffence])

    //#endregion

    //#region main query to get data
    const [searchDate, setSearchDate] = useState('');
    const [searchCamera, setsearchCamera] = useState('');

    useEffect(() => {
        let currentDate = new Date();
        let UnixDateNow = Math.floor(currentDate.getTime() / 1000);
        let locationsWithExpiationss = [];

        // Gather all fetch promises
        
        for (const locationa of searchSuburbD) {
            console.log("\n\n this:\n" + JSON.stringify( locationa))
        }
        console.log(offenceSearchQuery) 
        const fetchPromises = searchSuburbD
            .filter(location => location.cameraTypeCode === searchCamera) // Filter relevant locations
            .map(location => {
                return fetch(`http://localhost:5147/api/Get_ExpiationsForLocationId?locationId=${location.locationId}&cameraTypeCode=${searchCamera}&startTime=${searchDate}&endTime=2147483647${offenceSearchQuery}`)
                    .then(response => response.json())
                    .then(expiationData => {
                        if (expiationData.length > 0) {
                            locationsWithExpiationss.push({
                                locationSuburb: location.suburb,
                                locationId: location.locationId,
                                expiations: expiationData.length,
                                road: location.roadName,
                                roadType: location.roadType || "RD",
                                cameraType: expiationData[0].cameraTypeCode,
                                cameraType1: location.cameraType1,
                            });
                        }
                    });
            });

        // Wait for all fetches to complete
        Promise.all(fetchPromises).then(() => {
            //console.log("Final locations with expiations:", locationsWithExpiationss);

            locationsWithExpiationss.sort((a, b) => b.expiations - a.expiations);
            setLocations(locationsWithExpiationss);
            document.getElementById('loading').style.display = 'none';
            
        });
    }, [searchSuburbD, offenceSearchQuery, searchDate, searchCamera]);

    //#endregion
    function loadLocations() {

        //#region validation
        let failedCheck = false;
        let suburb = document.getElementById('selectSub').value;
        let offence = document.getElementById('offenceSelect').value;
        let date = document.getElementById('dateSelect').value;
        let cameras = document.querySelectorAll('input[name="cameraType"]');
        let selectedCamera = "";
        
      
        document.getElementById('loading').style.display = 'initial';
      
        
        if (!suburb) {
            document.getElementById('selectSubError').innerHTML = "Please select a suburb";
            failedCheck = true;
        } else {
            document.getElementById('selectSubError').innerHTML = "";
            
        }
        if (!offence) {
            document.getElementById('offenceError').innerHTML = "Please select an offence";
            failedCheck = true;
        } else {
            document.getElementById('offenceError').innerHTML = "";
            
        }
        if (!date) {
            document.getElementById('dateError').innerHTML = "Please select a Date";
            failedCheck = true;
        } else {
            //convert date
            const jsDate = new Date(date);
            var dateConvert = Math.floor(jsDate.getTime() / 1000);
            document.getElementById('dateError').innerHTML = "";
            
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
            failedCheck = true;
        } else {
            document.getElementById('cameraError').innerHTML = "";
        } 
        //#endregion
        //console.log(failedCheck)
        if (!failedCheck) {

            setSearchSuburb(suburb);
            setSearchOffence(offence);
            setSearchDate(dateConvert);
            setsearchCamera(selectedCamera);
                  
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
                    <div id="selectSubError" className="text-warning" ></div>
                </div>

                <div className="col-md-4">
                    <input type="text" className="form-control input-height" list="Offence" placeholder="Input Text" id="offenceSelect"/>
                    <datalist id="Offence">
                        <option value="All">All</option>
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
                            <label className="form-check-label" htmlFor="PToP">Mobile</label>
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

                                {`Camera Location ${location.locationId} in ${location.locationSuburb.charAt(0) + location.locationSuburb.slice(1).toLowerCase()} on ${location.road.charAt(0) + location.road.slice(1).toLowerCase() +" " + location.roadType} has ${location.expiations} expiations from a ${location.cameraType1} `}
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