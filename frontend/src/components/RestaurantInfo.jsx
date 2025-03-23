import React from 'react'

const RestaurantInfo = ({ restaurant }) => {

    if (!restaurant) {
        return <><h1>Loading...</h1></>
    }

    return (
        <div className='relative min-h-[250px] w-full border-b-2 border-gray-200 py-4 mt-6'>
            <div className='flex justify-center items-center absolute left-48 overflow-hidden rounded-xl shadow-gray-500 shadow-md w-[10rem] h-[10rem]'>
                <img src={restaurant.image} alt='' className='object-cover w-full h-full'/>
            </div>
            <div className='absolute left-[24rem] top-6'>
                <h1 className='text-4xl font-poppins font-semibold text-left'>{restaurant.name}</h1>
                <h1 className='text-lg font-inter font-normal text-gray-600 text-left mb-8'>{restaurant.category}</h1>
                <h1 className='text-md font-inter font-normal text-left'>Ratings: <span className='text-amber-500'>4.1</span></h1>
                <h1 className='text-md font-inter font-normal text-left'>8:00<span className='text-amber-500'>AM</span> - 6:00<span className='text-amber-500'>PM</span></h1>
            </div>
            <div className='absolute right-24 top-6 border-red-500 border-2 rounded-xl w-[3rem] h-[2.75rem] flex justify-center items-start cursor-pointer hover:bg-gray-100'>
                <h1 className='text-4xl text-red-500 cursor-pointer'>&#9825;</h1>
            </div>
        </div>
    )
}

export default RestaurantInfo
