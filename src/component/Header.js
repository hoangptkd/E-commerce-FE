import React, {useState} from 'react';
import {Link,useNavigate} from "react-router-dom";
import User from "./security/User";

export default function Header() {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const handleSearch = () => {
        navigate("/product",{state: searchTerm})
    };
    return (
        <div className="container-fluid fixed-top">
            <div className="container topbar bg-primary d-none d-lg-block">
                <div className="d-flex justify-content-between">
                    <div className="top-info ps-2">
                        <small className="me-3"><i className="fas fa-map-marker-alt me-2 text-secondary"></i> <a
                            href="#" className="text-white">123 Street, New York</a></small>
                        <small className="me-3"><i className="fas fa-envelope me-2 text-secondary"></i><a href="#"
                                                                                                          className="text-white">Email@Example.com</a></small>
                    </div>
                    <div className="top-link pe-2">
                        <a href="#" className="text-white"><small className="text-white mx-2">Privacy
                            Policy</small>/</a>
                        <a href="#" className="text-white"><small className="text-white mx-2">Terms of Use</small>/</a>
                        <a href="#" className="text-white"><small className="text-white ms-2">Sales and Refunds</small></a>
                    </div>
                </div>
            </div>
            <div className="container px-0">
                <nav className="navbar navbar-light bg-white navbar-expand-xl">
                    <Link to="/" className="navbar-brand">
                        <h1 className="text-primary display-6">Shepoo</h1>
                    </Link>
                    <button className="navbar-toggler py-2 px-3" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarCollapse">
                        <span className="fa fa-bars text-primary"></span>
                    </button>
                    <div className="collapse navbar-collapse bg-white" id="navbarCollapse">
                        <div className="navbar-nav mx-auto">
                            <div className="timkiem_div">
                                <input className="input_timkiem"
                                    type="text"
                                    placeholder="Tìm kiếm..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}

                                />
                                <button className="timkiem_button" onClick={handleSearch}>
                                    Tìm
                                </button>
                            </div>
                        </div>
                        <div className="d-flex m-3 me-0">
                            <Link to="/cart" className="position-relative me-4 my-auto">
                                <i className="fa fa-shopping-bag fa-2x"></i>
                                <span
                                    className="position-absolute bg-secondary rounded-circle d-flex align-items-center justify-content-center text-dark px-1"
                                    style={{top: '-5px', left: '15px', height: '20px', minWidth: '20px'}}>3</span>
                            </Link>
                            <a className="my-auto">
                                <User></User>
                            </a>

                        </div>
                    </div>
                </nav>
            </div>
        </div>
    )
}