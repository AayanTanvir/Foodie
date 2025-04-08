import React from 'react'
import { formatTime } from '../utils/Utils';

const RestaurantInfo = ({ restaurant }) => {
    
    const formattedTimings = `${formatTime(restaurant.opening_time)} - ${formatTime(restaurant.closing_time)}`;

    return (
        <div className='relative min-h-[250px] w-full py-4 mt-6'>
            <div className='flex justify-center items-center absolute left-48 overflow-hidden rounded-xl shadow-gray-500 shadow-md w-[10rem] h-[10rem]'>
                <img src={restaurant.image} alt='' className='object-cover w-full h-full'/>
            </div>
            <div className='absolute left-[24rem] top-6'>
                <h1 className='text-5xl font-notoserif font-semibold text-left text-neutral-800'>{restaurant.name}</h1>
                <h1 className='text-md font-roboto font-normal text-left mb-8 text-neutral-800'>{restaurant.restaurant_category}</h1>
                <h1 className='text-md font-roboto font-normal text-left text-neutral-800'>Ratings: <span className='text-amber-500'>4.1</span></h1>
                <h1 className='text-md font-roboto font-normal text-left text-neutral-800'>{formattedTimings}</h1>
            </div>
            <div className='absolute right-24 top-6 border-red-500 border-2 rounded-xl w-[3rem] h-[2.75rem] flex justify-center items-start cursor-pointer hover:bg-red-100'>
                <h1 className='text-4xl text-red-500 cursor-pointer'>&#9825;</h1>
            </div>
            <div className='absolute right-24 bottom-0 w-fit h-18 p-2'>
                <h1 className='text-md font-roboto font-normal text-right text-neutral-800'>{restaurant.phone}</h1>
                <h1 className='text-md font-roboto font-normal text-right text-neutral-800'>{restaurant.address}</h1>
            </div>
        </div>
    )
}

export default RestaurantInfo
