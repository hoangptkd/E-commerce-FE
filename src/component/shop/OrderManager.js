import React, {useEffect, useState} from "react";
import {ConvertTimeStamp,ConvertAddress} from "../convert/Convert";
import { Modal, Button } from 'react-bootstrap';
import {getJWT} from "../security/AuthProvider";
const OrderManager = () => {
    const [orders, setOrders] = useState([]);
    const [show, setShow] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [deliveryStatus, setDeliveryStatus] = useState("")
    const [page, setPage] = useState(0);
    const [pageNumber , setPageNumber] = useState(1);
    const token = getJWT("token")
    const getOrderFromApi = async ()=> {
        const params = new URLSearchParams({
            page:page,
        });

        const response = await fetch(`http://localhost:9090/api/order/allOrderByShop?${params}`, {
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
        setOrders(data.content)
        setPageNumber(data.totalPages)
    }
    const handleShow = (order) => {
        setSelectedOrder(order);
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
        setSelectedOrder(null);
    };
    const handleCloseEdit = () => {
        setShowEdit(false);
        setSelectedOrder(null);
    };
    const handleShowEdit = (order) => {
        setDeliveryStatus(order.status)
        setSelectedOrder(order)
        setShowEdit(true);
    };

    const handleStatusChange = (e) => {
        setDeliveryStatus(e.target.value);
    }
    const changeStatus = async ()=> {
        const params = new URLSearchParams({
            orderId: selectedOrder.id
        }).toString();
        const response = await fetch(`http://localhost:9090/api/order/editOrder/${deliveryStatus}?${params}`, {
            method: "PUT",
            headers: {
                'Content-type' : 'application/json',
                'Authorization' : 'Bearer ' + token
            },
        })
        if (!response.ok) {
            handleCloseEdit()
            throw new Error("Không thể sửa trạng thái vận chuyển")

        }
        handleCloseEdit()
        getOrderFromApi()
    }

    useEffect(()=>{
        getOrderFromApi()
    },[])


    return (
        <div>

            <div className="container mt-4">
                <h1 className="mb-4">Order Management</h1>

                <div className="row mb-3">
                    <div className="col-md-6">
                        <input type="text" className="form-control" placeholder="Search orders..."/>
                    </div>
                    <div className="col-md-3">
                        <select className="form-select">
                            <option selected>Filter by status</option>
                            <option value="pending">Chờ Xác Nhận</option>
                            <option value="confirmed">Đã Xác Nhận</option>
                            <option value="received">Đã Nhận Hàng</option>
                            <option value="cancelled">Đơn Hủy</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <button className="btn btn-primary w-100">Apply Filters</button>
                    </div>
                </div>

                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>

                        {
                            orders.map(order => (
                                <tr>
                                    <td>{order.id}</td>
                                    <td>{order.user.name}</td>
                                    <td><ConvertTimeStamp timestamp={order.orderDate}/></td>
                                    <td>${order.total}</td>
                                    <td><span className="badge bg-warning status-badge">{order.status}</span></td>
                                    <td>
                                        <button className="btn btn-sm btn-info"  onClick={()=>handleShow(order)}><i className="fas fa-eye"></i>
                                        </button>
                                        <button className="btn btn-sm btn-success" onClick={()=>handleShowEdit(order)}><i className="fas fa-edit"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }


                    </tbody>
                </table>

                <nav aria-label="Order pagination">
                    <ul className="pagination justify-content-center">
                        <li className="page-item disabled">
                            <a className="page-link" aria-disabled="true" onClick={()=>setPage((index)=> (index -1))}>Previous</a>
                        </li>
                        {
                            Array.from({length: pageNumber}, (_, index) => (
                                index === page ?
                                    <a key={index} className="active rounded">{index + 1}</a> :
                                    <a key={index} className="rounded" onClick={()=>setPage(index)}>{index + 1}</a>
                            ))
                        }
                        <li className="page-item">
                            <a className="page-link" onClick={()=>setPage((index)=> (index +1))}>Next</a>
                        </li>
                    </ul>
                </nav>
            </div>

            <Modal show={show} onHide={handleClose}>

                <Modal.Header closeButton>
                    <Modal.Title>
                        Chi tiết đơn hàng
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                        <div className="modal-content">
                            <div className="modal-body">
                                <p><strong>Name:</strong> {selectedOrder !== null ?selectedOrder.user.name : ""}<br/>
                                    <strong>Email:</strong> {selectedOrder !== null ?selectedOrder.user.gmail : ""}<br/>
                                    <strong>Phone:</strong> {selectedOrder !== null ?selectedOrder.user.phone : ""}</p>

                                <h6>Shipping Address</h6>
                                <p>{selectedOrder !== null ?selectedOrder.shippingAddress : ""}</p>

                                <h6>Order Items</h6>
                                <table className="table table-sm">
                                    <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Product Version</th>
                                        <th>Quantity</th>

                                        <th>Subtotal</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {selectedOrder !== null ? selectedOrder.orderItems.map(orderItem=> (
                                        <tr>
                                            <td>{orderItem.productVersion.product.name}</td>
                                            <td>{orderItem.productVersion.versionName}</td>
                                            <td>{orderItem.quantity}</td>
                                            <td>${orderItem.price}</td>
                                        </tr>
                                    )) : ""}

                                    </tbody>
                                    <tfoot>
                                    <tr>
                                        <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                                        <td><strong>${selectedOrder !== null ? selectedOrder.total: 0}</strong></td>
                                    </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                                Đóng
                            </Button>
                        </Modal.Footer>

            </Modal>

            <Modal show={showEdit} onHide={handleCloseEdit}>

                <Modal.Header closeButton>
                    <Modal.Title>
                        Update Order Status
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="modal-content">
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="orderStatus" className="form-label">Order Status</label>
                                    <select className="form-select" id="orderStatus" value={deliveryStatus} onChange={handleStatusChange}>
                                        <option value="pending">Chờ Xác Nhận</option>
                                        <option value="confirmed">Đã Xác Nhận</option>
                                        <option value="received">Đã Nhận Hãng</option>
                                        <option value="cancelled">Đơn Hủy</option>
                                    </select>
                                </div>
                            </form>
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEdit}>
                        Close
                    </Button>
                    <Button variant="secondary" onClick={changeStatus}>
                        Update Status
                    </Button>
                </Modal.Footer>

            </Modal>


        </div>
    )
}
export default OrderManager
