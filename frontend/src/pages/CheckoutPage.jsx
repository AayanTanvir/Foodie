import { useState } from 'react';
import card from '../assets/card.svg';
import cash from '../assets/cash.svg';

const CheckoutPage = () => {
    return (
        <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center gap-4 bg-gray-100'>
            <div className='rounded-md border-2 border-neutral-300 w-3/5 h-fit p-4 flex flex-col justify-start items-start gap-5 bg-white'>
                <div className='w-full flex flex-col justify-start items-start gap-2'>
                    <h1 className='text-2xl font-notoserif text-neutral-700 text-left cursor-default'>Delivery Address</h1>
                    <textarea
                        className='w-full h-24 p-2 border-2 border-neutral-300 resize-none rounded-md focus:outline-none focus:border-neutral-500'
                        name='address'
                        placeholder='Enter your address'
                        rows={3}
                        required
                    />
                </div>
                <div className='w-full flex flex-col justify-start items-start gap-2'>
                    <h1 className='text-2xl font-notoserif text-neutral-700 text-left cursor-default'>Payment</h1>
                    <div className='w-full flex flex-col justify-start items-start gap-2'>
                        <div className='w-fit h-fit flex justify-between items-center gap-2 cursor-pointer border-2 border-neutral-300 rounded-md px-3 py-2 hover:border-neutral-500'>
                            <div className='w-4 h-4 rounded-full border-2 border-gray-600'></div>
                            <div className='w-fit h-fit flex justify-center items-center gap-2'>
                                <img src={cash} alt='' className='w-6 h-6' />
                                <h1 className='text-lg font-roboto text-neutral-700 text-left'>Cash On Delivery</h1>
                            </div>
                        </div>
                        <div className='w-fit h-fit flex justify-between items-center gap-2 cursor-pointer border-2 border-neutral-300 rounded-md px-3 py-2 hover:border-neutral-500'>
                            <div className='w-4 h-4 rounded-full border-2 border-gray-600'></div>
                            <div className='w-fit h-fit flex justify-center items-center gap-2'>
                                <img src={card} alt='' className='w-6 h-6' />
                                <h1 className='text-lg font-roboto text-neutral-700 text-left'>Credit Card</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='rounded-md border-2 border-neutral-300 w-1/3 h-fit p-4 flex flex-col justify-start items-start gap-2 bg-white'>
                <h1 className='text-2xl font-notoserif text-neutral-700 text-left cursor-default'>Order Summary</h1>
            </div>
        </div>
    )
}

export default CheckoutPage
