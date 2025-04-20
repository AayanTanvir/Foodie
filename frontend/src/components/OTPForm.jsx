import React, { useContext, useState } from 'react'
import AuthContext from '../context/AuthContext';

const OTPForm = () => {

    let {
      showOTPForm, 
      authError, 
      submitVerifyEmailOTP, 
      verifyEmail, 
      canResendOTP, 
      setCanResendOTP,
      setShowOTPForm,
    } = useContext(AuthContext);

    let resendOTP = canResendOTP ? <a onClick={() => {verifyEmail("resend"); setCanResendOTP(null);} } className='mt-6 text-blue-400 hover:cursor-pointer'>Resend OTP</a> : (<p className='mt-6 text-blue-400'>Resend OTP in a minute</p>);


    if (canResendOTP == null) {
      resendOTP = (
        <a onClick={() => setShowOTPForm(false)} className='mt-6 text-blue-400 hover:cursor-pointer'>Exit</a>
      );
    }

    if (showOTPForm == false) return null;

    if (showOTPForm == true) {
        return (
          <div className="fixed z-50 top-0 left-0 w-full h-screen flex items-center justify-center flex-col bg-black/50">
            <h1 className='mb-6 text-2xl text-zinc-50 font-medium'>Enter Your OTP</h1>
            <form onSubmit={submitVerifyEmailOTP} className="w-1/4 relative bg-slate-100 border-0 rounded flex flex-col items-center p-6 pt-12 gap-4">
              <input type="text" name="otp" placeholder="OTP" className="p-2 border rounded w-full"/>
              <input type="submit" className="p-2 bg-blue-400 text-white rounded w-full cursor-pointer"/>
              <p className='text-red-600'>{authError}</p>
              {resendOTP}
            </form>
          </div>
        )
    }
}

export default OTPForm
