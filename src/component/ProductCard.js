import React from "react"
import {useState,useEffect} from "react";
import {useNavigate} from "react-router-dom";

export default function ProductCard({product}) {
    const Navigate = useNavigate();

    const toDetail = ()=> {
        Navigate("/productDetail",{state:product});
    }
    return (
        <div key={product.id} className="col-md-6 col-lg-4 col-xl-3">
            <div className="rounded position-relative fruite-item" onClick={toDetail}>
                <div className="fruite-img">
                    <img src= {`img/${product.imagePath}`} alt={product.name}   style={{
                        width: "100%",        // Đặt chiều rộng cố định
                        height: "300px",       // Đặt chiều cao bằng với chiều rộng để tạo hình vuông
                        objectFit: "cover",    // Cắt bớt phần thừa và giữ tỷ lệ ảnh
                    }} className="img-fluid rounded-top"/>
                </div>
                <div className="p-4 border border-secondary border-top-0 rounded-bottom">
                    <h6>{product.name}</h6>
                    <div className="d-flex justify-content-between flex-lg-wrap">
                        <p className="text-dark fs-5 fw-bold mb-0">${product.price}</p>
                        <p>{product.rating}</p>
                    </div>
                </div>
            </div>
        </div>

    )
}