import React from "react"
import {useState,useEffect} from "react";
import {getJWT} from "../security/AuthProvider";


function CartItem({cartItem,onSetTotal,onSetRender}) {
    const [quantity, setQuantity] = useState(cartItem.quantity);
    const [choose, setChoose] = useState(false);
    const [isFirstRender, setIsFirstRender] = useState(true);
    const token = getJWT("token")
    useEffect(() => {
        if (quantity <= 0) {
            setQuantity(1)

        } else {
            const updateQuantity = async () => {

                if (!isFirstRender) {
                    console.log({cardItemId: cartItem.id, quantity: quantity})
                    try {
                        const response = await fetch("http://localhost:9090/api/cart/updateQuantity", {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                                'Authorization': 'Bearer ' + token
                            },
                            body: JSON.stringify({cardItemId: cartItem.id, quantity: quantity}),

                        });
                        if (!response.ok) {
                            throw new Error("Khong the thay doi so luong");
                        }

                        const data = {
                            id: cartItem.id,
                            imagePath: cartItem.imagePath,
                            name: cartItem.productName,
                            productVersion: cartItem.productVersion,
                            price: cartItem.price,
                            quantity: quantity,
                            check: false
                        };
                        if (choose) {
                            onSetTotal(data);
                            data.check = true;
                            onSetTotal(data)
                        }
                        onSetRender()
                    } catch (error) {
                        console.error("Error:", error);
                    }
                } else {
                    setIsFirstRender(false);
                }
            }
            updateQuantity();
        };

    },[quantity])


    const handleDelete = async() => {
        try {
            onSetRender()
            const response = await fetch(`http://localhost:9090/api/cart/delete/${cartItem.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + token
                },

            });
            if (!response.ok) {
                throw new Error("Khong the xoa");
            }


        } catch (error) {
            console.error("Error:", error);
        }
    }

    const handleChoose = (e) => {
        setChoose(e.target.checked)
        if (e.target.checked) {
            const data = {
                id: cartItem.id,
                imagePath: cartItem.imagePath,
                name: cartItem.productName,
                productVersion: cartItem.productVersion,
                price: cartItem.price,
                quantity:quantity,
                check:true
            };
            onSetTotal(data);
        } else {
            const data = {
                id: cartItem.id,
                check:false
            }
            onSetTotal(data);
        }
    }
    return (
        <tr key={cartItem.id}>

            <th scope="row">
                <div className="d-flex align-items-center">
                    <input type="Checkbox" id="choose" style = {{marginRight:'10px'}} checked={choose} onChange={handleChoose}/>
                    <img src={`img/${cartItem.imagePath}`} className="img-fluid me-5 rounded-circle"
                         style={{width: '80px', height: '80px'}} alt=""/>
                    <p className="mb-0 mt-4">{cartItem.productName}</p>
                </div>
            </th>
            <td>
                <p className="mb-0 mt-4">{cartItem.productVersion.versionName}</p>
            </td>
            <td>
                <p className="mb-0 mt-4">{cartItem.price} $</p>
            </td>
            <td>
                <div className="input-group quantity mt-4" style={{width: '100px'}}>
                    <div className="input-group-btn">
                        <button className="btn btn-sm btn-plus rounded-circle bg-light border"
                                onClick={
                                    () => {
                                        setQuantity(quantity => quantity - 1);
                                    }}>
                            <i className="fa fa-minus"></i>
                        </button>
                    </div>
                    <input type="text" className="form-control form-control-sm text-center border-0"
                           value={quantity}/>
                    <div className="input-group-btn">
                        <button className="btn btn-sm btn-plus rounded-circle bg-light border"
                                onClick={
                                    () => {
                                        setQuantity(quantity => quantity + 1);
                                    }}>
                            <i className="fa fa-plus"></i>
                        </button>
                    </div>
                </div>
            </td>
            <td>
                <p className="mb-0 mt-4">${cartItem.price * quantity} $</p>
            </td>
            <td>
                <button className="btn btn-md rounded-circle bg-light border mt-4"
                        onClick ={()=> (
                            handleDelete()
                        )}>
                    <i className="fa fa-times text-danger"></i>
                </button>
            </td>
        </tr>
    )
}

export default CartItem