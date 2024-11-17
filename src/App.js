import React, {useEffect} from 'react';
import {BrowserRouter as Router, Link, Route, Routes} from 'react-router-dom';
import Login from './component/security/Login';
import Register from "./component/security/Register";
import Home from "./component/Home";
import Product from "./component/Product";
import Cart from "./component/cart/Cart";
import Checkout from "./component/Checkout";
import ProductDetail from "./component/ProductDetail";
import Order from "./component/SuccessOrder";
import SuccessOrder from "./component/SuccessOrder";
import MainLayout from "./component/MainLayout";
import OrderManager from "./component/shop/OrderManager";
import ShopLayout from "./component/shop/ShopLayout";
import ShopDashboard from "./component/shop/ShopDashboard";
import ProductManage from "./component/shop/ProductManage";
import "./css/style.css"
import "./css/bootstrap.min.css"
import AdminDashboard from "./component/admin/AdminDashboard";
import UsersManager from "./component/admin/UsersManager";
import OrderHistory from "./component/Order";
import LoginShop from "./component/shop/LoginShop";
import {AuthProvider, setJWT} from "./component/security/AuthProvider";
import UserProfile from "./component/security/UserProfile";
import ForgotPassword from "./component/security/ForgotPassword";

const App = () => {
    useEffect(() => {
        setJWT()
    }, []);
    return (
        <div className="app">
            <div className="home">
                <AuthProvider>
                    <Router>
                            <Routes>
                                <Route element={<MainLayout/>}>
                                    <Route path="/product" element={<Product/>}/>
                                    <Route path="/" element={<Home/>}/>
                                    <Route path="/login" element={<Login/>}/>
                                    <Route path="/register" element={<Register/>}/>
                                    <Route path="/forgot" element={<ForgotPassword/>}/>
                                    <Route path="/profile" element={<UserProfile/>}></Route>
                                    <Route path="/cart" element={<Cart/>}/>
                                    <Route path="/checkout" element={<Checkout/>}/>
                                    <Route path="/productDetail" element={<ProductDetail/>}/>
                                    <Route path="/successOrder" element={<SuccessOrder/>}/>
                                    <Route path="/order" element={<OrderHistory/>}/>
                                </Route>

                                <Route path="/shop" element={<ShopLayout />}>
                                    <Route index element={<ShopDashboard/>} />
                                    <Route path="/shop/orderManager" element={<OrderManager />} />
                                    <Route path="/shop/productManager" element={<ProductManage />} />
                                    <Route path="/shop/login" element={<LoginShop/>}> </Route>
                                </Route>

                                <Route path="/admin" element={<ShopLayout />}>
                                    <Route index element={<AdminDashboard/>} />
                                    <Route path="/admin/usersManager" element={<UsersManager />} />
                                </Route>
                            </Routes>
                    </Router>
                </AuthProvider>
            </div>
        </div>
    )
};

export default App;
