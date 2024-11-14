import React, { useEffect, useState } from 'react';
import "./ProductCart.css";
import ProductCard from "./ProductCard";
import {useMyContext} from "./security/AuthProvider";
const Home = () => {
    const { isAuthenticated, setIsAuthenticated,user } = useMyContext();
    const [products, setProducts] = useState([]);
    const [specialCategory,setSpecialCategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [newProducts, setNewProducts] = useState([]);

    useEffect(()=> {
        const fetchTopCategories = async () => {
            try {
                const response = await fetch('http://localhost:9090/api/products/getTopCategories', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',

                    },
                });

                if (!response.ok) {
                    throw new Error('Không Thể Lấy Dữ Liệu Product');
                }
                const data = await response.json();
                setSpecialCategory(data);
            } catch (error) {
                console.error('Lỗi:', error);
            }
        };
        fetchTopCategories()
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:9090/api/products/listSpecial', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',

                    },
                });

                if (!response.ok) {
                    throw new Error('Không Thể Lấy Dữ Liệu Product');
                }
                const data = await response.json();
                setProducts(data.content);
            } catch (error) {
                console.error('Lỗi:', error);
            }
        };
        const fetchNewProducts = async () => {
            try {
                const response = await fetch('http://localhost:9090/api/products/listNew', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',

                    },
                });

                if (!response.ok) {
                    throw new Error('Không Thể Lấy Dữ Liệu Product');
                }
                const data = await response.json();
                setNewProducts(data.content);
            } catch (error) {
                console.error('Lỗi:', error);
            }
        };
        fetchProducts()
        fetchNewProducts();
    }, []);
    return (
        <div>
            <div className="container-fluid py-5 mb-5 hero-header">
                <div className="container py-5">
                    <div className="row g-5 align-items-center">
                        <div className="col-md-12 col-lg-7">
                            <h4 className="mb-3 text-secondary">100% Organic Foods</h4>
                            <h1 className="mb-5 display-3 text-primary">Organic Veggies & Fruits Foods</h1>
                            <div className="position-relative mx-auto">
                                <input className="form-control border-2 border-secondary w-75 py-3 px-4 rounded-pill"
                                       type="number" placeholder="Search"/>
                                <button type="submit"
                                        className="btn btn-primary border-2 border-secondary py-3 px-4 position-absolute rounded-pill text-white h-100"
                                        style={{top: '0', right: '25%'}}>Submit Now
                                </button>
                            </div>
                        </div>
                        <div className="col-md-12 col-lg-5">
                            <div id="carouselId" className="carousel slide position-relative" data-bs-ride="carousel">
                                <div className="carousel-inner" role="listbox">
                                    <div className="carousel-item active rounded">
                                        <img src="img/hero-img-1.png"
                                             className="img-fluid w-100 h-100 bg-secondary rounded" alt="First slide"/>
                                        <a href="#" className="btn px-4 py-2 text-white rounded">Fruites</a>
                                    </div>
                                    <div className="carousel-item rounded">
                                        <img src="img/hero-img-2.jpg" className="img-fluid w-100 h-100 rounded"
                                             alt="Second slide"/>
                                        <a href="#" className="btn px-4 py-2 text-white rounded">Vesitables</a>
                                    </div>
                                </div>
                                <button className="carousel-control-prev" type="button" data-bs-target="#carouselId"
                                        data-bs-slide="prev">
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Previous</span>
                                </button>
                                <button className="carousel-control-next" type="button" data-bs-target="#carouselId"
                                        data-bs-slide="next">
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Next</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid fruite py-5">
                <div className="container py-5">
                    <div className="tab-class text-center">
                        <div className="row g-4">
                            <div className="col-lg-4 text-start">
                                <h1>Sản Phẩm Nổi Bật</h1>
                            </div>
                            <div className="col-lg-8 text-end">
                                <ul className="nav nav-pills d-inline-flex text-center mb-5">
                                    <li className="nav-item">
                                        <a className="d-flex m-2 py-2 bg-light rounded-pill active"
                                           data-bs-toggle="pill"
                                           href="#tab-1">
                                            <span className="text-dark" style={{width: '130px'}}>All Products</span>
                                        </a>
                                    </li>
                                    {
                                        specialCategory.map(category => (
                                            <li className="nav-item">
                                                <a className="d-flex py-2 m-2 bg-light rounded-pill"
                                                   data-bs-toggle="pill"
                                                   href="#tab-2" onClick={() => setSelectedCategory(category)}>
                                                    <span className="text-dark"
                                                          style={{width: '130px'}}>{category.name}</span>
                                                </a>
                                            </li>
                                        ))
                                    }

                                </ul>
                            </div>
                        </div>
                        <div className="tab-content">
                            <div id="tab-1" className="tab-pane fade show p-0 active">
                                <div className="row g-4">
                                    <div className="col-lg-12">
                                        <div className="row g-4">
                                            {products.map(product => (
                                                <ProductCard product={product}></ProductCard>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="tab-2" className="tab-pane fade show p-0">
                                <div className="row g-4">
                                    <div className="col-lg-12">
                                        <div className="row g-4">
                                            {selectedCategory !== null ?
                                                selectedCategory.products.map(product => (
                                                    <ProductCard product={product}></ProductCard>
                                                )) : ""
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="container py-5">
                    <div className="tab-class text-center">
                        <div className="row g-4">
                            <div className="col-lg-4 text-start">
                                <h1>Sản Phẩm Mới</h1>
                            </div>
                            <div className="col-lg-8 text-end">
                            </div>
                        </div>
                        <div className="tab-content">
                            <div id="tab-1" className="tab-pane fade show p-0 active">
                                <div className="row g-4">
                                    <div className="col-lg-12">
                                        <div className="row g-4">
                                            {newProducts.map(product => (
                                                <ProductCard product={product}></ProductCard>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
};

export default Home;