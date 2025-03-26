import React from 'react'

const RestaurantDiscounts = ({ restaurant }) => {
  return (
    <div className='relative min-h-[10rem] w-full mt-5 px-48'>
        <div className='w-full h-[3rem]'>
            <h1 className='absolute left-48 text-left font-roboto font-semibold text-3xl'>Discounts</h1>
        </div>
        <div className="min-h-[7rem] grid grid-cols-4 grid-rows-2 gap-4">
            <div className='border-2 border-gray-300 rounded-xl'></div>
            <div className='border-2 border-gray-300 rounded-xl'></div>
            <div className='border-2 border-gray-300 rounded-xl'></div>
            <div className='border-2 border-gray-300 rounded-xl'></div>
            <div className='border-2 border-gray-300 rounded-xl'></div>
            <div className='border-2 border-gray-300 rounded-xl'></div>
        </div>
    </div>
  )
}

export default RestaurantDiscounts
