import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { GlobalContext } from '../context/GlobalContext';

const NoticeMessage = () => {

    let { noticeMessage } = useContext(GlobalContext);

    return (
        <div className='absolute top-14 left-4 w-fit h-10 text-center bg-neutral-800 rounded shadow-md z-50 transition duration-300 ease-out'>
            <p className='p-2 text-white'>{noticeMessage}</p>
        </div>
    )
}

export default NoticeMessage