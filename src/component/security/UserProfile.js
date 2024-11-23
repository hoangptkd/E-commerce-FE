import React, {useEffect, useState} from 'react';
import {getJWT, useMyContext} from "./AuthProvider";
import {ConvertAddress} from "../convert/Convert";
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import API_URL from "../../config";
const UserProfile = () => {
    const navigate = useNavigate();
    const CITIES = {
        AN_GIANG: "An Giang",
        BA_RIA_VUNG_TAU: "Bà Rịa - Vũng Tàu",
        BAC_LIEU: "Bạc Liêu",
        BAC_KAN: "Bắc Kạn",
        BAC_GIANG: "Bắc Giang",
        BAC_NINH: "Bắc Ninh",
        BEN_TRE: "Bến Tre",
        BINH_DINH: "Bình Định",
        BINH_DUONG: "Bình Dương",
        BINH_PHUOC: "Bình Phước",
        BINH_THUAN: "Bình Thuận",
        CA_MAU: "Cà Mau",
        CAO_BANG: "Cao Bằng",
        CAN_THO: "Cần Thơ",
        DA_NANG: "Đà Nẵng",
        DAK_LAK: "Đắk Lắk",
        DAK_NONG: "Đắk Nông",
        DIEN_BIEN: "Điện Biên",
        DONG_NAI: "Đồng Nai",
        DONG_THAP: "Đồng Tháp",
        GIA_LAI: "Gia Lai",
        HA_GIANG: "Hà Giang",
        HA_NAM: "Hà Nam",
        HA_NOI: "Hà Nội",
        HA_TINH: "Hà Tĩnh",
        HAI_DUONG: "Hải Dương",
        HAI_PHONG: "Hải Phòng",
        HAU_GIANG: "Hậu Giang",
        HOA_BINH: "Hòa Bình",
        HUNG_YEN: "Hưng Yên",
        KHANH_HOA: "Khánh Hòa",
        KIEN_GIANG: "Kiên Giang",
        KON_TUM: "Kon Tum",
        LAI_CHAU: "Lai Châu",
        LANG_SON: "Lạng Sơn",
        LAO_CAI: "Lào Cai",
        LAM_DONG: "Lâm Đồng",
        LONG_AN: "Long An",
        NAM_DINH: "Nam Định",
        NGHE_AN: "Nghệ An",
        NINH_BINH: "Ninh Bình",
        NINH_THUAN: "Ninh Thuận",
        PHU_THO: "Phú Thọ",
        PHU_YEN: "Phú Yên",
        QUANG_BINH: "Quảng Bình",
        QUANG_NAM: "Quảng Nam",
        QUANG_NGAI: "Quảng Ngãi",
        QUANG_NINH: "Quảng Ninh",
        QUANG_TRI: "Quảng Trị",
        SOC_TRANG: "Sóc Trăng",
        SON_LA: "Sơn La",
        TAY_NINH: "Tây Ninh",
        THAI_BINH: "Thái Bình",
        THAI_NGUYEN: "Thái Nguyên",
        THANH_HOA: "Thanh Hóa",
        THUA_THIEN_HUE: "Thừa Thiên Huế",
        TIEN_GIANG: "Tiền Giang",
        TP_HO_CHI_MINH: "TP Hồ Chí Minh",
        TRA_VINH: "Trà Vinh",
        TUYEN_QUANG: "Tuyên Quang",
        VINH_LONG: "Vĩnh Long",
        VINH_PHUC: "Vĩnh Phúc",
        YEN_BAI: "Yên Bái"
    };
    const { isAuthenticated, setIsAuthenticated,user,setUser,loading } = useMyContext();
    const [isEditing, setIsEditing] = useState(false);
    const [firstRender, setFirstRender] = useState(true);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        ...user,
        avatar: `img/product/product-1.jpg`,
    });
    const [tempData, setTempData] = useState({
        ...user,
        avatar: `img/product/product-1.jpg`,
    })
    const [showEdit, setShowEdit] = useState(false);
    const [showPassEdit, setShowPassEdit] = useState(false);
    const [currentPass, setCurrentPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const validatePhone = (phone) => {
        const phoneRegex = /^0[0-9]{9}$/;
        return phoneRegex.test(phone);
    };
    const handlePassSave =()=> {
        const editPass = async ()=> {
            const token = getJWT("token")
            const params = new URLSearchParams({
                currentPass:currentPass,
                newPass: newPass
            });
            const response = await fetch(`${API_URL}/api/user/changePassword?${params}`, {
                method: "PUT",
                headers: {
                    'Content-type' : 'application/json',
                    'Authorization' : 'Bearer ' + token
                },

            })
            if (!response.ok) {
                handleClosePassEdit()
                alert('Không thể Đổi Mật Khẩu');
                throw new Error("Không thể cập nhật thông tin")
            }
            alert('Đã Đổi Mật Khẩu!');
            handleClosePassEdit()
        }
        editPass()
    }
    useEffect(()=> {

        if (!loading) {
            if (isAuthenticated === false) {
                navigate("/login")
                return
            }
            setTempData({
                ...user,
                avatar: `img/product/product-1.jpg`,
            })
        }

    },[isAuthenticated,loading,user])

    const [tempAddress, setTempAddress] = useState({
        street: "",
        district: "",
        city: ""
    });
    function convertToConstantCase(str) {
        return str
            .normalize('NFD') // Tách dấu tiếng Việt
            .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu tiếng Việt
            .replace(/đ/g, 'd').replace(/Đ/g, 'D') // Thay thế đ/Đ
            .toUpperCase() // Chuyển thành chữ hoa
            .replace(/\s+/g, '_'); // Thay thế khoảng trắng bằng dấu _
    }
    const handleShowEdit = () => {
        formData.address!= null ? setTempAddress({
            street: formData.address.street,
            district: formData.address.district,
            city: convertToConstantCase(formData.address.city)
        }):setTempAddress({
            street: "",
            district: "",
            city: ""
        });
        setShowEdit(true);
    };
    const handleShowPassEdit = () => {

        setShowPassEdit(true);
    }
    const handleCloseEdit = () => {
        setShowEdit(false);
    };
    const handleClosePassEdit =()=> {
        setShowPassEdit(false);
    }
    const handleAddressSave = () => {
        if (validateForm()) {
            setTempData(prev => ({
                ...prev,
                address: tempAddress
            }));
            setShowEdit(false);
        }


    };
    const [errors, setErrors] = useState({
        street: '',
        district: '',
        city: ''
    });

    // Hàm validate form
    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            street: '',
            district: '',
            city: ''
        };

        // Kiểm tra đường phố
        if (!tempAddress.street || tempAddress.street.trim() === '') {
            newErrors.street = 'Vui lòng nhập số nhà, đường';
            isValid = false;
        }

        // Kiểm tra quận/huyện
        if (!tempAddress.district || tempAddress.district.trim() === '') {
            newErrors.district = 'Vui lòng nhập quận/huyện';
            isValid = false;
        }

        // Kiểm tra tỉnh/thành phố
        if (!tempAddress.city || tempAddress.city === '') {
            newErrors.city = 'Vui lòng chọn tỉnh/thành phố';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "phone") {

            if (value.length > 0 && !validatePhone(value)) {
                setError("Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại 10 số, bắt đầu bằng số 0");
            } else {
                setError("");

            }
            setTempData(prevState => ({
                ...prevState,
                [name]: value
            }));
        } else {
            setTempData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }

    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (error === "") {
            setFormData(tempData)
        } else {
            setTempData(prevState => ({
                ...prevState,
                phone: formData.phone
            }));
            alert(error);
            setError("")
        }
        setIsEditing(false);
    };

    useEffect(()=> {
        const editProfile = async ()=> {
            const token = getJWT("token")
            const response = await fetch(`${API_URL}/api/user/updateProfile`, {
                method: "PUT",
                headers: {
                    'Content-type' : 'application/json',
                    'Authorization' : 'Bearer ' + token
                },
                body: JSON.stringify(formData)
            })
            if (!response.ok) {
                handleCloseEdit()
                alert('Không thể cập nhật thông tin');
                throw new Error("Không thể cập nhật thông tin")
            }
            const response1 = await fetch('${API_URL}/api/user/check', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
            });
            if (!response1.ok) {
                return null;
            } else {
                const user = await response1.json();
                setUser(user)
            }
            alert('Thông tin đã được cập nhật!');

            handleCloseEdit()
        }
        if (!firstRender) {
            editProfile()
        } else {
            setFirstRender(false);
        }
    },[formData])



    return (
        <>
            {loading && <div>Loading...</div>}
            {!loading && (
                <div className="container_profile pt-5 mt-5">

                <div className="row mt-5">
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body text-center">
                                <img
                                    src={tempData.avatar}
                                    alt="Avatar"
                                    className="rounded-circle img-fluid mb-3"
                                    style={{width: '150px', height: '150px', objectFit: 'cover'}}
                                />
                                <h5 className="card-title mb-0">{tempData.Name}</h5>
                                {/*<p className="text-muted">Thành viên từ {<ConvertTimeStamp*/}
                                {/*    timestamp={tempData.register_date}/>}</p>*/}
                                <p className="text-muted">Thành viên từ {tempData.register_date}</p>
                                {!isEditing && (
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        Chỉnh sửa thông tin
                                    </button>

                                )}

                                {isEditing && (
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleShowPassEdit}
                                    >
                                        Đổi mật khẩu
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="card mt-3">
                            <div className="card-body">
                                <h6 className="card-title">Thống kê</h6>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Đơn hàng</span>
                                    <span>23</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Đánh giá</span>
                                    <span>12</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span>Ví tiền</span>
                                    <span>{tempData.balance}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title mb-4">Thông tin cá nhân</h5>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Họ và tên</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            value={tempData.name}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Số điện thoại</label>
                                        <input
                                            type="tel"
                                            className={`form-control ${error ? 'is-invalid' : ''}`}
                                            name="phone"
                                            value={tempData.phone}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                        />
                                        {error && <div className="invalid-feedback">{error}</div>}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Địa chỉ</label>
                                        <div className="d-flex gap-2 align-items-center">
                                            <textarea
                                                className="form-control"
                                                value={ConvertAddress(tempData)}
                                                disabled
                                                rows="3"
                                            />
                                            {isEditing && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={handleShowEdit}
                                                >
                                                    Sửa
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    {isEditing && (
                                        <div className="text-end">
                                            <button
                                                type="button"
                                                className="btn btn-secondary me-2"
                                                onClick={() => setIsEditing(false)}
                                            >
                                                Hủy
                                            </button>
                                            <button type="submit" className="btn btn-primary">
                                                Lưu thay đổi
                                            </button>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                {showEdit && (
                    <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Chỉnh sửa địa chỉ</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={handleCloseEdit}
                                    />
                                </div>

                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label htmlFor="street" className="form-label">Số nhà, Đường</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.street ? 'is-invalid' : ''}`}
                                            id="street"
                                            value={tempAddress.street}
                                            onChange={(e) => setTempAddress({...tempAddress, street: e.target.value})}
                                            placeholder="Nhập số nhà, tên đường"
                                        />
                                        {errors.street && <div className="invalid-feedback">{errors.street}</div>}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="district" className="form-label">Quận/Huyện</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.district ? 'is-invalid' : ''}`}
                                            id="district"
                                            value={tempAddress.district}
                                            onChange={(e) => setTempAddress({...tempAddress, district: e.target.value})}
                                            placeholder="Nhập quận/huyện"
                                        />
                                        {errors.district && <div className="invalid-feedback">{errors.district}</div>}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="city" className="form-label">Tỉnh/Thành phố</label>
                                        <select
                                            className="form-select"
                                            id="city"
                                            value={tempAddress.city}
                                            onChange={(e) => setTempAddress({...tempAddress, city: e.target.value})}
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
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={handleCloseEdit}
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleAddressSave}
                                    >
                                        Lưu thay đổi
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                </div>)}
            {showPassEdit && (
                <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Chỉnh sửa địa chỉ</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={handleClosePassEdit}
                                />
                            </div>

                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="currentPass" className="form-label">Mật Khẩu Cũ</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="currentPass"
                                        value={currentPass}
                                        onChange={(e) => setCurrentPass(e.target.value)}
                                        placeholder="Nhập Mật Khẩu Cũ"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="newPass" className="form-label">Mật Khẩu Mới</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="newPass"
                                        value={newPass}
                                        onChange={(e) => setNewPass(e.target.value)}
                                        placeholder="Nhập Mật Khẩu Mới"
                                    />
                                </div>

                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleClosePassEdit}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handlePassSave}
                                >
                                    Lưu thay đổi
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserProfile;