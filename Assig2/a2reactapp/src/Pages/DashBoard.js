import logo from '../logo.svg';
import '../App.css';
import React, { useState } from 'react';
import Suburbs from '../Components/Suburbs';



function DashBoard() {
    return (
        
        <div className="container justify-content-center">
            <div className="col-12">
                <Suburbs />
            </div>
        </div>
    );
}

export default DashBoard;