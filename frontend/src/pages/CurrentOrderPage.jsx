import React, { useContext, useEffect } from 'react'
import { GlobalContext } from '../context/GlobalContext'
import { useParams } from 'react-router-dom';

const CurrentOrderPage = () => {
    const { currentOrder } = useContext(GlobalContext);
    let { order_uuid } = useParams();

    useEffect(() => {
        if (currentOrder.uuid !== order_uuid) {
            window.location.href = '/';
        }
    }, [order_uuid])

    return (
        <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center pt-12 mb-4'>
            <div className='w-4/5 h-4/5 rounded-md border-[1.75px] border-neutral-300 flex flex-col justify-start items-start'>
                <div className='w-full h-fit flex justify-center items-center px-6 py-2 gap-4'>
                    <div className='flex-1 h-0 border-b-[1px] border-neutral-400'></div>
                    <h1 className='cursor-default font-notoserif text-3xl text-neutral-800 '>Order</h1>
                    <div className='flex-1 h-0 border-b-[1px] border-neutral-400'></div>
                </div>
                <div className='w-full h-full flex-1 grid grid-rows-8 grid-cols-10 px-5 pb-5'>
                    <div className='rounded-md row-start-1 row-end-4 col-start-1 col-end-7'>
                        
                    </div>
                    <div className='rounded-md row-start-5 row-end-9 col-start-1 col-end-7'>

                    </div>
                    <div className='rounded-md row-start-1 row-end-9 col-start-8 col-end-11'>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default CurrentOrderPage
