import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { PiShoppingCartSimpleThin } from "react-icons/pi";
import { IoIosMenu } from "react-icons/io";
import { IoIosLogOut } from "react-icons/io";
import { IoIosList } from "react-icons/io";
import { RxPerson } from "react-icons/rx";
import { CiShop } from "react-icons/ci";

const Navbar = () => {

    let { user, logoutUser } = useContext(AuthContext);
    let { isCartEmpty, cartItems } = useContext(CartContext);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const navigate = useNavigate();

    return (
        <>
            <div className='w-full h-12 border-b-[1px] border-neutral-800 bg-white flex justify-between items-center fixed top-0 left-0 px-8 text-neutral-100 z-50'>
                {user ? (
                    <NavLink to='/' className='font-poppins text-xl font-extrabold tracking-tight h-full w-fit transition flex justify-center items-center px-3 cursor-pointer text-neutral-800'>Food<span className='text-neutral-500'>ie</span></NavLink>
                ) : (
                    <a className='font-poppins font-extrabold tracking-wider h-full w-fit transition flex justify-center items-center px-3 cursor-default'>Food<span className='text-neutral-400'>ie</span></a>
                )}
                <div className='flex justify-center items-center h-full'>
                    {user ? (
                        <>
                            {isCartEmpty ? (
                                <a className='relative w-fit h-full px-3 flex justify-center items-center transition cursor-not-allowed'>
                                    <span className='text-neutral-300 text-2xl'><PiShoppingCartSimpleThin /></span>
                                </a>
                            ) : (
                                <NavLink to="/cart" className={({ isActive }) =>
                                        `relative w-fit h-full px-3
                                        flex justify-center items-center transition
                                        ${isActive && 'bg-neutral-300'}`}>

                                        <span className='text-neutral-800 text-2xl text-center'><PiShoppingCartSimpleThin /></span>
                                    {!isCartEmpty && (
                                        <div className="w-3 h-3 rounded-full bg-white border-[1px] border-neutral-800 absolute
                                            top-[20%] right-[15%] flex justify-center items-center">
                                            <div className='w-[7px] h-1.5 rounded-full bg-rose-500'></div>
                                        </div>
                                    )}
                                </NavLink>
                            )}
                            {user.groups.includes("restaurant owner") && (
                                <NavLink to="/restaurant-owner/dashboard" className={({ isActive }) => `h-full w-fit flex justify-center items-center px-3 transition ${isActive && 'bg-neutral-300'} cursor-pointer`}>
                                    <span className='text-2xl text-neutral-800'><CiShop /></span>
                                </NavLink>
                            )}
                            <a onMouseEnter={() => { setShowProfileDropdown(true) }} className={`h-full w-fit transition ${showProfileDropdown && 'bg-neutral-300'} flex justify-center items-center px-3 cursor-pointer`}>
                                <span className='text-neutral-800 text-xl'>
                                    <IoIosMenu />
                                </span>
                            </a>
                        </>
                    ) : (
                        <>
                            <NavLink className={({ isActive }) => `font-poppins h-full w-fit transition ${isActive && 'bg-neutral-300'} flex justify-center items-center px-3 cursor-pointer`} to='/login'>Login</NavLink>
                            <NavLink className={({ isActive }) => `font-poppins h-full w-fit transition ${isActive && 'bg-neutral-300'} flex justify-center items-center px-3 cursor-pointer`} to='/signup'>Signup</NavLink>
                        </>
                    )}
                </div>
            </div>
            {showProfileDropdown && (
                <div onMouseLeave={() => { setShowProfileDropdown(false) }} className='fixed right-8 z-50 top-12 w-32 h-fit bg-neutral-800 flex flex-col justify-start items-center rounded-b-md'>
                    <div className='w-full h-fit flex justify-center items-center gap-2 p-2 cursor-pointer transition hover:bg-neutral-700'>
                        <span className='text-neutral-100 text-xl'>
                            <RxPerson />
                        </span>
                        <NavLink to={`/u/${user.uuid}`} className="font-poppins text-neutral-100 transition hover:bg-neutral-700">Profile</NavLink>
                    </div>
                    <div className='w-full h-fit flex justify-center items-center gap-2 p-2 cursor-pointer transition hover:bg-neutral-700'>
                        <span className='text-neutral-100 text-xl'>
                            <IoIosList />
                        </span>
                        <NavLink to={`/u/${user.uuid}/orders`} className="font-poppins text-neutral-100 transition hover:bg-neutral-700">Orders</NavLink>
                    </div>
                    <div className='w-full h-fit flex justify-center items-center gap-2 p-2 cursor-pointer transition hover:bg-neutral-700 rounded-b-md'>
                        <span className='text-neutral-100 text-xl'>
                            <IoIosLogOut />
                        </span>
                        <NavLink onClick={() => { logoutUser() }} className="font-poppins text-neutral-100 transition hover:bg-neutral-700">Logout</NavLink>
                    </div>
                </div>
            )}
        </>
    )
}

export default Navbar
