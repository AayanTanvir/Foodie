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
    } else if (!user) {
      verifyEmailElement = <></>;
    }

    return (
      <div className='w-full h-12 bg-gray-700 flex flex-row justify-center text-center p-3 fixed top-0 left-0 gap-4
                      text-gray-50 z-50'>

        <Link to='/'>Home</Link>
        {user ? <a className='hover:cursor-pointer' onClick={logoutUser}>Logout</a> : <Link to='/login'>Login</Link>}
        {!user ? <Link to='/signup'>Signup</Link> : <></>}
        {verifyEmailElement}
      </div>
    )
}

export default Navbar
