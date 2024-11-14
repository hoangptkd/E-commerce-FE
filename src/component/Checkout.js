import React, {useEffect, useState} from 'react';
import {json, Link, useLocation, useNavigate} from "react-router-dom";
import CartItem from "./cart/CartItem";
import ItemCheckOut from "./ItemCheckOut";
import cart from "./cart/Cart";
import cartItem from "./cart/CartItem";
import {
    MapPin as MapPinIcon,
    PlusCircle as PlusCircleIcon,
    Check as CheckIcon,
    Phone as PhoneIcon,
    User as UserIcon,
    Home as HomeIcon,
    Building as BuildingIcon,
    Map as MapIcon
} from 'lucide-react';
import {getJWT, useMyContext} from "./security/AuthProvider";
import {ConvertAddress} from "./convert/Convert";

const Checkout = () => {
    const { isAuthenticated, setIsAuthenticated,loading, user } = useMyContext();
    const location = useLocation(); // Lấy location object
    const { newFilteredCarts, total } = location.state || {};
    const [orderItem, setOrderItem] = useState([]);
    const navigate = useNavigate();
    const token = getJWT("token")
    const savedAddresses = JSON.parse(localStorage.getItem('addresses'));
    const [addresses, setAddresses] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const [newAddress, setNewAddress] = useState({
        fullName: '',
        phone: '',
        address: {
            street:'',
            district:'',
            city:''
        },
        isDefault: false
    });
    const [showDialog, setShowDialog] = useState(false);
    const [missingInfo, setMissingInfo] = useState([]);
    useEffect(()=> {

        const flattenedItems = newFilteredCarts.flatMap(filteredCart =>
            filteredCart.list.map(item => ({
                productVersion: { id: item.productVersion.id },
                quantity: item.quantity
            }))
        );
        setOrderItem(flattenedItems)

    },[])
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    useEffect(()=> {
        if (!loading) {
            if (isAuthenticated === false) {
                navigate("/login")
                return
            }
            setAddresses(addresses => {
                const hasId1 = addresses.find(address => address.id === 1);
                if (hasId1) return addresses; // Nếu tìm thấy id=1, trả về mảng cũ không thay đổi

                // Nếu không tìm thấy, thêm địa chỉ mới
                return [{
                    id: 1,
                    address: user.address,
                    fullName: user.name,
                    phone: user.phone,
                    isDefault: true
                },...addresses];
            });
            setSelectedAddressId({
                id:1,
                address:user.address,
                fullName: user.name,
                phone:user.phone,
                isDefault:true
            })
            checkUserInfo();
        }
    }, [isAuthenticated,loading]);

    const handleAddressChange = (e) => {
        const addressId = parseInt(e.target.value);
        const address1 = addresses.find(address => address.id === addressId)
        setSelectedAddressId(address1);
    };
    const checkUserInfo = () => {
        const missing = [];

        if (user.address === null) {
            missing.push('địa chỉ');
        }

        if (!user?.phone) {
            missing.push('số điện thoại');
        }

        if (missing.length > 0) {

            setMissingInfo(missing);
            setShowDialog(true);

        }
    };
    const handleUpdate = () => {
        navigate('/profile');
        setShowDialog(false);
    };
    function convertToConstantCase(str) {
        return str
            .normalize('NFD') // Tách dấu tiếng Việt
            .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu tiếng Việt
            .replace(/đ/g, 'd').replace(/Đ/g, 'D') // Thay thế đ/Đ
            .toUpperCase() // Chuyển thành chữ hoa
            .replace(/\s+/g, '_'); // Thay thế khoảng trắng bằng dấu _
    }
    function convertFromConstantCase(str) {
        return str
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }
    const handleAddAddress = (e) => {

        const newId = addresses.length + 1;

        setAddresses([...addresses, { ...newAddress, id: newId }]);

        setShowAddForm(false);
        setNewAddress({
            fullName: '',
            phone: '',
            address: {
                street:'',
                district:'',
                city:''
            },
            isDefault: false
        });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };
    useEffect(()=> {
        localStorage.setItem('addresses', JSON.stringify(addresses.filter(item => item.id !== 1)));
    },[addresses])
    const setDefaultAddress = (id) => {
        const updatedAddresses = addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === id
        }));
        setAddresses(updatedAddresses);
    };
    const checkOrder = async ()=> {
        try {
            const response = await fetch('http://localhost:9090/api/order/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(
                    orderItem
                ),
            });

            if (!response.ok) {
                throw new Error('Order không thành công');
            }
            const data = await response.json();
            navigate("/successOrder")
        } catch (error) {
            console.error('Lỗi:', error);
        }

    }
    return (

        <div className="container-fluid py-5">
            {selectedAddressId && <div className="container py-5 mt-5">
                    <h1 className="mb-4">Billing details</h1>
                    <form action="#">
                        <div className="row g-5">

                            <div className="col-md-12 col-lg-12 col-xl-12">
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                        <tr>
                                            <th scope="col">Products</th>
                                            <th scope="col">Version</th>
                                            <th scope="col">Price</th>
                                            <th scope="col">Quantity</th>
                                            <th scope="col">Total</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            newFilteredCarts.map(cart => {
                                                return <>
                                                    <tr>
                                                        <th>{cart.shopName}</th>
                                                    </tr>
                                                    {cart.list.map(item => (
                                                        <ItemCheckOut cartItem={item}/>
                                                    ))}
                                                </>
                                            })
                                        }
                                        <tr>
                                            <th scope="row">
                                            </th>
                                            <td className="py-5">
                                                <p className="mb-0 text-dark text-uppercase py-3">TOTAL</p>
                                            </td>
                                            <td className="py-5"></td>
                                            <td className="py-5"></td>
                                            <td className="py-5">
                                                <div className="py-3 border-bottom border-top">
                                                    <p className="mb-0 text-dark">${total}</p>
                                                </div>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div
                                    className="row g-4 text-center align-items-center justify-content-center border-bottom py-3">
                                    <div className="col-12">
                                        <div className="form-check text-start my-3">
                                            <input type="checkbox" className="form-check-input bg-primary border-0"
                                                   id="Transfer-1" name="Transfer" value="Transfer"/>
                                            <label className="form-check-label" htmlFor="Transfer-1">Direct Bank
                                                Transfer</label>
                                        </div>
                                        <p className="text-start text-dark">Make your payment directly into our bank
                                            account. Please use your Order ID as the payment reference. Your order will
                                            not
                                            be shipped until the funds have cleared in our account.</p>
                                    </div>
                                </div>
                                <div
                                    className="row g-4 text-center align-items-center justify-content-center border-bottom py-3">
                                    <div className="col-12">
                                        <div className="form-check text-start my-3">
                                            <input type="checkbox" className="form-check-input bg-primary border-0"
                                                   id="Delivery-1" name="Delivery" value="Delivery"/>
                                            <label className="form-check-label" htmlFor="Delivery-1">Cash On
                                                Delivery</label>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="row g-4 text-center align-items-center justify-content-center pt-4 mb-2">
                                    <button type="button"
                                            className="btn border-secondary py-3 px-4 text-uppercase w-100 text-primary"
                                            onClick={checkOrder}>Place Order
                                    </button>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h4 className="mb-0 d-flex align-items-center gap-2">
                                        <MapPinIcon size={24}/>
                                        Địa chỉ giao hàng
                                    </h4>
                                    <button
                                        className="btn btn-primary d-flex align-items-center gap-2"
                                        onClick={() => setShowAddForm(!showAddForm)}
                                        style={{borderRadius: '8px'}}
                                    >
                                        <PlusCircleIcon size={20}/>
                                        Thêm địa chỉ mới
                                    </button>
                                </div>

                                {showSuccess && (
                                    <div className="alert alert-success d-flex align-items-center mb-4" role="alert">
                                        <CheckIcon size={20} className="me-2"/>
                                        Địa chỉ mới đã được thêm thành công!
                                    </div>
                                )}

                                <div className="address-list mb-4">
                                    <div className="form-group mb-4">
                                        <select
                                            className="form-select form-select-lg mb-3"
                                            onChange={handleAddressChange}
                                            style={{borderRadius: '8px'}}
                                        >
                                            {addresses.map(addr => (
                                                <option key={addr.id} value={addr.id}>
                                                    {addr.fullName} - {addr.phone} - {ConvertAddress(addr)}  {addr.isDefault ? '(Mặc định)' : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                        <div
                                            key={selectedAddressId.id}
                                            className={`card mb-3 ${selectedAddressId.isDefault ? 'border-primary' : ''}`}
                                            style={{borderRadius: '12px'}}
                                        >
                                            <div className="card-body p-4">
                                                <div className="d-flex justify-content-between align-items-start">

                                                    <div className="flex-grow-1">
                                                        <div className="d-flex align-items-center gap-2 mb-2">
                                                            <UserIcon size={20} className="text-muted"/>
                                                            <h6 className="mb-0 fw-semibold">{selectedAddressId.fullName}</h6>
                                                            {selectedAddressId.isDefault && (
                                                                <span
                                                                    className="badge bg-primary-subtle text-primary rounded-pill px-3">Mặc định</span>
                                                            )}
                                                        </div>

                                                        <div
                                                            className="d-flex align-items-center gap-2 text-muted mb-2">
                                                            <PhoneIcon size={18}/>
                                                            <span>{selectedAddressId.phone}</span>
                                                        </div>

                                                        <div className="d-flex align-items-start gap-2 text-muted">
                                                            <HomeIcon size={18} className="mt-1"/>
                                                            <span>
                                                          {ConvertAddress(selectedAddressId)}
                                                        </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                </div>

                                {showAddForm && (
                                    <div className="card border-2 border-dashed p-4 mb-4"
                                         style={{borderRadius: '12px'}}>
                                        <div className="card-body">
                                            <h5 className="mb-4 fw-semibold">Thêm địa chỉ mới</h5>
                                            <div className="col-md-6">
                                                <div className="form-floating">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="floatingName"
                                                        placeholder="Họ và tên"
                                                        value={newAddress.fullName}
                                                        onChange={(e) => setNewAddress({
                                                            ...newAddress,
                                                            fullName: e.target.value
                                                        })}
                                                        required
                                                        style={{borderRadius: '8px'}}
                                                    />
                                                    <label htmlFor="floatingName"
                                                           className="d-flex align-items-center gap-2">
                                                        <UserIcon size={16}/>
                                                        Họ và tên
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="col-md-6">
                                                <div className="form-floating">
                                                    <input
                                                        type="tel"
                                                        className="form-control"
                                                        id="floatingPhone"
                                                        placeholder="Số điện thoại"
                                                        value={newAddress.phone}
                                                        onChange={(e) => setNewAddress({
                                                            ...newAddress,
                                                            phone: e.target.value
                                                        })}
                                                        required
                                                        style={{borderRadius: '8px'}}
                                                    />
                                                    <label htmlFor="floatingPhone"
                                                           className="d-flex align-items-center gap-2">
                                                        <PhoneIcon size={16}/>
                                                        Số điện thoại
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="col-md-4">
                                                <div className="form-floating">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="floatingWard"
                                                        placeholder="Phường/Xã"
                                                        value={newAddress.address.street}
                                                        onChange={(e) => setNewAddress({
                                                            ...newAddress,
                                                            address: {
                                                                ...newAddress.address,
                                                                street: e.target.value
                                                            }
                                                        })}
                                                        required
                                                        style={{borderRadius: '8px'}}
                                                    />
                                                    <label htmlFor="floatingWard"
                                                           className="d-flex align-items-center gap-2">
                                                        <BuildingIcon size={16}/>
                                                        Phường/Xã
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="col-md-4">
                                                <div className="form-floating">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="floatingDistrict"
                                                        placeholder="Quận/Huyện"
                                                        value={newAddress.address.district}
                                                        onChange={(e) => setNewAddress({
                                                            ...newAddress,
                                                            address: {
                                                                ...newAddress.address,
                                                                district: e.target.value
                                                            }
                                                        })}
                                                        required
                                                        style={{borderRadius: '8px'}}
                                                    />
                                                    <label htmlFor="floatingDistrict"
                                                           className="d-flex align-items-center gap-2">
                                                        <BuildingIcon size={16}/>
                                                        Quận/Huyện
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="col-md-4">
                                                <div className="form-floating">
                                                    <select
                                                        className="form-select"
                                                        id="city"
                                                        value={convertToConstantCase(newAddress.address.city)}
                                                        onChange={(e) => setNewAddress({
                                                            ...newAddress,
                                                            address: {
                                                                ...newAddress.address,
                                                                city: convertFromConstantCase(e.target.value)
                                                            }
                                                        })}
                                                        required
                                                    >
                                                        <option value="">Chọn tỉnh/thành phố</option>
                                                        <option value="AN_GIANG">An Giang</option>
                                                        <option value="BA_RIA_VUNG_TAU">Bà Rịa - Vũng Tàu</option>
                                                        <option value="BAC_LIEU">Bạc Liêu</option>
                                                        <option value="BAC_KAN">Bắc Kạn</option>
                                                        <option value="BAC_GIANG">Bắc Giang</option>
                                                        <option value="BAC_NINH">Bắc Ninh</option>
                                                        <option value="BEN_TRE">Bến Tre</option>
                                                        <option value="BINH_DUONG">Bình Dương</option>
                                                        <option value="BINH_DINH">Bình Định</option>
                                                        <option value="BINH_PHUOC">Bình Phước</option>
                                                        <option value="BINH_THUAN">Bình Thuận</option>
                                                        <option value="CA_MAU">Cà Mau</option>
                                                        <option value="CAO_BANG">Cao Bằng</option>
                                                        <option value="CAN_THO">Cần Thơ</option>
                                                        <option value="DA_NANG">Đà Nẵng</option>
                                                        <option value="DAK_LAK">Đắk Lắk</option>
                                                        <option value="DAK_NONG">Đắk Nông</option>
                                                        <option value="DIEN_BIEN">Điện Biên</option>
                                                        <option value="DONG_NAI">Đồng Nai</option>
                                                        <option value="DONG_THAP">Đồng Tháp</option>
                                                        <option value="GIA_LAI">Gia Lai</option>
                                                        <option value="HA_GIANG">Hà Giang</option>
                                                        <option value="HA_NAM">Hà Nam</option>
                                                        <option value="HA_NOI">Hà Nội</option>
                                                        <option value="HA_TINH">Hà Tĩnh</option>
                                                        <option value="HAI_DUONG">Hải Dương</option>
                                                        <option value="HAI_PHONG">Hải Phòng</option>
                                                        <option value="HOA_BINH">Hòa Bình</option>
                                                        <option value="HAU_GIANG">Hậu Giang</option>
                                                        <option value="HUNG_YEN">Hưng Yên</option>
                                                        <option value="KHANH_HOA">Khánh Hòa</option>
                                                        <option value="KIEN_GIANG">Kiên Giang</option>
                                                        <option value="KON_TUM">Kon Tum</option>
                                                        <option value="LAI_CHAU">Lai Châu</option>
                                                        <option value="LAO_CAI">Lào Cai</option>
                                                        <option value="LANG_SON">Lạng Sơn</option>
                                                        <option value="LAM_DONG">Lâm Đồng</option>
                                                        <option value="LONG_AN">Long An</option>
                                                        <option value="NAM_DINH">Nam Định</option>
                                                        <option value="NGHE_AN">Nghệ An</option>
                                                        <option value="NINH_BINH">Ninh Bình</option>
                                                        <option value="NINH_THUAN">Ninh Thuận</option>
                                                        <option value="PHU_THO">Phú Thọ</option>
                                                        <option value="PHU_YEN">Phú Yên</option>
                                                        <option value="QUANG_BINH">Quảng Bình</option>
                                                        <option value="QUANG_NAM">Quảng Nam</option>
                                                        <option value="QUANG_NGAI">Quảng Ngãi</option>
                                                        <option value="QUANG_NINH">Quảng Ninh</option>
                                                        <option value="QUANG_TRI">Quảng Trị</option>
                                                        <option value="SOC_TRANG">Sóc Trăng</option>
                                                        <option value="SON_LA">Sơn La</option>
                                                        <option value="TAY_NINH">Tây Ninh</option>
                                                        <option value="THAI_BINH">Thái Bình</option>
                                                        <option value="THAI_NGUYEN">Thái Nguyên</option>
                                                        <option value="THANH_HOA">Thanh Hóa</option>
                                                        <option value="THUA_THIEN_HUE">Thừa Thiên Huế</option>
                                                        <option value="TIEN_GIANG">Tiền Giang</option>
                                                        <option value="TP_HO_CHI_MINH">TP. Hồ Chí Minh</option>
                                                        <option value="TRA_VINH">Trà Vinh</option>
                                                        <option value="TUYEN_QUANG">Tuyên Quang</option>
                                                        <option value="VINH_LONG">Vĩnh Long</option>
                                                        <option value="VINH_PHUC">Vĩnh Phúc</option>
                                                        <option value="YEN_BAI">Yên Bái</option>
                                                    </select>
                                                    {/*<input*/}
                                                    {/*    type="text"*/}
                                                    {/*    className="form-control"*/}
                                                    {/*    id="floatingCity"*/}
                                                    {/*    placeholder="Tỉnh/Thành phố"*/}
                                                    {/*    value={newAddress.city}*/}
                                                    {/*    onChange={(e) => setNewAddress({*/}
                                                    {/*        ...newAddress,*/}
                                                    {/*        city: e.target.value*/}
                                                    {/*    })}*/}
                                                    {/*    required*/}
                                                    {/*    style={{borderRadius: '8px'}}*/}
                                                    {/*/>*/}
                                                    <label htmlFor="floatingCity"
                                                           className="d-flex align-items-center gap-2">
                                                        <MapIcon size={16}/>
                                                        Tỉnh/Thành phố
                                                    </label>
                                                </div>
                                            </div>


                                            <div className="col-12 mt-4">
                                                <button
                                                    type="button"
                                                    className="btn btn-primary me-2 d-inline-flex align-items-center gap-2"
                                                    style={{borderRadius: '8px'}}
                                                    onClick={handleAddAddress}
                                                >
                                                    <CheckIcon size={20}/>
                                                    Lưu địa chỉ
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-light d-inline-flex align-items-center gap-2"
                                                    onClick={() => setShowAddForm(false)}
                                                    style={{borderRadius: '8px'}}
                                                >
                                                    Hủy
                                                </button>
                                            </div>

                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
            </div>


            }


            {
                showDialog && <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Cập nhật thông tin</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowDialog(false)}
                                    aria-label="Close"
                                />
                            </div>

                            <div className="modal-body">
                                <p>
                                    Bạn cần cập nhật {missingInfo.join(' và ')} để tiếp tục.
                                    Vui lòng cập nhật thông tin của bạn.
                                </p>
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleUpdate}
                                >
                                    Cập nhật ngay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>

    )

}
export default Checkout