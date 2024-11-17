import React, {useEffect, useState} from 'react';
import CartItem from "../cart/CartItem";
import Checkout from "../Checkout";
import {useNavigate} from "react-router-dom";
import styled from 'styled-components';
import {getJWT, useMyContext} from "./AuthProvider";
import axios from "axios";


const User = () => {
    const { isAuthenticated, setIsAuthenticated,user } = useMyContext();
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const logout = ()=> {
        const token = getJWT("token")
        axios.post('http://localhost:9090/api/user/logout', {},{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        localStorage.removeItem("token");
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
        navigate("/login");
        setIsAuthenticated(false)
        toggleDropdown()
    };
    return (
            <div className="action" >
                <div className="profile" onClick={toggleDropdown}>
                    <i className="fas fa-user fa-2x"></i>
                </div>
                {isOpen && (
                    <div className="menu"
                         style={{
                             position: 'absolute',
                             top: isOpen ? '80px' : '120px',
                             right: '-10px',
                             padding: '10px 20px',
                             background: '#fff',
                             width: '200px',
                             boxShadow: '0 5px 25px rgba(0, 0, 0, 0.1)',
                             borderRadius: '15px',
                             transition: '0.5s',
                             visibility: isOpen ? 'visible' : 'hidden',
                             opacity: isOpen ? 1 : 0,
                         }}>
                        <ul>
                            {
                                isAuthenticated ?
                                    (<div>

                                        <h5>{user.username}</h5>
                                        <li style={{
                                            listStyle: 'none',
                                            padding: '16px 0',
                                            borderTop: '1px solid rgba(0, 0, 0, 0.05)',
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}>
                                            <img src="img/assets/icons/user.png"
                                                 style={{
                                                     maxWidth: '20px',
                                                     marginRight: '10px',
                                                     opacity: '0.5',
                                                     transition: '0.5s',

                                                 }}/><a onClick={()=> {
                                                     navigate("/profile")
                                                    toggleDropdown()
                                                 }}>My profile</a>
                                        </li>
                                        <li style={{
                                            listStyle: 'none',
                                            padding: '16px 0',
                                            borderTop: '1px solid rgba(0, 0, 0, 0.05)',
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}>
                                            <img src="img/assets/icons/order.png"
                                                 style={{
                                                     maxWidth: '20px',
                                                     marginRight: '10px',
                                                     opacity: '0.5',
                                                     transition: '0.5s',

                                                 }}/><a onClick={() => {
                                            toggleDropdown()
                                            navigate("/order")
                                        }}>Order detail</a>
                                        </li>
                                        <li style={{
                                            listStyle: 'none',
                                            padding: '16px 0',
                                            borderTop: '1px solid rgba(0, 0, 0, 0.05)',
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}>
                                            <img src="img/assets/icons/log-out.png"
                                                 style={{
                                                     maxWidth: '20px',
                                                     marginRight: '10px',
                                                     opacity: '0.5',
                                                     transition: '0.5s',

                                                 }}/><a onClick={logout}>Logout</a>
                                        </li>

                                    </div>)
                                    : <li style={{
                                        listStyle: 'none',
                                        padding: '16px 0',
                                        borderTop: '1px solid rgba(0, 0, 0, 0.05)',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        <img src="img/assets/icons/user.png"
                                             style={{
                                                 maxWidth: '20px',
                                                 marginRight: '10px',
                                                 opacity: '0.5',
                                                 transition: '0.5s',

                                             }}/><a onClick={() => {
                                        toggleDropdown()
                                        navigate("/login")
                                    }
                                    }>Login</a>
                                    </li>
                            }
                        </ul>
                    </div>)
                }
            </div>
    )
}
export default User