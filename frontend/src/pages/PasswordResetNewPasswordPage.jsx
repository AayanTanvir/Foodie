import React, { useContext } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import axiosClient from '../utils/axiosClient';


const PasswordResetNewPasswordPage = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const {setSuccessMessage, authError, setAuthError, validateCredentials} = useContext(AuthContext);
    let token = searchParams.get('token');
    let navigate = useNavigate();

    let submitNewPassword = async (event) => {
        event.preventDefault()

        if (!event.target.password1.value || !event.target.password2.value) {
            setAuthError("Please fill all fields");
        } 
        else if (validateCredentials(event.target.password1.value, event.target.password2.value)) {
            try {
                const response = await axiosClient.post('/password-reset/confirm/', {
                    token: token,
                    password: event.target.password1.value,
                });

                if (response.status === 200) {
                    navigate('/login');
                    setSuccessMessage("Password reset successfully");
                } else {
                    navigate('/login');
                    setNoticeMessage("Unexpected response from server.", response.status);
                }

            } catch (error) {
                const data = error.response?.data;
                const status = error.response?.status;
                setFailureMessage(data || "Something went wrong. Try again", status);
                navigate('/login');
            }
        }
            

    } 

    return (
        <div className="absolute top-0 left-0 w-full h-screen flex items-center justify-center flex-col">
        <h1 className='mb-6 text-2xl text-neutral-800 font-medium'>Enter New Password</h1>
        <form onSubmit={submitNewPassword} className="w-1/4 bg-neutral-100 border-0 rounded flex flex-col items-center p-6 gap-4">
            <input type="password" name="password1" placeholder="New Password" className="p-2 border rounded w-full outline-none"/>
            <input type="password" name="password2" placeholder="Confirm New Password" className="p-2 border rounded w-full outline-none"/>
            <input type="submit" className="p-2 bg-neutral-800 text-white w-full cursor-pointer"/>
            <p className='text-red-600'>{authError}</p>
        </form>
        </div>
    )
}

export default PasswordResetNewPasswordPage
