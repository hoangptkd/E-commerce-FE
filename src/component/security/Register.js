import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import styled from 'styled-components';
import API_URL from "../../config";
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

    section .signup
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
    section .signup .content
    {
        position: relative;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 40px;
    }
    section .signup .content h2
    {
        font-size: 2em;
        color: #0f0;
        text-transform: uppercase;
    }
    section .signup .content .form
    {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 25px;
    }
    section .signup .content .form .inputBox
    {
        position: relative;
        width: 100%;
    }
    section .signup .content .form .inputBox input
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
    section .signup .content .form .inputBox i
    {
        position: absolute;
        left: 0;
        padding: 15px 10px;
        font-style: normal;
        color: #aaa;
        transition: 0.5s;
        pointer-events: none;
    }
    .signup .content .form .inputBox input:focus ~ i,
    .signup .content .form .inputBox input:valid ~ i
    {
        transform: translateY(-7.5px);
        font-size: 0.8em;
        color: #fff;
    }
    .signup .content .form .links
    {
        position: relative;
        width: 100%;
        display: flex;
        justify-content: space-between;
    }
    .signup .content .form .links a
    {
        color: #fff;
        text-decoration: none;
    }
    .signup .content .form .links a:nth-child(2)
    {
        color: #0f0;
        font-weight: 600;
    }
    .signup .content .form .inputBox input[type="submit"]
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
const Register = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [gmail, setGmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch(`${API_URL}/api/user/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name,gmail,username, password}),
            });
            if (!response.ok) {
                throw new Error('Signup failed');
            }

            const result = await response.text();
            switch (result) {
                case "Success":
                    navigate("/login")
                    break
                case "ErrorUsername":
                    throw new Error("Username đã được đăng ký");
                case "ErrorGmail":
                    throw new Error("Gmail đã được đăng ký");
                case "ErrorValidateGmail":
                    throw new Error("Sai định dạng gmail");
            }

        } catch (err) {

            setError(err.message);
            console.error('Login error:', err);
        }

    };
    return (
        <StyledDiv>
            <section>
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
                <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
                <span></span>

                <div className="signup">

                    <div className="content">

                        <h2>Sign Up</h2>
                        <p>{error}</p>
                        <form className="form" onSubmit={handleSubmit}>
                            <div className="inputBox">

                                <input type="text" required onChange={(e) => setName(e.target.value)}/>
                                <i>Name</i>

                            </div>
                            <div className="inputBox">

                                <input type="text" required onChange={(e) => setGmail(e.target.value)}/>
                                <i>Gmail</i>

                            </div>
                            <div className="inputBox">

                                <input type="text" required onChange={(e) => setUsername(e.target.value)}/>
                                <i>Username</i>

                            </div>

                            <div className="inputBox">

                                <input type="password" required onChange={(e) => setPassword(e.target.value)}/>
                                <i>Password</i>

                            </div>

                            <div className="links">
                                <a href="#">Forgot Password</a>
                                <Link to="/login">Log in</Link>

                            </div>

                            <div className="inputBox">

                                <input type="submit" value="Sign up"/>
                            </div>

                        </form>

                    </div>

                </div>

            </section>
        </StyledDiv>
    );
};

export default Register;
