import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import { Check } from 'lucide-react';

const OrderConfirmationModal = () => {
    const navigate = useNavigate();

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="icon-circle">
                    <Check size={40} color="white" />
                </div>
                <h4 className="modal-title">Thank you for ordering!</h4>
                <p className="modal-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <div className="button-group">
                    <button className="btn btn-primary" onClick={()=>navigate("/")}>Continue shopping</button>
                    <button className="btn btn-link">View details</button>
                </div>
            </div>
        </div>
    );
};
const styles = `
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal-content {
    background-color: white;
    padding: 2rem;
    border-radius: 0.5rem;
    text-align: center;
    max-width: 400px;
    width: 90%;
  }

  .icon-circle {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: #ff6b6b;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
  }

  .modal-title {
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }

  .modal-text {
    color: #6c757d;
    margin-bottom: 1.5rem;
  }

  .button-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    font-size: 1rem;
  }

  .btn-primary {
    background-color: #ff6b6b;
    color: white;
  }

  .btn-primary:hover {
    background-color: #ff5252;
  }

  .btn-link {
    background-color: transparent;
    color: #6c757d;
    text-decoration: none;
  }

  .btn-link:hover {
    text-decoration: underline;
  }
`;

const OrderCheck = () => {
    return (
        <>
            <style>{styles}</style>
            <OrderConfirmationModal />
        </>
    );
};
export default OrderCheck