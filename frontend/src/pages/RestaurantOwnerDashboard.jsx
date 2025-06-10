import React from 'react'

const RestaurantOwnerDashboard = () => {


    return (
        <div className='absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center mt-12'>
            <div className='w-full h-full flex flex-col justify-start items-center py-4 px-8 overflow-x-hidden'>
                <div className='w-full h-fit flex justify-center items-center gap-4 mb-10'>
                    <div className='flex-1 h-0 border-b-[1px] border-neutral-400'></div>
                    <h1 className='cursor-default font-notoserif text-3xl text-neutral-800 '>Dashboard</h1>
                    <div className='flex-1 h-0 border-b-[1px] border-neutral-400'></div>
                </div>
                <div className='border-[1.5px] border-neutral-400 w-full h-fit rounded-md flex flex-col justify-start items-start'>
                    <div className='w-full h-fit border-b-[1.5px] border-neutral-400 px-4 py-2'>
                        <h1 className='cursor-default font-notoserif text-2xl text-neutral-800'>Owned Restaurants</h1>
                    </div>
                    <div className='w-full h-fit grid auto-rows-auto grid-cols-4 p-4 gap-6'>
                        <div className='w-full h-32 border-[1px] border-neutral-400 rounded flex flex-col justify-center items-center'>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RestaurantOwnerDashboard
