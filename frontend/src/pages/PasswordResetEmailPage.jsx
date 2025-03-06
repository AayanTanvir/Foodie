import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import { useNavigate } from 'react-router-dom';

const PasswordResetEmailPage = () => {

    let {authError, setFailureMessage, user, setAuthError} = useContext(AuthContext);
    let navigate = useNavigate();

    if (user) {
        navigate('/');
    }

    let submitEmail = async (event) => {
        event.preventDefault();

        if (!event.target.email.value) {
            setAuthError("Please enter your Email");
        } else {
            let response = await fetch("http://localhost:8000/password-reset/", {
                method:"POST",
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({'email':event.target.email.value}),
            })
            let data = await response.json();
            if (response.status === 200) {
                navigate("/");
                setNoticeMessage("Check your email for a password reset link.");
            } else if (response.status === 500) {
                setFailureMessage("Internal Server Error 500");
            } else {
                setFailureMessage(data?.email);           
            }
        }

    }

    return (
        <div className="absolute top-0 left-0 w-full h-screen flex items-center justify-center flex-col">
          <h1 className='mb-6 text-2xl text-gray-700 font-medium'>Enter Your Email</h1>
          <form onSubmit={submitEmail} className="w-1/4 bg-slate-100 border-0 rounded flex flex-col items-center p-6 gap-4">
              <input type="email" name="email" placeholder="Email" className="p-2 border rounded w-full"/>
              <input type="submit" className="p-2 bg-blue-400 text-white rounded w-full cursor-pointer"/>
              <p className='text-red-600'>{authError}</p>
          </form>
        </div>
    )
}

export default PasswordResetEmailPage
