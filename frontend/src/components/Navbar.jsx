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
import { GlobalContext } from '../context/GlobalContext';

const Navbar = () => {

    const { user } = useContext(AuthContext);
    const { isCartEmpty } = useContext(CartContext);
    const { setShowSidebar } = useContext(GlobalContext);

    return (
        <>
            {user ? (
                <div className='w-full h-12 border-b-[1px] border-neutral-800 bg-white flex justify-between items-center fixed top-0 left-0 px-8 text-neutral-100 z-50'>
                    <div className='flex justify-center items-center h-full'>
                        <a onClick={() => { setShowSidebar(true) }} className={`h-full w-fit flex justify-center items-center px-3 cursor-pointer`}>
                            <span className='text-neutral-800 text-xl cursor-pointer'>
                                <IoIosMenu />
                            </span>
                        </a>
                        {isCartEmpty ? (
                            <a className='relative w-fit h-full px-3 flex justify-center items-center transition cursor-not-allowed'>
                                <span className='text-neutral-300 text-2xl'><PiShoppingCartSimpleThin /></span>
                            </a>
                        ) : (
                            <NavLink to="/cart" className={({ isActive }) =>
                                `relative w-fit h-full px-3
                                flex justify-center items-center transition cursor-pointer
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
                    </div>
                    <NavLink to='/' className='font-poppins text-xl font-extrabold tracking-tight h-full w-fit transition flex justify-center items-center px-3 cursor-pointer text-neutral-800 select-none'>Food<span className='text-neutral-500'>ie</span></NavLink>
                </div>
            ) : (
                <div className='w-full h-12 border-b-[1px] border-neutral-800 bg-white flex justify-between items-center fixed top-0 left-0 px-8 text-neutral-100 z-50'>
                    <a className='font-poppins text-xl font-extrabold tracking-tight h-full w-fit transition flex justify-center items-center px-3 cursor-default text-neutral-800'>Food<span className='text-neutral-500'>ie</span></a>
                    <div className='flex justify-center items-center h-full gap-4 w-fit'>
                        <NavLink className={({ isActive }) => `relative py-[2px] font-poppins text-neutral-800 text-md after:content-[''] after:absolute after:bottom-0 after:left-0 after:rounded-md after:bg-neutral-800 after:h-[1px] after:transition-all after:ease-in-out after:duration-300 hover:after:w-full ${isActive ? 'after:w-full' : 'after:w-0'} `} to='/login'>Login</NavLink>
                        <NavLink className={({ isActive }) => `relative py-[2px] font-poppins text-neutral-800 text-md after:content-[''] after:absolute after:bottom-0 after:left-0 after:rounded-md after:bg-neutral-800 after:h-[1px] after:transition-all after:ease-in-out after:duration-300 hover:after:w-full ${isActive ? 'after:w-full' : 'after:w-0'}`} to='/signup'>Signup</NavLink>
                    </div>
                </div>
            )}
        </>
    )
}

export default Navbar
