import React, { useContext } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import { jwtDecode } from "jwt-decode"


const PasswordResetNewPasswordPage = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const {setSuccessMessage, authError, setAuthError} = useContext(AuthContext);
    let token = searchParams.get('token');
    let navigate = useNavigate();

    let submitNewPassword = async (event) => {
        event.preventDefault()

        if (event.target.password1.value !== event.target.password2.value) {
            alert("Passwords do not match")
        } else {
            try {
                const response = await fetch('http://localhost:8000/password-reset-confirm/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        token: token,
                        password: event.target.password1.value,
                    })
                })
                const data = await response.json();
                
                if (response.ok) {
                    navigate('/login');
                    setSuccessMessage("Password reset successfully.");
                } else {
                    setAuthError(data.error);
                    setTimeout(() => navigate('/'), 3000);
                }
            } 
            catch (error) {
                console.log(error);
            }
        }

    } 

    return (
        <div className="absolute top-0 left-0 w-full h-screen flex items-center justify-center flex-col">
        <h1 className='mb-6 text-2xl text-gray-700 font-medium'>Enter New Password</h1>
        <form onSubmit={submitNewPassword} className="w-1/4 bg-slate-100 border-0 rounded flex flex-col items-center p-6 gap-4">
            <input type="password" name="password1" placeholder="New Password" className="p-2 border rounded w-full"/>
            <input type="password" name="password2" placeholder="Confirm New Password" className="p-2 border rounded w-full"/>
            <input type="submit" className="p-2 bg-blue-400 text-white rounded w-full cursor-pointer"/>
            <p className='text-red-600'>{authError}</p>
        </form>
        </div>
    )
}

export default PasswordResetNewPasswordPage
