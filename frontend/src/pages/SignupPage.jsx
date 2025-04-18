import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const SignupPage = () => {

    const {signupUser, user, authError} = useContext(AuthContext)
    let navigate = useNavigate()

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    return (
      <div className="absolute top-0 left-0 w-full h-screen flex items-center justify-center flex-col">
        <h1 className='mb-6 text-2xl text-neutral-800 font-medium'>Signup</h1>
        <form onSubmit={signupUser} className="w-1/4 bg-slate-100 border-0 rounded flex flex-col items-center p-6 gap-4">
          <input type="email" name="email" placeholder="Email" className="p-2 border rounded w-full"/>
          <input type="text" name="username" placeholder="Username" className="p-2 border rounded w-full"/>
          <input type="password" name="password1" placeholder="Password" className="p-2 border rounded w-full"/>
          <input type="password" name="password2" placeholder="Confirm Password" className="p-2 border rounded w-full"/>
          <input type="submit" className="p-2 bg-blue-400 text-white rounded w-full cursor-pointer"/>
          <p className='text-red-600'>{authError}</p>
          <p className='mt-8 text-neutral-800'>Already have an account? <Link to='/login' className='text-blue-400'>Login!</Link></p>
        </form>
      </div>
    );
};

export default SignupPage;

