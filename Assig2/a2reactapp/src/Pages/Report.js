import logo from '../Images/sapolice.png';
import '../App.css';
import React, { useEffect, useState } from 'react';
import SHA256 from 'crypto-js/sha256';
import Suburbs from '../Components/Suburbs'
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

function App() {
    const isSignedIn = Cookies.get("isSignedIn");
    const navigate = useNavigate();

    const offenceSearch = "km/h"

    useEffect(() => {
        if (!isSignedIn) {
            navigate("/login");
        } else {
            document.getElementById('name').innerHTML = "Hello " + Cookies.get('Name');
            fetchData();
        }
    })
    function SignOut() {
        Cookies.remove('isSignedIn');
        Cookies.remove('Name');
        window.location.reload();
    }

    async function fetchData() {
        const offencesCall = await fetch(`http://localhost:5147/api/Get_SearchOffencesByDescription?searchTerm=${offenceSearch}`)
        const offenceData = await offencesCall.json();
        let offencesList = ""

        offenceData.forEach(offence => offencesList += `&offenceCodes=${offence.offenceCode}`)

        //#region svg query for 118
        const Data118 = await fetch(`http://localhost:5147/api/Get_ExpiationsForLocationId?locationId=${118}&cameraTypeCode=${'I/section'}&endTime=2147483647${offencesList}`)
        const Json118 = await Data118.json();


        let expiationsByMonth118 = [];

    }

    return (
        <div className="container-fluid ">
            <p>
             Report Page
                118
                65 
            </p>
            
            <svg width="50%" height="600px" className="border border-primary rounded p-2"> </svg>
        </div>
    );
}

export default App;
