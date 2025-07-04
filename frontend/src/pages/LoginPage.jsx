import React, { useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const LoginPage = () => {

    const {loginUser, authError, user} = useContext(AuthContext);
    let navigate = useNavigate()

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    return (
        <div className="absolute top-0 left-0 w-full h-screen flex items-center justify-center flex-col">
            <div className='absolute -top-12 left-16 bg-neutral-800 w-0 md:w-16 h-[30rem] rotate-[40deg]' />
            <div className='absolute -top-12 left-0 bg-neutral-800 w-0 md:w-4 h-[30rem] rotate-[40deg]' />
            <div className='w-1/4 h-fit'>
                <h1 className='mb-6 text-4xl font-notoserif text-neutral-800 font-medium text-left cursor-default'>Login</h1>
            </div>
            <form onSubmit={loginUser} className="relative w-1/4 border-0 rounded flex flex-col items-start gap-4">
            <input type="email" name="email" placeholder="Email" className="p-2 border w-full outline-none transition-all duration-200 ease-in hover:border-neutral-500 font-hedwig" required/>
            <input type="password" name="password" placeholder="Password" className="p-2 border w-full outline-none transition-all duration-200 ease-in hover:border-neutral-500 font-hedwig" required/>
            <div className='w-full h-fit flex justify-between items-center mb-4'>
                <Link className='text-sm text-neutral-500 border border-neutral-300 px-2 py-1 transition duration-150 ease-in hover:border-neutral-400 hover:text-neutral-600 font-hedwig' to='/reset-password'>Forgot Password</Link>
                <Link to='/signup' className='text-neutral-500 text-sm font-hedwig px-2 py-1 border border-neutral-300 transition duration-150 ease-in hover:border-neutral-400 hover:text-neutral-600'>Signup</Link>
            </div>
            <input type="submit" className="p-2 bg-neutral-800 text-white w-full cursor-pointer font-hedwig"/>
            <p className='text-red-600'>{authError}</p>
            </form>
        </div>
    );
};

export default LoginPage;
