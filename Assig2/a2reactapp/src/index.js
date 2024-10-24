import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './Pages/App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Pages/LogIn';
import Dash from './Pages/DashBoard';
import SignIn from './Components/SignIn';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    
        <BrowserRouter>
            
            <Routes>
            <Route path="Login" element={<Login />} >
                <Route path="Register" element={<Register />} />
                <Route path="SignIn" element={<SignIn />} />
            </Route>

                
                <Route path="/" element={<App />}>
                    <Route path="Dash" element={<Dash />} />
                </Route>
            </Routes>
        </BrowserRouter>
    
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
