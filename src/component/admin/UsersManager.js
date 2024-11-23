import React, {useEffect, useState} from "react";
import DashboardLayout from "./DashboardLayout";
import { Search, Edit, Lock, Unlock, ChevronLeft, ChevronRight } from 'lucide-react';
import './UsersManager.css';
import {ConvertTimeStamp} from "../convert/Convert";
import {getJWT} from "../security/AuthProvider";
import API_URL from "../../config";
// Status Badge Component
const StatusBadge = ({ status }) => {
    const statusClasses = {
        active: "status-badge active",
        inactive: "status-badge inactive",
        pending: "status-badge pending"
    };

    const statusText = {
        active: "Hoạt động",
        inactive: "Không hoạt động",
        pending: "Chờ xác thực"
    };

    return (
        <span className={statusClasses[status]}>
      {statusText[status]}
    </span>
    );
};

// User Row Component
const UserRow = ({ user }) => {
    const [status, setStatus] = useState(user.status)
    useEffect(()=>{
        const ProductDelete = async (id)=> {
            const params = new URLSearchParams({
                status: status
            }).toString();
            try {
                const response = await fetch(`${API_URL}/api/admin/editStatus/${id}?${params}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            // Thêm header Authorization nếu cần
                            'Authorization': 'Bearer ' + getJWT("token")
                        },
                    });

                if (!response.ok) {
                    throw new Error('Không Thể Thay Doi Status');
                }
            } catch (error) {
                console.error('Lỗi:', error);
            }
        }
        ProductDelete(user.id)
    },[status])

    return <tr>
        <td>
            <div className="user-info">
                <div className="avatar">{user.avatar}</div>
                <div>
                    <div className="user-name">{user.name}</div>
                    <div className="user-username">@{user.username}</div>
                </div>
            </div>
        </td>
        <td>{user.gmail}</td>
        <td>{<ConvertTimeStamp timestamp={user.register_date}/>}</td>
        <td>
            <StatusBadge status={status}/>
        </td>
        <td>
            <div className="action-buttons">
                <button className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1">
                    <Edit size={14}/>
                    Sửa
                </button>
                <button className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                        onClick={()=>status === 'active' ? setStatus('inactive'):setStatus('active')}>
                    {status === 'inactive' ? <Unlock size={14}/> : <Lock size={14}/>}
                    {status === 'inactive' ? 'Mở khóa' : 'Khóa'}
                </button>
            </div>
        </td>
    </tr>
};

// Users Table Component
const UsersTable = ({ users,onSetPage }) => (

    <div className="card">
        <div className="card-body">
            <div className="table-responsive">
                <table className="table table-hover">
                    <thead>
                    <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Ngày tham gia</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user, index) => (
                        <UserRow key={index} user={user} />
                    ))}
                    </tbody>
                </table>
            </div>


        </div>
    </div>
);
const UsersManager = () => {
    const [users, setUsers] = useState([]);
    const [data,setData] = useState([])
    const [userNumber, setUserNumber] = useState(0);
    const [page, setPage] = useState(0);
    const [pageNumber, setPageNumber] = useState(0)
    const [searchTerm, setSearchTerm] = useState('');
    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        if (term.trim() === '') {
            setUsers(data); // Nếu input rỗng, hiển thị tất cả
        } else {
            const filteredUsers = data.filter(user =>
                user.name.toLowerCase().includes(term.toLowerCase())
            );
            setUsers(filteredUsers);
        }
    };
    useEffect(() => {
        const params = new URLSearchParams({
            page: page,
            size: 20,

        });
        const token = getJWT("token")
        const getAllUser = async () => {
            try {
                const response = await fetch(`${API_URL}/api/admin/getAllUser?${params.toString()}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        // Thêm header Authorization nếu cần
                        'Authorization': 'Bearer ' + token
                    },

                });

                if (!response.ok) {
                    throw new Error('Không Thể Lấy Dữ Liệu All Users');
                }
                const data = await response.json();
                setUsers(data.content)
                setData(data.content)
                setUserNumber(data.totalElements)
                setPageNumber(data.totalPages)
                } catch (error) {
                    console.error('Lỗi:', error);
                }
            };
            getAllUser()
        },[])

        return (
            <DashboardLayout>
                <div className="user-management1">
                    <div className="main-content1">
                        <div className="card mb-4">
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-12 col-md">
                                        <div className="search-box">
                                            <Search className="search-icon"/>
                                            <input
                                                type="text"
                                                className="form-control search-input"
                                                placeholder="Tìm kiếm user..."
                                                value={searchTerm}
                                                onChange={handleSearch}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <UsersTable users={users}/>
                        <nav className="d-flex justify-content-end mt-3">
                            <ul className="pagination mb-0">
                                <li className="page-item">
                                    <button className="page-link">
                                        <ChevronLeft size={16}/>
                                    </button>
                                </li>
                                <div className="pagination d-flex justify-content-center mt-5">
                                    <a className="rounded" onClick={() => setPage((index) => (index - 1))}>&laquo;</a>
                                    {
                                        Array.from({length: pageNumber}, (_, index) => (
                                            index === page ?
                                                <a key={index} className="active rounded">{index + 1}</a> :
                                                <a key={index} className="rounded"
                                                   onClick={() => setPage(index)}>{index + 1}</a>
                                        ))
                                    }

                                    <a className="rounded" onClick={() => setPage((index) => (index + 1))}>&raquo;</a>
                                </div>

                                <li className="page-item">
                                    <button className="page-link">
                                        <ChevronRight size={16}/>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </DashboardLayout>
        );
};
export default UsersManager