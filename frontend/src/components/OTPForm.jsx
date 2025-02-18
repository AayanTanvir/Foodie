import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext';
import close from '../assets/close.svg';

const OTPForm = () => {

    let {showOTPForm, setShowOTPForm, authError, submitVerifyEmailOTP} = useContext(AuthContext);

    if (showOTPForm == false) return null;

    if (showOTPForm == true) {
        return (
          <div className="absolute top-0 left-0 w-full h-screen flex items-center justify-center flex-col bg-black/50">
            <h1 className='mb-6 text-2xl text-zinc-50 font-medium'>Enter Your OTP</h1>
            <form onSubmit={submitVerifyEmailOTP} className="w-1/4 relative bg-slate-100 border-0 rounded flex flex-col items-center p-6 pt-12 gap-4">
              <a onClick={() => setShowOTPForm(false)} className='absolute left-2 top-2 hover:cursor-pointer'><img src={close} alt='close'/></a>
              <input type="text" name="otp" placeholder="OTP" className="p-2 border rounded w-full"/>
              <input type="submit" className="p-2 bg-blue-400 text-white rounded w-full cursor-pointer"/>
              <p className='text-red-600'>{authError}</p>
            </form>
          </div>
        )
    }
}

export default OTPForm
