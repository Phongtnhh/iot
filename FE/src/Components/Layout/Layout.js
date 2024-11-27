import './Layout.css'
import { Link, Outlet, } from "react-router-dom";
import { useState } from "react";

function Layout(){

    
    return (
        <>
            
        <div className="dashBoard">
            
            <div className="sideBar">
            <ul className="sideBar-list">
                <li className="sideBar-item">
                    <Link className='sideBar-icon' to={"/home"} >
                        <i className="fa-solid fa-house-user">
                        </i>
                        <span className='sideBar-text'>DashBoard</span>
                    </Link>
                </li>
                <li className="sideBar-item">
                    <Link className='sideBar-icon' to={"/new"} >
                        <i className="fa-solid fa-house-user">
                        </i>
                        <span className='sideBar-text'>Bai5</span>
                    </Link>
                </li>
                <li className="sideBar-item">
                <Link  className="sideBar-icon" to={"/action"}>
                    <i className="fa-solid fa-chart-simple"></i>
                        <span className='sideBar-text'>Action History</span>
                    </Link>
                </li>
                <li className="sideBar-item">
                    <Link className="sideBar-icon" to={"/datalogs"} >
                    <i className="fa-solid fa-clock-rotate-left"></i>
                        <span className='sideBar-text'> Data Sensor</span>
                    </Link>
                </li>
                <li className="sideBar-item">
                    
                    <Link className="sideBar-icon" to={"/profile"}>
                        <i className="fa-solid fa-user"></i>
                        <span className='sideBar-text'>Profile</span>
                    </Link>
                </li>
            </ul>
        </div>
        <div className="sideMain">
            <Outlet/>
        </div>
    </div>
        </>
    )
}

export default Layout;