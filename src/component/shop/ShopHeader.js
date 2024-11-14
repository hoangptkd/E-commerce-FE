import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
export default function Header() {
    const navigate = useNavigate()
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <a className="navbar-brand" onClick={()=>navigate("/shop")}>Shop Management</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation" >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" onClick={()=>navigate("/shop")}>Dashboard</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" onClick={()=>navigate("/shop/productManager")}>Products</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" onClick={() => navigate("/shop/orderManager")}>Orders</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}