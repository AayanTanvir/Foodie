import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import CartContext from '../context/CartContext';
import cart_svg from '../assets/cart.svg';

const Navbar = () => {

    let {user, logoutUser, verifyEmail} = useContext(AuthContext);
    let {isCartEmpty} = useContext(CartContext);

    //verify email: <a className='hover:cursor-pointer transition hover:text-gray-300' onClick={() => verifyEmail("send")}>Verify Email</a>


    return (
        <div className='w-full h-12 bg-neutral-800 flex flex-row justify-evenly text-center fixed top-0 left-0 gap-4 text-gray-50 z-50'>
            <div className='font-poppins font-normal flex flex-row justify-center items-center h-full'>
                <Link to='/' className='transition hover:text-gray-300'>Home</Link>
            </div>
            <div className='font-poppins font-normal flex flex-row justify-center items-center h-full'>
                <Link to="/cart" className='relative w-fit h-full p-1 bg-neutral-800 flex justify-center items-center transition hover:bg-neutral-900'>
                    <img src={cart_svg} alt="Cart" className='w-6'/>
                    {!isCartEmpty && (
                        <div className='w-2 h-2 rounded-full bg-red-500 absolute top-[25%] right-[15%] flex justify-center items-center'>
                            <div className='w-[0.3rem] h-[0.28rem] rounded-full bg-white '></div>
                        </div>
                    )}
                </Link>
                {user ? <a className='hover:cursor-pointer mx-5 transition hover:text-gray-300' onClick={logoutUser}>Logout</a> : <Link className='hover:cursor-pointer mx-5 transition hover:text-gray-300' to='/login'>Login</Link>}
                {!user ? <Link className='hover:cursor-pointer mx-5 transition hover:text-gray-300' to='/signup'>Signup</Link> : <></>}
            </div>
        </div>
    )
}

export default Navbar
