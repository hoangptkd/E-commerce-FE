export default function Header()  {
    return (
        <div className="header">
            <h2 className="header-title">Dashboard</h2>
            <div className="header-user">
                <div className="notification-bell">
                    <i className="fas fa-bell"></i>
                    <div className="notification-dot"></div>
                </div>
                <div className="user-avatar"></div>
                <span>Admin User</span>
            </div>
        </div>
    );
};