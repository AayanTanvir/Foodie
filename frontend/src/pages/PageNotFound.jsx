import React, { useEffect } from 'react'

const PageNotFound = () => {

    useEffect(() => {
        const timer = setTimeout(() => {
            window.location.href = "/";
        }, 1500);

        return () => clearTimeout(timer);
    }, [])

    return (
        <div className='w-full h-full absolute top-0 left-0 text-center flex justify-center items-center'>
            <h1 className='font-poppins font-semibold text-3xl text-center text-neutral-800'>404 Page Not Found...</h1>
        </div>
    )
}

export default PageNotFound
