import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const Navbar = () => {

    let {user, logoutUser, verifyEmail} = useContext(AuthContext);
    let verifyEmailElement = null;

    if (user && !user.is_email_verified) {
      verifyEmailElement = (
        <a className='hover:cursor-pointer' onClick={() => verifyEmail("send")}>Verify Email</a>
      );
    } else {
      verifyEmailElement = <></>;
    }

    return (
      <div className='w-full h-12 bg-neutral-800 flex flex-row justify-evenly text-center p-3 fixed top-0 left-0 gap-4
                      text-gray-50 z-50'>

        <Link to='/' className='font-poppins font-normal transition hover:text-gray-300'>Home</Link>
        <div className='font-poppins font-normal'>
          {user ? <a className='hover:cursor-pointer mx-5 transition hover:text-gray-300' onClick={logoutUser}>Logout</a> : <Link className='hover:cursor-pointer mx-5 transition hover:text-gray-300' to='/login'>Login</Link>}
          {!user ? <Link className='hover:cursor-pointer mx-5 transition hover:text-gray-300' to='/signup'>Signup</Link> : <></>}
          {verifyEmailElement}
        </div>
      </div>
    )
}

export default Navbar
