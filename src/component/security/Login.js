import React, { useState,useEffect } from 'react';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
import styled from 'styled-components';
import {AuthProvider, getJWT, useMyContext} from "./AuthProvider";

const StyledDiv = styled.div`
    @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap');
    *
    {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Quicksand', sans-serif;
    }
    body
    {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: #000;
    }
    section
    {
        position: absolute;
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 2px;
        flex-wrap: wrap;
        overflow: hidden;
    }
    section::before
    {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        background: linear-gradient(#000,#0f0,#000);
        animation: animate 5s linear infinite;
    }
    @keyframes animate
    {
        0%
        {
            transform: translateY(-100%);
        }
        100%
        {
            transform: translateY(100%);
        }
    }
    section span
    {
        position: relative;
        display: block;
        width: calc(6.25vw - 2px);
        height: calc(6.25vw - 2px);
        background: #181818;
        z-index: 2;
        transition: 1.5s;
    }
    section span:hover
    {
        background: #0f0;
        transition: 0s;
    }

    section .signin
    {
        position: absolute;
        width: 400px;
        background: #222;
        z-index: 1000;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 40px;
        border-radius: 4px;
        box-shadow: 0 15px 35px rgba(0,0,0,9);
    }
    section .signin .content
    {
        position: relative;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 40px;
    }
    section .signin .content h2
    {
        font-size: 2em;
        color: #0f0;
        text-transform: uppercase;
    }
    section .signin .content .form
    {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 25px;
    }
    section .signin .content .form .inputBox
    {
        position: relative;
        width: 100%;
    }
    section .signin .content .form .inputBox input
    {
        position: relative;
        width: 100%;
        background: #333;
        border: none;
        outline: none;
        padding: 25px 10px 7.5px;
        border-radius: 4px;
        color: #fff;
        font-weight: 500;
        font-size: 1em;
    }
    section .signin .content .form .inputBox i
    {
        position: absolute;
        left: 0;
        padding: 15px 10px;
        font-style: normal;
        color: #aaa;
        transition: 0.5s;
        pointer-events: none;
    }
    .signin .content .form .inputBox input:focus ~ i,
    .signin .content .form .inputBox input:valid ~ i
    {
        transform: translateY(-7.5px);
        font-size: 0.8em;
        color: #fff;
    }
    .signin .content .form .links
    {
        position: relative;
        width: 100%;
        display: flex;
        justify-content: space-between;
    }
    .signin .content .form .links a
    {
        color: #fff;
        text-decoration: none;
    }
    .signin .content .form .links a:nth-child(2)
    {
        color: #0f0;
        font-weight: 600;
    }
    .signin .content .form .inputBox input[type="submit"]
    {
        padding: 10px;
        background: #0f0;
        color: #000;
        font-weight: 600;
        font-size: 1.35em;
        letter-spacing: 0.05em;
        cursor: pointer;
    }
    input[type="submit"]:active
    {
        opacity: 0.6;
    }
    @media (max-width: 900px)
    {
        section span
        {
            width: calc(10vw - 2px);
            height: calc(10vw - 2px);
        }
    }
    @media (max-width: 600px)
    {
        section span
        {
            width: calc(20vw - 2px);
            height: calc(20vw - 2px);
        }
    }
`;
const Login = () => {
    const {setIsAuthenticated, setUser } = useMyContext();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [checkRemember,setCheckRemember] = useState(false)
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const checkToken = async () => {
        const token = getJWT("token");
        const response = await fetch('http://localhost:9090/api/user/check', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + token
            },
        });
        if (response.ok) {
            const userData = await response.text()
            if (userData !== "") {
                navigate("/")
            }
        } else {
            console.error('Lỗi khi lấy thông tin người dùng:', response.status);
        }
    }
    useEffect(() => {
        checkToken()
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('http://localhost:9090/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, password}),
            });
            if (!response.ok) {
                throw new Error('Login failed');
            }
            const token = await response.text();
            if (token.includes("Login failed")) {
                throw new Error('Login failed');
            } else {
                setIsAuthenticated(true);

                if (checkRemember) {
                    localStorage.setItem("token", token);
                }
                document.cookie = `token=${token}; path=/;`;
                navigate("/")

            }
        } catch (err) {
            setError('Invalid username or password');
            console.error('Login error:', err);
        }

    };
    return (
        <StyledDiv>
            <section><span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
                <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
                <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
                <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
                <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
                <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
                <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
                <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
                <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
                <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
                <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
                <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
                <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
                <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
                <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
                <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
                <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
                <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
                <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
                <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
                <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
                <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
                <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
                <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
                <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
                <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
                <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
                <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
                <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
                <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
                <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
                <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
                <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
                <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
                <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
                <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
                <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
                <span></span>

                <div className="signin">

                    <div className="content">

                        <h2>Sign In</h2>
                        <p>{error}</p>
                        <form className="form" onSubmit={handleSubmit}>

                            <div className="inputBox">

                                <input type="text" required onChange={(e) => setUsername(e.target.value)}/>
                                <i>Username</i>

                            </div>

                            <div className="inputBox">

                                <input type="password" required onChange={(e) => setPassword(e.target.value)}/>
                                <i>Password</i>

                            </div>
                            <div>
                                <input style={{marginRight:10}} type="checkbox" id = "remember"  onChange={()=>setCheckRemember((checkRemember)=> (!checkRemember))}/>
                                <label for="remember">Remember me</label>
                            </div>
                            <div className="links">
                                <a href="#">Forgot Password</a>
                                <Link to="/register">Sign up</Link>

                            </div>

                            <div className="inputBox">

                                <input type="submit" value="Login"/>
                            </div>

                        </form>

                    </div>

                </div>

            </section>
        </StyledDiv>
    );
};

export default Login;
