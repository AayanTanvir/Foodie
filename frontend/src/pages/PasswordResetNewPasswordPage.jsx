import React, { useContext } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import axiosClient from '../utils/axiosClient';
import { GlobalContext } from '../context/GlobalContext';
import { sendRequest, validateCredentials } from '../utils/Utils';


const PasswordResetNewPasswordPage = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const { authError, setAuthError } = useContext(AuthContext);
    let { setMessageAndMode } = useContext(GlobalContext);
    let token = searchParams.get('token');
    let navigate = useNavigate();

    let submitNewPassword = async (event) => {
        event.preventDefault()

        if (!event.target.password1.value || !event.target.password2.value) {
            setAuthError("Please fill all fields");
            return
        } else if (!validateCredentials(event.target.password1.value, event.target.password2.value)) {
            return
        }

        const res = await sendRequest({
            method: "post",
            to: "/password-reset/confirm/",
            postData: {
                token: token,
                password: event.target.password.value
            }
        });

        if (res.status === 200) {
            setMessageAndMode("Password reset successfully", "success");
            navigate("/login");
        } else {
            setMessageAndMode("An error occurred.", "failure");
            navigate("/login");
        }

        // try {
        //     const response = await axiosClient.post('/password-reset/confirm/', {
        //         token: token,
        //         password: event.target.password1.value,
        //     });

        //     if (response.status === 200) {
        //         navigate('/login');
        //         setMessageAndMode("Password reset successfully", "success");
        //     } else {
        //         navigate('/login');
        //         setNoticeMessage("Unexpected response from server.", response.status);
        //     }

        // } catch (error) {
        //     const data = error.response?.data;
        //     const status = error.response?.status;
        //     setFailureMessage(data || "Something went wrong. Try again", status);
        //     navigate('/login');
        // }
            

    } 

    return (
        <div className="absolute top-0 left-0 w-full h-screen flex items-center justify-center flex-col">
            <div className='w-1/4 h-fit'>
                <h1 className='mb-6 text-3xl text-neutral-800 font-notoserif font-medium'>New Password</h1>
            </div>
            <form onSubmit={submitNewPassword} className="w-1/4 border-0 rounded flex flex-col items-start gap-4">
                <input type="password" name="password1" placeholder="New Password" className="p-2 border w-full outline-none transition-all duration-200 ease-in hover:border-neutral-500 font-hedwig" required/>
                <input type="password" name="password2" placeholder="Confirm New Password" className="p-2 border w-full outline-none transition-all duration-200 ease-in hover:border-neutral-500 font-hedwig" required/>
                <input type="submit" className="p-2 mt-2 bg-neutral-800 text-neutral-100 w-full cursor-pointer"/>
                <p className='text-red-600'>{authError}</p>
            </form>
        </div>
    )
}

export default PasswordResetNewPasswordPage
