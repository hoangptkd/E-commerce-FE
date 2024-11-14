import React from "react"
import {useState,useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {getJWT, useMyContext} from "./security/AuthProvider";
import { ShoppingCart, X } from 'lucide-react';
const ProductDetail = ()=> {
    const location = useLocation(); // Lấy location object
    const product = location.state;
    const [price,setPrice] = useState(product.price);
    const [quantity, setQuantity] = useState(1);
    const [selectedButton, setSelectedButton] = useState(null);
    const navigate = useNavigate();
    const {isAuthenticated,setIsAuthenticated} = useMyContext();
    const [showPopup, setShowPopup] = useState(false);
    const [relateProducts, setRelateProducts] = useState([])
    useEffect(()=> {
        if (quantity <= 0) {
            setQuantity(1)
        }
    },[quantity])
    useEffect(()=> {
        if (product.versions.length === 1) {
            product.versions.map(
                ( version)=> (setSelectedButton(version.id))
            )
        }
        const fetchNewProducts = async () => {
            try {
                const response = await fetch(`http://localhost:9090/api/products/${product.id}/similar`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',

                    },
                });

                if (!response.ok) {
                    throw new Error('Không Thể Lấy Dữ Liệu Product similar');
                }
                const data = await response.json();
                setRelateProducts(data)
            } catch (error) {
                console.error('Lỗi:', error);
            }
        };
        fetchNewProducts()
    },[])

    const selectVersion = (version)=> {
        setPrice(version.price);
        setSelectedButton(version.id);
    }
    const addCart = async () => {
        try {
            if (!isAuthenticated) {
                 navigate("/login")
                return
            }
            const token = getJWT("token")
            const response = await fetch("http://localhost:9090/api/cart/add", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({productVersion: {id:selectedButton}, quantity: quantity}),
            });
            if (!response.ok) {
                throw new Error("Khong the them");
            }
            handleAddToCart()

        } catch (error) {
            console.error("Error:", error);
        }
    }
    const handleAddToCart = () => {
        setShowPopup(true);
        setTimeout(() => {
            setShowPopup(false);
        }, 3000);
    };
    return (
        <div className="container-fluid py-5 mt-5">
            {showPopup && (
                <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg p-4 w-20 border border-gray-200 animate-fade-in">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <ShoppingCart className="text-green-500" size={20} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800">Thêm vào giỏ hàng thành công!</h4>
                                <p className="text-sm text-gray-500">Sản phẩm đã được thêm vào giỏ hàng của bạn</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowPopup(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn {
                  from {
                    opacity: 0;
                    transform: translateY(-10px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
                
                .animate-fade-in {
                  animation: fadeIn 0.3s ease-out;
                }
              `}</style>
            <div className="container py-5 mt-3">

                <div className="row g-4 mb-5">

                    <div className="col-lg-8 col-xl-9">
                        <div className="row g-4">
                            <div className="col-lg-6">
                                <div className="border rounded">
                                    <a href="#">
                                        <img src = {`img/${product.imagePath}`} alt={product.name} className="img-fluid rounded"/>
                                    </a>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <h4 className="fw-bold mb-3">{product.name}</h4>
                                <p className="mb-3">Category: {product.categoryName}</p>
                                <h5 className="fw-bold mb-3">{price} $</h5>

                                <div className="d-flex mb-4">
                                    <i className="fa fa-star text-secondary"></i>
                                    <i className="fa fa-star text-secondary"></i>
                                    <i className="fa fa-star text-secondary"></i>
                                    <i className="fa fa-star text-secondary"></i>
                                    <i className="fa fa-star text-secondary"></i>
                                    <h6  className="fw-bold mb-3">{product.rating} sao</h6>
                                </div>

                                {
                                    product.versions.length > 1 ? (<div className="grid grid-cols-3 gap-4 pb-4">
                                        {

                                            product.versions.map((version) => {
                                                return (
                                                    <button key={version.id}
                                                            className={`btn btn-outline-primary w-100 ${selectedButton === version.id ? 'active shadow' : ''}`}
                                                            onClick={() => selectVersion(version)}>
                                                        {version.versionName}
                                                    </button>)
                                            })
                                        }
                                    </div>) : <div></div>
                                }

                                <div className="input-group quantity mb-5" style={{width: '100px'}}>
                                    <div className="input-group-btn">
                                        <button className="btn btn-sm btn-minus rounded-circle bg-light border"
                                                onClick={() => {
                                                    setQuantity(quantity => quantity - 1);
                                                }}>
                                            <i className="fa fa-minus"></i>
                                        </button>
                                    </div>
                                    <input type="text" className="form-control form-control-sm text-center border-0"
                                           value={quantity}/>
                                        <div className="input-group-btn">
                                            <button className="btn btn-sm btn-plus rounded-circle bg-light border"
                                                    onClick={() => {
                                                        setQuantity(quantity => quantity + 1);
                                                    }}>
                                                <i className="fa fa-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                       className="btn border border-secondary rounded-pill px-4 py-2 mb-4 text-primary"
                                       onClick={addCart}><i
                                        className="fa fa-shopping-bag me-2 text-primary"
                                        ></i> Add to cart</button>
                                </div>
                                <div className="col-lg-12">
                                    <nav>
                                        <div className="nav nav-tabs mb-3">
                                            <button className="nav-link active border-white border-bottom-0"
                                                    type="button"
                                                    role="tab"
                                                    id="nav-about-tab" data-bs-toggle="tab" data-bs-target="#nav-about"
                                                    aria-controls="nav-about" aria-selected="true">Description
                                            </button>
                                        </div>
                                    </nav>
                                    <div className="tab-content mb-5">
                                        <div className="tab-pane active" id="nav-about" role="tabpanel"
                                             aria-labelledby="nav-about-tab">
                                            <p>{product.description} </p>
                                            <div className="px-2">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-xl-3">
                        <div className="row g-4 fruite">
                            <div className="col-lg-12">
                                {/*<h4 className="mb-4">Featured products</h4>*/}
                                {/*<div className="d-flex align-items-center justify-content-start">*/}
                                {/*    <div className="rounded" style={{width: '100px', height: '100px'}}>*/}
                                {/*        <img src="img/featur-1.jpg" className="img-fluid rounded" alt="Image"/>*/}
                                {/*    </div>*/}
                                {/*    <div>*/}
                                {/*        <h6 className="mb-2">Big Banana</h6>*/}
                                {/*        <div className="d-flex mb-2">*/}
                                {/*            <i className="fa fa-star text-secondary"></i>*/}
                                {/*            <i className="fa fa-star text-secondary"></i>*/}
                                {/*            <i className="fa fa-star text-secondary"></i>*/}
                                {/*            <i className="fa fa-star text-secondary"></i>*/}
                                {/*            <i className="fa fa-star"></i>*/}
                                {/*        </div>*/}
                                {/*        <div className="d-flex mb-2">*/}
                                {/*            <h5 className="fw-bold me-2">2.99 $</h5>*/}
                                {/*            <h5 className="text-danger text-decoration-line-through">4.11 $</h5>*/}
                                {/*        </div>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                                {/*<div className="d-flex justify-content-center my-4">*/}
                                {/*    <a href="#"*/}
                                {/*       className="btn border border-secondary px-4 py-3 rounded-pill text-primary w-100">View*/}
                                {/*        More</a>*/}
                                {/*</div>*/}
                            </div>
                            <div className="col-lg-12">
                                <div className="position-relative">
                                    <img src="img/banner-fruits.jpg" className="img-fluid w-100 rounded" alt=""/>
                                    <div className="position-absolute"
                                         style={{top: '50%', right: '10px', transform: 'translateY(-50%)'}}>
                                        <h3 className="text-secondary fw-bold">Fresh <br/> Fruits <br/> Banner</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <h1 className="fw-bold mb-0">Related products</h1>
                <div className="vesitable">
                    <div className="owl-carousel vegetable-carousel d-flex overflow-auto gap-3">
                        {
                            relateProducts.map(product=> (
                                    <div className="border border-primary rounded position-relative vesitable-item" style={{width:"210px", height:'350px'}}>
                                        <div className="vesitable-img" style={{width:"200px"}}>
                                            <img src="img/featur-1.jpg" className="img-fluid w-20 rounded"
                                                 alt=""/>
                                        </div>
                                        <div className="p-4 pb-0 rounded-bottom">
                                            <h5>{product.name}</h5>
                                            <div className="d-flex justify-content-between flex-lg-wrap">
                                                <p className="text-dark fs-5 fw-bold">${product.price}</p>
                                                <a href="#" className="btn border border-secondary rounded-pill px-3 py-1 mb-4 text-primary"><i className="fa fa-shopping-bag me-2 text-primary"></i> Add to cart</a>
                                            </div>
                                        </div>
                                    </div>
                                ))
                        }
                    </div>
                </div>
            </div>

        </div>

    )
}
export default ProductDetail