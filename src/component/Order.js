import React, {useEffect, useState} from 'react';
import {getJWT, useMyContext} from "./security/AuthProvider";
import {useNavigate} from "react-router-dom";
import API_URL from "../config";

const OrderHistory = () => {
    // Mock data - trong thực tế sẽ lấy từ API
    const [orders, setOrders] = useState([]);
    const { isAuthenticated ,user,loading} = useMyContext();
    const navigate = useNavigate();
    useEffect(()=> {
        const getOrderFromApi = async ()=> {
            const token = getJWT("token")
            const response = await fetch(`${API_URL}/api/order/allOrderFromUser`, {
                method: "GET",
                headers: {
                    'Content-type' : 'application/json',
                    'Authorization' : 'Bearer ' + token

                }

            })
            if (!response.ok) {
                throw new Error("Khong the get order")
            }
            const data = await response.json()
            data.reverse()
            setOrders(data)
        }
        if (!loading) {
            if (isAuthenticated === false) {
                navigate("/login")
                return;
            }
            getOrderFromApi()
        }


    },[isAuthenticated ,user,loading])
    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Delivered':
                return 'bg-success';
            case 'Processing':
                return 'bg-warning';
            case 'Cancelled':
                return 'bg-danger';
            default:
                return 'bg-info';
        }
    };

    return (
        <div className="container py-5 mt-5">
            <h2 className="mb-4">My Orders</h2>

            {orders.map((order) => (
                <div key={order.id} className="card mb-4 shadow-sm">
                    <div className="card-header bg-light d-flex justify-content-between align-items-center">
                        <div>
                            <h5 className="mb-0">Order #{order.id}</h5>
                            <small className="text-muted">Placed on {new Date(order.orderDate).toLocaleDateString()}</small>
                        </div>
                        <span className={`badge ${getStatusBadgeClass(order.status)} text-white`}>
              {order.status}
            </span>
                    </div>

                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-8">
                                {order.orderItems.map((item, index) => (
                                    <div key={index} className="d-flex align-items-center mb-3 pb-3 border-bottom">
                                        <img
                                            src={`img/${item.productVersion.product.imagePath}`}
                                            alt={item.productVersion.product.name}
                                            className="rounded me-3"
                                            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                        />
                                        <div className="flex-grow-1">
                                            <h6 className="mb-0">{item.productVersion.product.name}</h6>
                                            <div className="text-muted">
                                                Quantity: {item.quantity} × ${item.price.toFixed(2)}
                                            </div>
                                        </div>
                                        <div className="text-end">
                                            <strong>${(item.quantity * item.price).toFixed(2)}</strong>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="col-md-4">
                                <div className="bg-light p-3 rounded">
                                    <h6 className="mb-3">Order Summary</h6>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Total:</span>
                                        <strong>${order.total.toFixed(2)}</strong>
                                    </div>
                                    <hr />
                                    <div className="mb-2">
                                        <small className="text-muted d-block">Shipping Address:</small>
                                        <div>{order.shippingAddress}</div>
                                    </div>
                                    <div>
                                        <small className="text-muted d-block">Payment Method:</small>
                                        <div>{order.paymentMethod}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card-footer bg-white">
                        <div className="d-flex justify-content-between align-items-center">
                            <button className="btn btn-outline-secondary btn-sm">
                                View Details
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OrderHistory;