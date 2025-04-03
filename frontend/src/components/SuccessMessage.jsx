import React from 'react'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext';

const SuccessMessage = () => {

    let {successMessage} = useContext(AuthContext)
    
    if (successMessage === "") return null;

    return (
        <div className='absolute top-14 left-4 w-fit h-10 text-center bg-green-500 rounded shadow-md z-50'>
            <p className='p-2 text-neutral-800'>{successMessage}</p>
        </div>
    )
}

export default SuccessMessage
