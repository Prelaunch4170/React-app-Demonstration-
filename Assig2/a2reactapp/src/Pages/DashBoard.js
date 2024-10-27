import logo from '../logo.svg';
import '../App.css';
import React, { useState } from 'react';
import Suburbs from '../Components/Suburbs';



function DashBoard() {
    return (
        
        <div className="row justify-content-md-center align-items-center">
            <div className="col-auto">
                <Suburbs />
            </div>
            <div className="col-auto">
                <button className="btn btn-success">
                    Get Report
                </button>
            </div>
        </div>
    );
}

export default DashBoard;