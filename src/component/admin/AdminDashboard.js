import React, {useEffect, useState} from 'react';
import {BarChart2, Users, ShoppingBag, Package, Tag, Settings, LogOut, LineChart} from 'lucide-react';
import Header from "./AdminHeader";
import Sidebar from "./Sidebar";
import DashboardLayout from "./DashboardLayout";
import {getJWT} from "../security/AuthProvider";
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
// Stats Card Component
const StatsCard = ({ title, value, icon, color }) => {
    return (
        <div className="stats-card">
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <div className="text-muted">{title}</div>
                    <div className="stats-card-value">{value}</div>
                </div>
                <div className="stats-card-icon" style={{ backgroundColor: color }}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

// Recent Orders Table Component
const RecentOrders = () => {
    const orders = [
        {
            id: '#1234',
            customer: 'Nguyễn Văn A',
            product: 'iPhone 13',
            total: '20,000,000đ',
            status: 'Đang xử lý'
        },
        {
            id: '#1235',
            customer: 'Trần Thị B',
            product: 'Laptop Dell XPS',
            total: '30,000,000đ',
            status: 'Đã giao'
        },
        {
            id: '#1236',
            customer: 'Lê Văn C',
            product: 'Tai nghe AirPods',
            total: '4,000,000đ',
            status: 'Đang giao'
        },
    ];

    const getStatusClass = (status) => {
        switch (status) {
            case 'Đang xử lý':
                return 'status-processing';
            case 'Đã giao':
                return 'status-delivered';
            case 'Đang giao':
                return 'status-shipping';
            default:
                return '';
        }
    };

    return (
        <div className="orders-card">
            <h3 className="mb-4">Đơn hàng gần đây</h3>
            <div className="table-responsive">
                <table className="table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Khách hàng</th>
                        <th>Sản phẩm</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.customer}</td>
                            <td>{order.product}</td>
                            <td>{order.total}</td>
                            <td>
                  <span className={`order-status ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Main Dashboard Component
const Dashboard = () => {
    const [data,setData] = useState([])
    const getQuantityData = async()=> {
        try {
            const response = await fetch(`http://localhost:9090/api/order/getAllData`,
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
            setData(()=>[
                { name: 'Đơn Thành Công', value: data.received },
                { name: 'Đơn Đang Giao', value: data.pending },
                { name: 'Đơn Đã Hủy', value: data.cancelled },
                 { name: 'Đơn Đã Nhận', value: data.confirmed  }]
            )
            console.log(data)
        } catch (error) {
            console.error('Lỗi:', error);
        }
    }
    useEffect(()=> {
        getQuantityData()
    },[])

    const [users, setUsers] = useState([]);
    const [userNumber, setUserNumber] = useState(0);
    const [products, setProducts] = useState([]);
    const [productNumber , setProductNumber] = useState(0)
    const [page, setPage] = useState(0);
    const token = getJWT("token");
    const [orders,setOrders] = useState([]);
    const COLORS = ['#00C49F', '#FFBB28', '#FF8042','purple'];

    useEffect(()=> {
        const params = new URLSearchParams({
            page:page,
            size:20,

        });
        const getAllUser = async () => {
            try {
                const response = await fetch(`http://localhost:9090/api/admin/getAllUser?${params.toString()}`, {
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
                setUserNumber(data.totalElements)
            } catch (error) {
                console.error('Lỗi:', error);
            }
        };

        const getAllProduct = async () => {
            try {
                const response = await fetch(`http://localhost:9090/api/products/listAll?${params.toString()}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        // Thêm header Authorization nếu cần
                        'Authorization': 'Bearer ' + token
                    },

                });

                if (!response.ok) {
                    throw new Error('Không Thể Lấy Dữ Liệu all product');
                }
                const data = await response.json();
                setProducts(data.content)
                setProductNumber(data.totalElements)
            } catch (error) {
                console.error('Lỗi:', error);
            }
        };
        const getAllOrder = async () => {
            try {
                const response = await fetch(`http://localhost:9090/api/order/allOrder`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        // Thêm header Authorization nếu cần
                        'Authorization': 'Bearer ' + token
                    },

                });

                if (!response.ok) {
                    throw new Error('Không Thể Lấy Dữ Liệu all product');
                }
                const data = await response.json();
                setOrders(data)
            } catch (error) {
                console.error('Lỗi:', error);
            }
        };
        getAllUser()
        getAllProduct()
    },[])
    return (
        <DashboardLayout>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-4 mb-4">
                        <StatsCard
                            title="Tổng Users"
                            value={userNumber}
                            icon={<Users size={24} color="white"/>}
                            color="#4299e1"
                        />
                    </div>
                    <div className="col-md-4 mb-4">
                        <StatsCard
                            title="Sản phẩm"
                            value={productNumber}
                            icon={<Package size={24} color="white"/>}
                            color="#8b5cf6"
                        />
                    </div>
                    <div className="col-md-4 mb-4">
                        <StatsCard
                            title="Đơn hàng mới"
                            value="23"
                            icon={<Tag size={24} color="white"/>}
                            color="#ed8936"
                        />
                    </div>

                </div>
                <div className="bando">
                    <PieChart width={400} height={400} >
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={120}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            label
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                            ))}
                        </Pie>
                        <Tooltip/>
                        <Legend/>
                    </PieChart>
                </div>
                {/*<RecentOrders/>*/}
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;