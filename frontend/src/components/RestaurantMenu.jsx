import React, { useState } from 'react';
import search from '../assets/search.svg';

const RestaurantMenu = ({ restaurant }) => {


    if (!restaurant) {
        return <><h1>Loading...</h1></>
    }

    return (
        <div className='relative min-h-[35rem] w-full border-2 border-gray-200 mt-6 grid grid-cols-10 grid-rows-1'>
            <div className='relative col-span-2 row-span-6 border-r-2 border-gray-200'>
                <form method='GET' action='' className='w-full h-24 border-b-2 border-gray-200'>
                    <div className='relative w-full'>
                        <img className='absolute top-11 left-[13%] z-10' src={search}/>
                        <input className='border-2 border-gray-400 rounded-2xl w-4/5 absolute top-10 left-1/2 -translate-x-1/2 pl-7' type="text" />
                    </div>
                </form>
                <div className='absolute top-24 left-1/2 -translate-x-1/2 w-full h-fit flex flex-col justify-start items-center'>
                    {restaurant.item_categories.map((category) => (
                        <div key={category} className='w-full h-12 border-b-2 border-gray-200 p-2 hover:bg-gray-100 cursor-pointer'>
                            <h1 className='text-lg font-poppins text-gray-600'>{category.name}</h1>
                        </div>
                    ))}
                </div>
            </div>
            <div className='col-span-8 col-start-3 row-span-6'>

            </div>
        </div>
    )
}

export default RestaurantMenu
