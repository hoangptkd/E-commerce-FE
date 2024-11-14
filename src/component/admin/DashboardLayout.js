import Sidebar from "./Sidebar";
import Header from "./AdminHeader";
import React from "react";
import {useCheckAdmin} from "./CheckAdmin";
const styles = `
  /* Dashboard Layout */
  .dashboard {
    display: flex;
    min-height: 100vh;
  }

  /* Sidebar Styles */
  .sidebar {
    width: 250px;
    background-color: #2c3e50;
    color: #fff;
    position: fixed;
    height: 100vh;
    left: 0;
    top: 0;
    z-index: 1000;
  }

  .sidebar-brand {
    height: 60px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    background-color: #243442;
  }

  .sidebar-brand h1 {
    font-size: 1.5rem;
    margin: 0;
  }

  .nav-menu {
    padding: 1rem 0;
  }

  .nav-item {
    padding: 0.8rem 1.5rem;
    display: flex;
    align-items: center;
    color: #ffffff;
    text-decoration: none;
    transition: background-color 0.3s;
  }

  .nav-item:hover {
    background-color: #34495e;
    color: #ffffff;
    text-decoration: none;
  }

  .nav-item.active {
    background-color: #3498db;
  }

  .nav-item span {
    margin-left: 10px;
  }

  /* Header Styles */
  .main-content {
    flex: 1;
    margin-left: 250px;
  }

  .header {
    height: 60px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    top: 0;
    right: 0;
    left: 250px;
    z-index: 999;
  }

  .header-title {
    font-size: 1.5rem;
    margin: 0;
  }

  .header-user {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .notification-bell {
    position: relative;
    cursor: pointer;
  }

  .notification-dot {
    position: absolute;
    top: -2px;
    right: -2px;
    width: 8px;
    height: 8px;
    background-color: #e74c3c;
    border-radius: 50%;
  }

  .user-avatar {
    width: 32px;
    height: 32px;
    background-color: #ddd;
    border-radius: 50%;
  }

  /* Content Area */
  .content {
    padding: 80px 20px 20px;
  }

  /* Stats Cards */
  .stats-card {
    background-color: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    height: 100%;
  }

  .stats-card-icon {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .stats-card-value {
    font-size: 1.8rem;
    font-weight: bold;
    margin: 10px 0 5px;
  }

  /* Recent Orders Table */
  .orders-card {
    background-color: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    margin-top: 2rem;
  }

  .order-status {
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 0.8rem;
  }

  .status-processing {
    background-color: #fff3cd;
    color: #856404;
  }

  .status-delivered {
    background-color: #d4edda;
    color: #155724;
  }

  .status-shipping {
    background-color: #cce5ff;
    color: #004085;
  }

  /* Responsive Styles */
  @media (max-width: 768px) {
    .sidebar {
      left: -250px;
    }

    .main-content {
      margin-left: 0;
    }

    .header {
      left: 0;
    }
  }
`;

const DashboardLayout = ({ children }) => {
    useCheckAdmin()
    return (
        <>
            <style>{styles}</style>
            <div className="dashboard">
                <Sidebar />
                <div className="main-content">
                    <Header />
                    <div className="content">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
};
export default DashboardLayout