import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { GlobalContext } from '../context/GlobalContext';

const Message = ({ mode }) => {

    let { message } = useContext(GlobalContext);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const baseClasses = `fixed top-14 left-4 w-fit h-10 text-center py-2 px-4 rounded shadow-lg z-50 transform transition-transform duration-500 ease-in-out ${
        mounted ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
    }`;
    
    const modeStyles = {
        success: 'bg-emerald-500 shadow-emerald-700',
        failure: 'bg-rose-500 shadow-rose-700',
        notice: 'bg-neutral-700 shadow-neutral-700',
    };

    return (
    <div className={`${baseClasses} ${modeStyles[mode] || ''}`}>
        <p className="font-poppins font-semibold text-white">{message}</p>
    </div>
    );
}

export default Message
