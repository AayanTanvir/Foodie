import React, { useContext, useState } from 'react'
import AuthContext from '../context/AuthContext';

const OTPForm = () => {

    let {
      authError, 
      submitVerifyEmailOTP, 
      verifyEmail, 
      canResendOTP, 
      setCanResendOTP,
      setShowOTPForm,
    } = useContext(AuthContext);

    let resendOTP = canResendOTP ? <a onClick={() => {verifyEmail("resend"); setCanResendOTP(null);} } className=' text-neutral-100 p-2 bg-neutral-800 hover:cursor-pointer'>Resend OTP</a> : (<p className='mt-6 text-blue-400'>Resend OTP in a minute</p>);


    if (canResendOTP == null) {
      resendOTP = (
        <a onClick={() => setShowOTPForm(false)} className='mt-6 text-blue-400 hover:cursor-pointer'>Exit</a>
      );
    }

    return (
        <div className="fixed z-50 top-0 left-0 w-full h-screen flex items-center justify-center flex-col bg-black/50">
            <form onSubmit={submitVerifyEmailOTP} className="w-1/4 relative border-0 rounded flex flex-col items-start pt-12 gap-4">
                <input type="text" name="otp" placeholder="OTP" className="p-2 border w-full outline-none transition-all duration-200 ease-in hover:border-neutral-500 font-hedwig" required/>
                <input type="submit" className="p-2 bg-neutral-800 text-neutral-100 w-full cursor-pointer"/>
                <p className='text-red-600'>{authError}</p>
                {resendOTP}
            </form>
        </div>
    )

}

export default OTPForm
