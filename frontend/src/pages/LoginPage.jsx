import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const LoginPage = () => {

    const {loginUser, authError, user} = useContext(AuthContext);
    let navigate = useNavigate()

    if (user) {
        navigate('/');
    }

    return (
      <div className="absolute top-0 left-0 w-full h-screen flex items-center justify-center flex-col">
        <h1 className='mb-6 text-2xl text-gray-700 font-medium'>Login To Your Account</h1>
        <form onSubmit={loginUser} className="relative w-1/4 bg-slate-100 border-0 rounded flex flex-col items-center p-6 gap-4">
          <input type="text" name="email" placeholder="Email" className="p-2 border rounded w-full"/>
          <input type="password" name="password" placeholder="Password" className="p-2 mb-6 border rounded w-full"/>
          <Link className='absolute left-6 top-32 text-sm text-blue-500' to='/reset-password'>Forgot Password</Link>
          <input type="submit" className="p-2 bg-blue-400 text-white rounded w-full cursor-pointer"/>
          <p className='text-red-600'>{authError}</p>
          <p className='mt-8'>Don't have an account? <Link to='/signup' className='text-blue-500'>Signup!</Link></p>
        </form>
      </div>
    );
};

export default LoginPage;
