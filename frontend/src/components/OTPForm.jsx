import React, { useContext, useState } from 'react'
import AuthContext from '../context/AuthContext';

const OTPForm = () => {

    let {showOTPForm, authError, submitVerifyEmailOTP, verifyEmail} = useContext(AuthContext);
    let [canResendOTP, setCanResendOTP] = useState(false);
    let [disableResendOTP, setDisableResendOTP] = useState(false);
    let resendOTP = null;

    const timer_for_resend = 60000;
    let timeout = setTimeout(() => {
      clearTimeout(timeout);
      setCanResendOTP(true);
    }, timer_for_resend);

    if (canResendOTP && !disableResendOTP) {
      resendOTP = (
        <a onClick={() => {verifyEmail("resend"); setCanResendOTP(false); setDisableResendOTP(true)} } className='mt-8 text-blue-400 hover:cursor-pointer'>Resend OTP</a>
      );
    } else if (!canResendOTP && !disableResendOTP) {
      resendOTP = (
        <p className='mt-8 text-blue-400'>Resend OTP in a minute</p>
      );
    } else if (disableResendOTP) {
      resendOTP = null;
    }

    if (showOTPForm == false) return null;

    if (showOTPForm == true) {
        return (
          <div className="absolute top-0 left-0 w-full h-screen flex items-center justify-center flex-col bg-black/50">
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
