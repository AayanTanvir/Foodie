import React, { useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../utils/axiosClient';
import { GlobalContext } from '../context/GlobalContext';

const PasswordResetEmailPage = () => {

    let { authError, user, setAuthError } = useContext(AuthContext);
    let { setMessageAndMode } = useContext(GlobalContext);
    let navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    let submitEmail = async (event) => {
        event.preventDefault();

        if (!event.target.email.value) {
            setAuthError("Please enter your Email");
        } else {
            try {
                const response = await axiosClient.post("/password-reset/", {
                    email:event.target.email.value
                });

                if (response.status === 200) {
                    navigate('/login');
                    setMessageAndMode("Password reset link sent to email. You can close this page", "notice");
                } else {
                    navigate('/login');
                    setMessageAndMode("Unexpected response from server.", "failure");
                }
            } catch (error) {
                console.error(error)
                setMessageAndMode("Something went wrong. Try again", "failure");
                navigate('/login');
            }
        }

    }

    return (
        <div className="absolute top-0 left-0 w-full h-screen flex items-center justify-center flex-col">
            <div className='w-1/4 h-fit'>
                <h1 className='mb-6 text-3xl text-neutral-800 font-medium font-notoserif'>Reset Password</h1>
            </div>
            <form onSubmit={submitEmail} className="w-1/4 border-0 rounded flex flex-col items-start gap-4">
                <input type="email" name="email" placeholder="Email" className="p-2 border w-full outline-none transition-all duration-200 ease-in hover:border-neutral-500 font-hedwig" required/>
                <input type="submit" className="p-2 mt-2 bg-neutral-800 text-neutral-100 w-full cursor-pointer"/>
                <p className='text-red-600'>{authError}</p>
            </form>
        </div>
    )
}

export default PasswordResetEmailPage
