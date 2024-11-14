import React, {useEffect, useState} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import {useCheckShop} from "./CheckShop";
import {getJWT} from "../security/AuthProvider";


const ShopDashBoard = () => {
    useCheckShop()
    const navigate = useNavigate()
    const [products, setProducts] = useState([]);
    const [quantityData, setQuantityData] = useState(null);
    const token = getJWT("token");
    const getProducts = async()=> {
        try {

            const response = await fetch(`http://localhost:9090/api/products/listByShop`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        // Thêm header Authorization nếu cần
                        'Authorization': 'Bearer ' + token
                    },
                });

            if (!response.ok) {
                throw new Error('Không Thể Lấy Dữ Liệu Product');
            }
            const data = await response.json();
            setProducts(data)
        } catch (error) {
            console.error('Lỗi:', error);
        }
    }
    const getQuantityData = async()=> {
        try {
            const response = await fetch(`http://localhost:9090/api/order/getQuantityData`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        // Thêm header Authorization nếu cần
                        'Authorization': 'Bearer ' + token
                    },
                });

            if (!response.ok) {
                throw new Error('Không Thể Lấy Dữ Liệu Số Lượng Order');
            }
            const data = await response.json();
            setQuantityData(data)
        } catch (error) {
            console.error('Lỗi:', error);
        }
    }

    useEffect(()=> {

        getProducts();
        getQuantityData();
    },[])

    const ProductDelete = async (id)=> {
        try {

            const response = await fetch(`http://localhost:9090/api/products/delete/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        // Thêm header Authorization nếu cần
                        'Authorization': 'Bearer ' + token
                    },
                });

            if (!response.ok) {
                throw new Error('Không Thể Xóa Sản Phẩm');
            }
            await getProducts()
        } catch (error) {
            console.error('Lỗi:', error);
        }
    }

    return (
        <div>

            <div className="container mt-4">
                <h1 className="mb-4">Dashboard</h1>

                <div className="row mb-4">
                    <div className="col-md-3 mb-3">
                        <div className="card dashboard-card bg-primary text-white">
                            <div className="card-body">
                                <h5 className="card-title">Chờ Xác Nhận</h5>
                                <p className="card-text display-4">{quantityData ? (quantityData.pending ? quantityData.pending : 0) : 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 mb-3">
                        <div className="card dashboard-card bg-success text-white">
                            <div className="card-body">
                                <h5 className="card-title">Đã Xác Nhận</h5>
                                <p className="card-text display-4">{quantityData ? (quantityData.confirmed ? quantityData.confirmed : 0) : 0}</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3 mb-3">
                        <div className="card dashboard-card bg-danger text-white">
                            <div className="card-body">
                                <h5 className="card-title">Đơn Hủy</h5>
                                <p className="card-text display-4">{quantityData ? (quantityData.cancelled ? quantityData.cancelled : 0) : 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 mb-3">
                        <div className="card dashboard-card bg-warning">
                            <div className="card-body">
                                <h5 className="card-title">Đã Giao </h5>
                                <p className="card-text display-4">{quantityData ?  (quantityData.received ? quantityData.received : 0) : 0}</p>
                            </div>
                        </div>
                    </div>

                </div>


                <h2 className="mb-3">Product Management</h2>
                <button className="btn btn-primary mb-3" onClick={() => navigate("/shop/productManager")}>
                    <i className="fas fa-plus"></i> Add New Product
                </button>

                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        products.map(product => {
                            return (
                                <tr>
                                    <td>{product.id}</td>
                                    <td>{product.name}</td>
                                    <td>{product.price}</td>
                                    <td>{product.allStock}</td>
                                    <td>
                                        <button className="btn btn-sm btn-info" onClick={()=>navigate("/shop/productManager",{state:product})}><i className="fas fa-edit"></i></button>
                                        <button className="btn btn-sm btn-danger" onClick={()=> ProductDelete(product.id)}><i className="fas fa-trash"></i></button>
                                    </td>
                                </tr>)
                        })
                    }

                    </tbody>
                </table>
            </div>



        </div>
    )
}
export default ShopDashBoard