import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const SignupPage = () => {

    const { signupUser, user, authError } = useContext(AuthContext)
    let navigate = useNavigate()

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    return (
      <div className="absolute top-0 left-0 w-full h-screen flex items-center justify-center flex-col">
        <div className='w-1/4 h-fit'>
            <h1 className='mb-6 text-4xl font-notoserif text-neutral-800 font-medium text-left cursor-default'>Signup</h1>
        </div>
        <form onSubmit={signupUser} className="w-1/4 border-0 rounded flex flex-col items-start gap-4">
          <input type="email" name="email" placeholder="Email" className="p-2 border w-full outline-none transition-all duration-200 ease-in hover:border-neutral-500 font-hedwig" required/>
          <input type="text" name="username" placeholder="Username" className="p-2 border w-full outline-none transition-all duration-200 ease-in hover:border-neutral-500 font-hedwig" required/>
          <input type="password" name="password1" placeholder="Password" className="p-2 border w-full outline-none transition-all duration-200 ease-in hover:border-neutral-500 font-hedwig" required/>
          <input type="password" name="password2" placeholder="Confirm Password" className="p-2 border w-full outline-none transition-all duration-200 ease-in hover:border-neutral-500 font-hedwig" required/>
          <input type="submit" className="p-2 mt-4 bg-neutral-800 text-neutral-100 w-full cursor-pointer font-hedwig"/>
          <p className='text-red-600'>{authError}</p>
        </form>
      </div>
    );
};

export default SignupPage;

