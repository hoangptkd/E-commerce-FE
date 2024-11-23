import React, {useEffect, useState} from 'react';
import CartItem from "./CartItem";
import {useNavigate} from "react-router-dom";
import {getJWT, useMyContext} from "../security/AuthProvider";
import API_URL from "../../config";
const Cart = () => {
    const navigate = useNavigate();
    const { isAuthenticated, setIsAuthenticated, loading } = useMyContext();
    const [Carts, setCarts] = useState([]);
    const [total, setTotal] = useState(0);
    const [chooseList, setChooseList] = useState([]);
    const [render, setRender] = useState(false);
    const fetchCarts = async () => {
        const token = getJWT("token")
        try {
            const response = await fetch(`${API_URL}/api/cart/allByUser`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // Thêm header Authorization nếu cần
                    'Authorization': 'Bearer ' + token
                },
            });

            if (!response.ok) {
                throw new Error('Không Thể Lấy Dữ Liệu Giỏ Hàng');
            }
            const data = await response.json();
            data.reverse()
            setCarts(data);
        } catch (error) {
            console.error('Lỗi:', error);
        }
    };
    useEffect(()=> {
        if (!loading) {
            if (isAuthenticated === false) {
                navigate("/login")
                return
            }
            fetchCarts();
        }
        setRender(false)
    }, [render,isAuthenticated,loading]);
    useEffect(()=>{
        const totalPrice = chooseList.reduce((sum, item) => {
            return sum + item.price * item.quantity;
        }, 0);
        setTotal(totalPrice)
    },[chooseList])
    const calTotal = (data) => {
        if (data.check === true) {
            setChooseList(prevChooseList=> [...prevChooseList,data])
        } else {
            setChooseList(prevChooseList=> prevChooseList.filter(item => item.id !== data.id))
        }

    }
    const calRender = () => {
        setRender(true)
    }
    const handleProceedCheckout = () => {
        fetchCarts()
        const newFilteredCarts = Carts.map(cart => ({
            shopId: cart.shopId,
            shopName:cart.shopName,
            list: cart.items.filter(item => {
                for (let i = 0; i < chooseList.length; i++) {
                    if (chooseList[i].id === item.id) {
                        return true;
                    }
                }
            })
        })).filter(cart => cart.list.length > 0);
        if (newFilteredCarts.length > 0) {
            navigate('/checkout', { state: {newFilteredCarts:newFilteredCarts,total:total }});
        } else {
            // Xử lý trường hợp không có mặt hàng nào được chọn
            alert("Please select at least one item before proceeding to checkout.");
        }
    }



    return (
        <div>
            <div className="container-fluid py-5">
                <div className="container py-5 mt-3">
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                            <tr>
                                <th scope="col">Products</th>
                                <th scope="col">Name</th>
                                <th scope="col">Price</th>
                                <th scope="col">Quantity</th>
                                <th scope="col">Total</th>
                                <th scope="col">Handle</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                Carts.map(cart=> {

                                    return <>
                                        <tr>
                                            <th>{cart.shopName}</th>
                                        </tr>
                                        {cart.items.map(item => (
                                             <CartItem cartItem={item} onSetTotal={calTotal} onSetRender={calRender}/>
                                        ))}
                                    </>
                                })
                            }
                            </tbody>
                        </table>
                    </div>

                    <div className="row g-4 justify-content-end">
                        <div className="col-8"></div>
                        <div className="col-sm-8 col-md-7 col-lg-6 col-xl-4">
                            <div className="bg-light rounded">
                                <div className="p-4">
                                    <h1 className="display-6 mb-4">Cart <span className="fw-normal">Total</span></h1>
                                    <div className="d-flex justify-content-between mb-4">
                                        <h5 className="mb-0 me-4">Subtotal:</h5>
                                        <p className="mb-0">${total}</p>
                                    </div>
                                </div>
                                <div className="py-4 mb-4 border-top border-bottom d-flex justify-content-between">
                                    <h5 className="mb-0 ps-4 me-4">Total</h5>
                                    <p className="mb-0 pe-4">${total}</p>
                                </div>
                                <button
                                    className="btn border-secondary rounded-pill px-4 py-3 text-primary text-uppercase mb-4 ms-4"
                                    type="button" onClick={handleProceedCheckout}>
                                    Proceed Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



        </div>
    )
}
export default Cart;