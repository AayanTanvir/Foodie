import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import shopping_bag from '../assets/shopping_bag.svg';
import disabled_shopping_bag from '../assets/disabled_shopping_bag.svg';
import menu from '../assets/menu.svg';
import logout from '../assets/logout.svg';
import orders from '../assets/orders.svg';
import profile from '../assets/profile.svg';
import restaurant_manager from '../assets/restaurant_manager.svg';

const Navbar = () => {

    let { user, logoutUser } = useContext(AuthContext);
    let { isCartEmpty, cartItems } = useContext(CartContext);
    const cartCount = cartItems.length
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const navigate = useNavigate();

    return (
        <>
            <div className='w-full h-12 bg-neutral-800 flex justify-between items-center fixed top-0 left-0 px-8 text-neutral-100 z-50'>
                {user ? (
                    <NavLink to='/' className='font-poppins font-extrabold tracking-wider h-full w-fit transition flex justify-center items-center px-3 cursor-pointer'>Food<span className='text-neutral-400'>ie</span></NavLink>
                ) : (
                    <a className='font-poppins font-extrabold tracking-wider h-full w-fit transition flex justify-center items-center px-3 cursor-default'>Food<span className='text-neutral-400'>ie</span></a>
                )}
                <div className='flex justify-center items-center h-full'>
                    {user ? (
                        <>
                            {isCartEmpty ? (
                                <a className='relative w-fit h-full px-2 bg-neutral-800 flex justify-center items-center transition cursor-not-allowed'>
                                    <img src={disabled_shopping_bag} alt="Cart" className='w-6'/>
                                </a>
                            ) : (
                                <NavLink to="/cart" className={({ isActive }) =>
                                        `relative w-fit h-full px-2 hover:bg-neutral-700
                                        flex justify-center items-center transition
                                        ${isActive && 'bg-neutral-700'}`}>

                                    <img src={shopping_bag} alt="Cart" className='w-6'/>
                                    {!isCartEmpty && (
                                        <div className="w-[0.9rem] h-[0.9rem] rounded-full bg-neutral-100 absolute
                                            top-[15%] right-1 flex justify-center items-center">
                                            <div className='text-center rounded-full flex justify-center items-center'>
                                                <p className='font-poppins text-neutral-800 text-[0.8rem]'>{cartCount}</p>
                                            </div>
                                        </div>
                                    )}
                                </NavLink>
                            )}
                            {user.groups.includes("restaurant owner") && (
                                <NavLink to="/restaurant-owner/dashboard" className={({ isActive }) => `h-full w-fit flex justify-center items-center px-3 transition hover:bg-neutral-700 ${isActive && 'bg-neutral-700'} cursor-pointer`}>
                                    <img src={restaurant_manager} alt="Manager" className='w-5' />
                                </NavLink>
                            )}
                            <a onMouseEnter={() => { setShowProfileDropdown(true) }} className={`h-full w-fit transition ${showProfileDropdown && 'bg-neutral-700'} flex justify-center items-center px-3 cursor-pointer`}>
                                <img src={menu} alt="Menu" className='w-5'/>
                            </a>
                        </>
                    ) : (
                        <>
                            <NavLink className={({ isActive }) => `font-poppins h-full w-fit transition hover:bg-neutral-700 ${isActive && 'bg-neutral-700'} flex justify-center items-center px-3 cursor-pointer`} to='/login'>Login</NavLink>
                            <NavLink className={({ isActive }) => `font-poppins h-full w-fit transition hover:bg-neutral-700 ${isActive && 'bg-neutral-700'} flex justify-center items-center px-3 cursor-pointer`} to='/signup'>Signup</NavLink>
                        </>
                    )}
                </div>
            </div>
            {showProfileDropdown && (
                <div onMouseLeave={() => { setShowProfileDropdown(false) }} className='fixed right-8 z-50 top-12 w-32 h-fit bg-neutral-800 flex flex-col justify-start items-center rounded-b-md'>
                    <div className='w-full h-fit flex justify-center items-center gap-2 p-2 cursor-pointer transition hover:bg-neutral-700'>
                        <img src={profile} className='w-5 h-5' />
                        <NavLink to={`/u/${user.uuid}`} className="font-poppins text-neutral-100 transition hover:bg-neutral-700">Profile</NavLink>
                    </div>
                    <div className='w-full h-fit flex justify-center items-center gap-2 p-2 cursor-pointer transition hover:bg-neutral-700'>
                        <img src={orders} className='w-5 h-5' />
                        <NavLink to={`/u/${user.uuid}/orders`} className="font-poppins text-neutral-100 transition hover:bg-neutral-700">Orders</NavLink>
                    </div>
                    <div className='w-full h-fit flex justify-center items-center gap-2 p-2 cursor-pointer transition hover:bg-neutral-700 rounded-b-md'>
                        <img src={logout} className='w-5 h-5' />
                        <NavLink onClick={() => { logoutUser() }} className="font-poppins text-neutral-100 transition hover:bg-neutral-700">Logout</NavLink>
                    </div>
                </div>
            )}
        </>
    )
}

export default Navbar
