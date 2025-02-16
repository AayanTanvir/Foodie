import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const Navbar = () => {

    const {user, logoutUser} = useContext(AuthContext)

    return (
      <div className='w-full h-12 bg-gray-700 flex flex-row justify-center text-center p-3 fixed top-0 left-0 gap-4
                      text-gray-50 z-50'>

        <Link to='/'>Home</Link>
        {user ? <Link onClick={logoutUser}>Logout</Link> : <Link to='/login'>Login</Link>}
        {!user ? <Link to='/signup'>Signup</Link> : <></>}
      </div>
    )
}

export default Navbar
