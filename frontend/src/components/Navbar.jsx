import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import { CartContext } from '../context/CartContext';
import shopping_bag from '../assets/shopping_bag.svg';
import disabled_shopping_bag from '../assets/disabled_shopping_bag.svg';

const Navbar = () => {

    let {user, logoutUser, verifyEmail} = useContext(AuthContext);
    let { isCartEmpty, cartItems } = useContext(CartContext);
    const cartCount = cartItems.length

    //verify email: <a className='hover:cursor-pointer transition hover:text-gray-300' onClick={() => verifyEmail("send")}>Verify Email</a>

    const getPageNavLinkClass = (isActive) => {
        return [
          'relative transition hover:text-gray-300 cursor-pointer group',
          'after:content-[""] after:absolute after:bottom-0 after:left-0',
          'after:h-1 after:bg-gray-300 after:transition-all after:duration-300',
          isActive ? 'text-gray-300 after:w-full' : 'after:w-0 hover:after:w-full',
        ].join(' ');
      };

    return (
        <div className='w-full h-12 bg-neutral-800 flex flex-row justify-evenly text-center fixed top-0 left-0 gap-4 text-gray-50 z-50'>
            <div className='font-poppins font-normal flex flex-row justify-center items-center h-full'>
                <NavLink to='/' className='transition hover:text-gray-300 cursor-pointer'>Home</NavLink>
            </div>
            <div className='font-poppins font-normal flex flex-row justify-center items-center h-full'>
                {user && (
                    <>
                        {isCartEmpty ? (
                            <a className='relative w-fit h-full px-1 bg-neutral-700 flex justify-center items-center transition cursor-not-allowed'>
                                <img src={disabled_shopping_bag} alt="Cart" className='w-6'/>
                            </a>
                        ) : (
                            <NavLink to="/cart" className={({ isActive }) =>
                                    `relative w-fit h-full px-1 bg-neutral-800
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
                    </>
                )}
                {user ? <NavLink className='cursor-pointer mx-5 transition hover:text-gray-300 after:bg-gray-300;w-2' onClick={logoutUser}>Logout</NavLink> : <NavLink className='hover:cursor-pointer mx-5 transition hover:text-gray-300' to='/login'>Login</NavLink>}
                {!user ? <NavLink className='cursor-pointer mx-5 transition hover:text-gray-300' to='/signup'>Signup</NavLink> : <></>}
            </div>
        </div>
    )
}

export default Navbar
