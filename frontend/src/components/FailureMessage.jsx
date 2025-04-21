import React from 'react'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext';

const SuccessMessage = () => {

    let { failureMessage } = useContext(AuthContext)

    return (
        <div className='absolute top-14 left-4 w-fit h-10 text-center bg-red-500 rounded shadow-md z-50'>
            <p className='p-2 text-white'>{failureMessage}</p>
        </div>
    )
}

export default SuccessMessage