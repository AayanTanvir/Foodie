import React, { useContext, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import { CartContext } from '../context/CartContext';
import shopping_bag from '../assets/shopping_bag.svg';
import disabled_shopping_bag from '../assets/disabled_shopping_bag.svg';

const Navbar = () => {

    let {user, logoutUser, verifyEmail} = useContext(AuthContext);
    let { isCartEmpty, cartItems } = useContext(CartContext);
    const cartCount = cartItems.length
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);

    //verify email: <a className='hover:cursor-pointer transition hover:text-gray-300' onClick={() => verifyEmail("send")}>Verify Email</a>

    return (
        <>
            <div className='w-full h-12 bg-neutral-800 flex justify-between items-center fixed top-0 left-0 px-8 text-neutral-100 z-50'>
                {user ? (
                    <NavLink to='/' className='font-poppins font-extrabold tracking-wider h-full w-fit transition hover:bg-neutral-900 flex justify-center items-center px-3 cursor-pointer'>Food<span className='text-neutral-400'>ie</span></NavLink>
                ) : (
                    <a className='font-poppins font-extrabold tracking-wider h-full w-fit transition flex justify-center items-center px-3 cursor-default'>Food<span className='text-neutral-400'>ie</span></a>
                )}
                <div className='flex justify-center items-center h-full'>
                    {user ? (
                        <>
                            {isCartEmpty ? (
                                <a className='relative w-fit h-full px-2 bg-neutral-700 flex justify-center items-center transition cursor-not-allowed'>
                                    <img src={disabled_shopping_bag} alt="Cart" className='w-6'/>
                                </a>
                            ) : (
                                <NavLink to="/cart" className={({ isActive }) =>
                                        `relative w-fit h-full px-2 bg-neutral-800
                                        flex justify-center items-center transition hover:bg-neutral-900
                                        ${isActive ? 'bg-neutral-900' : ''}`}>

                                    <img src={shopping_bag} alt="Cart" className='w-6'/>
                                    {!isCartEmpty && (
                                        <div className="w-[0.9rem] h-[0.9rem] rounded-full bg-gray-200 absolute
                                            top-[15%] right-0 flex justify-center items-center">
                                            <div className='text-center rounded-full flex justify-center items-center'>
                                                <p className='font-poppins text-neutral-800 text-[0.8rem]'>{cartCount}</p>
                                            </div>
                                        </div>
                                    )}
                                </NavLink>
                            )}
                            <a onMouseEnter={() => { setShowProfileDropdown(true) }} className={`h-full w-fit transition hover:bg-neutral-900 ${showProfileDropdown && 'bg-neutral-900'} flex justify-center items-center px-3 cursor-pointer`}>
                                <div className='w-4 h-4 bg-neutral-200 rounded-full'></div>
                            </a>
                        </>
                    ) : (
                        <>
                            <NavLink className={({ isActive }) => `font-poppins h-full w-fit transition hover:bg-neutral-900 ${isActive && 'bg-neutral-900'} flex justify-center items-center px-3 cursor-pointer`} to='/login'>Login</NavLink>
                            <NavLink className={({ isActive }) => `font-poppins h-full w-fit transition hover:bg-neutral-900 ${isActive && 'bg-neutral-900'} flex justify-center items-center px-3 cursor-pointer`} to='/signup'>Signup</NavLink>
                        </>
                    )}
                </div>
            </div>
            {showProfileDropdown && (
                <div onMouseLeave={() => { setShowProfileDropdown(false) }} className='absolute right-8 z-50 top-12 w-32 h-fit bg-neutral-800 flex flex-col justify-start items-center'>
                    <div className='w-full h-fit flex justify-evenly items-center p-2 cursor-pointer transition hover:bg-neutral-900'>
                        <div className='w-1 h-1 bg-neutral-100 rounded-full'></div>
                        <NavLink className="font-poppins text-neutral-100 transition hover:bg-neutral-900">Profile</NavLink>
                    </div>
                    <div className='w-full h-fit flex justify-evenly items-center p-2 cursor-pointer transition hover:bg-neutral-900'>
                        <div className='w-1 h-1 bg-neutral-100 rounded-full'></div>
                        <NavLink className="font-poppins text-neutral-100 transition hover:bg-neutral-900">Orders</NavLink>
                    </div>
                    <div className='w-full h-fit flex justify-evenly items-center p-2 cursor-pointer transition hover:bg-neutral-900'>
                        <div className='w-1 h-1 bg-neutral-100 rounded-full'></div>
                        <NavLink onClick={() => { logoutUser() }} className="font-poppins text-neutral-100 transition hover:bg-neutral-900">Logout</NavLink>
                    </div>
                </div>
            )}
        </>
    )
}

export default Navbar
