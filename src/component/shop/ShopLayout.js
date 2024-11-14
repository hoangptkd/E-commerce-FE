import React from "react";
import {Outlet} from "react-router-dom";
import Header from "./ShopHeader";
const ShopLayout = () => {
    return (
        <div className="shop-layout">
            <Header/>
            <Outlet/>
        </div>
    );
};

export default ShopLayout;