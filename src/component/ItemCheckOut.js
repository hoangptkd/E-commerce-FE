import React, {useEffect, useState} from 'react';

const ItemCheckOut = ({cartItem}) => {
    return (
        <tr key={cartItem.id}>
            <th scope="row">
                <div className="d-flex align-items-center">
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
                <p className="mb-0 mt-4">{cartItem.quantity}</p>
            </td>
            <td>
                <p className="mb-0 mt-4">${cartItem.price * cartItem.quantity} $</p>
            </td>
        </tr>
    )
}
export default ItemCheckOut