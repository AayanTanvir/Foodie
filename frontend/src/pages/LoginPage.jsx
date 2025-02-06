import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext';

const LoginPage = () => {

  const {loginUser} = useContext(AuthContext)

  return (
    <div className="absolute top-0 left-0 w-full h-screen flex items-center justify-center flex-col">
      <h1 className='mb-6 text-2xl text-gray-700 font-medium'>Login To Your Account</h1>
      <form onSubmit={loginUser} className="w-1/4 h-2/5 bg-slate-100 border-0 rounded flex flex-col items-center p-6 gap-4">
        <input type="text" name="username" placeholder="Username" className="p-2 border rounded w-full"/>
        <input type="password" name="password" placeholder="Password" className="p-2 border rounded w-full"/>
        <input type="submit" className="p-2 bg-blue-400 text-white rounded w-full cursor-pointer"/>
        <p className='mt-8'>Already have an account? <Link to='/' className='text-blue-400'>Sign Up!</Link></p>
      </form>
    </div>
  );
};

export default LoginPage;
