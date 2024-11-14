import { BarChart2, Users, ShoppingBag, Package, Tag, Settings, LogOut } from 'lucide-react';
import {useNavigate} from "react-router-dom";
// Sidebar Component
const Sidebar = () => {
    const navigate = useNavigate();
    return (
        <div className="sidebar">
            <div className="sidebar-brand">
                <h1>Admin Panel</h1>
            </div>
            <nav className="nav-menu">
                <a
                    className={`nav-item`}
                    onClick={() => navigate("/admin ")}
                >
                    <BarChart2 size={20}/>
                    <span>Dashboard</span>
                </a>
                <a
                    className={`nav-item`}
                    onClick={() => navigate("/admin/usersManager")}
                >
                    <Users size={20}/>
                    <span>Quản lý Users</span>
                </a>
                {/*<a*/}
                {/*    className={`nav-item`}*/}
                {/*    onClick={() => navigate("/admin/usersManager")}*/}
                {/*>*/}
                {/*    <Package size={20} />*/}
                {/*    <span>Sản phẩm</span>*/}
                {/*</a>*/}
            </nav>
            <a href="#" className="nav-item" style={{marginTop: 'auto'}}>
                <LogOut size={20}/>
                <span>Đăng xuất</span>
            </a>
        </div>
    );
};
export default Sidebar