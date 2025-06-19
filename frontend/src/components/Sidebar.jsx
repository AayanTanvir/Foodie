import React, { useContext, useState, useEffect } from 'react';
import { IoMdClose } from "react-icons/io";
import { GlobalContext } from '../context/GlobalContext';
import { NavLink } from 'react-router-dom';
import { IoIosLogOut } from "react-icons/io";
import { IoIosList } from "react-icons/io";
import { RxPerson } from "react-icons/rx";
import { CiSettings, CiShop } from 'react-icons/ci';
import { CiReceipt } from "react-icons/ci";
import AuthContext from "../context/AuthContext";
import { GiSettingsKnobs } from "react-icons/gi";

const Sidebar = () => {

    const { setShowSidebar } = useContext(GlobalContext);
    const { user, logoutUser } = useContext(AuthContext);
    const [mounted, setMounted] = useState(false);
    const [closing, setClosing] = useState(false);
    const sidebarLinkClass = "relative font-poppins text-neutral-800 text-md after:content-[''] after:absolute after:bottom-0 after:left-0 after:rounded-md after:bg-neutral-800 after:w-0 after:h-[2px] after:transition-all after:ease-in-out after:duration-300 hover:after:w-full"
    
    const SidebarLink = ({ to="", title="", clickHandler }) => {
        if (to === "" && clickHandler) {
            return (
                <a onClick={ clickHandler } className={sidebarLinkClass}>{title}</a>
            )
        }

        return (
            <NavLink to={to} onClick={() => { closeSidebar() }} className={sidebarLinkClass}>{title}</NavLink>
        )
    }

    useEffect(() => {
        setMounted(true);
    }, []);

    const closeSidebar = () => {
        setClosing(true);
        setMounted(false);

        let timeout = setTimeout(() => {
            setShowSidebar(false);
        }, 600);
    }

    return (
        <div className={`fixed top-12 left-0 w-64 h-full bg-white border-r-[1px] border-neutral-800 flex flex-col justify-start items-center p-4 transform transition-transform duration-500 ease-in-out ${ mounted ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0' } ${ closing && '-translate-x-full opacity-100' }`} style={{ zIndex: 1000 }}>
            <div className='w-full h-fit flex justify-end items-center'>
                <span onClick={() => { closeSidebar() }} className='text-xl text-neutral-800 cursor-pointer'><IoMdClose /></span>
            </div>
            <div className='w-full flex-1 flex flex-col justify-start items-center '>
                <div className='w-full flex flex-col justify-start items-start'>
                    <h1 className='text-md font-roboto font-semibold cursor-default text-neutral-400 mb-2'>PAGES</h1>
                    <div className='w-full h-fit flex justify-start items-center gap-2 p-2 cursor-pointer transition'>
                        <span className='text-neutral-800 text-2xl'>
                            <RxPerson />
                        </span>
                        <SidebarLink to={`/u/${user.uuid}`} title="Profile" />
                    </div>
                    <div className='w-full h-fit flex justify-start items-center gap-2 p-2 cursor-pointer transition'>
                        <span className='text-neutral-800 text-2xl'>
                            <CiReceipt />
                        </span>
                        <SidebarLink to={`/u/${user.uuid}/orders`} title="Your Orders" />
                    </div>
                    {user.groups.includes("restaurant owner") && (
                        <>
                            <h1 className='text-md font-roboto font-semibold cursor-default text-neutral-400 my-2'>RESTAURANT ADMIN</h1>
                            <div className='w-full h-fit flex justify-start items-center gap-2 p-2 cursor-pointer transition'>
                                <span className='text-neutral-800 text-2xl'>
                                    <GiSettingsKnobs />
                                </span>
                                <SidebarLink to='/restaurant-owner/dashboard' title="Dashboard"/>
                            </div>
                            <div className='w-full h-fit flex justify-start items-center gap-2 p-2 cursor-pointer transition'>
                                <span className='text-neutral-800 text-2xl'>
                                    <CiShop />
                                </span>
                                <SidebarLink to='/restaurant-owner/restaurants' title="Restaurants"/>
                            </div>
                            <div className='w-full h-fit flex justify-start items-center gap-2 p-2 cursor-pointer transition'>
                                <span className='text-neutral-800 text-2xl'>
                                    <IoIosList />
                                </span>
                                <SidebarLink to='/restaurant-owner/orders' title="Orders"/>
                            </div>
                        </>
                    )}
                    <h1 className='text-md font-roboto font-semibold cursor-default text-neutral-400 my-2'>OTHER</h1>
                    <div className='w-full h-fit flex justify-start items-center gap-2 p-2 cursor-pointer transition'>
                        <span className='text-neutral-800 text-2xl'>
                            <IoIosLogOut />
                        </span>
                        <SidebarLink title='Logout' clickHandler={() => { closeSidebar(); logoutUser(); }} />
                    </div>
                    <div className='w-full h-fit flex justify-start items-center gap-2 p-2 cursor-pointer transition'>
                        <span className='text-neutral-800 text-2xl'>
                            <CiSettings />
                        </span>
                        <SidebarLink title='Settings' to='/' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar
