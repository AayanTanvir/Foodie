import React, { useContext, useState } from 'react';
import star from '../assets/star.svg';
import star_white from '../assets/star_white.svg';
import favorite from '../assets/favorite.svg';
import { formatTime } from '../utils/Utils';
import { RestaurantContext } from '../context/RestaurantContext';

const RestaurantInfo = ({ restaurant }) => {
    const formattedTimings = `${formatTime(restaurant.opening_time)} - ${formatTime(restaurant.closing_time)}`;
    const { setShowReviewsPopup } = useContext(RestaurantContext);
    
    return (
        <div className="relative mt-2 w-full max-w-4xl mx-auto bg-white rounded-xl border-[1px] border-neutral-300 overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-1/3 w-full h-48 md:h-auto flex justify-center items-center">
                <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="object-cover w-full h-full"
                />
            </div>
            <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                    <p className="text-sm text-neutral-500">{restaurant.restaurant_category}</p>
                    <div className='flex justify-between items-center w-full h-fit mb-4'>
                        <h1 className="text-3xl font-bold text-neutral-800 mb-2">{restaurant.name}</h1>
                        <div className="flex items-center mb-2">
                            <span className="text-lg font-medium text-neutral-700">{restaurant.rating}</span>
                            <img src={star} alt="star" className="w-5 h-5 mr-1" />
                        </div>
                    </div>
                    <div className="text-sm text-neutral-600 mb-2">
                        <span className="font-semibold">Timings:</span> {formattedTimings}
                        <div><span className="font-semibold">Address:</span> {restaurant.address}</div>
                        <div><span className="font-semibold">Phone:</span> {restaurant.phone}</div>
                    </div>           
                </div>
            </div>
            <div className='absolute bottom-2 right-2 w-full h-fit flex justify-end items-center gap-4'>
                <button className="w-fit h-9  flex rounded-lg justify-center items-center">
                    <div className='w-8 h-full rounded-l-lg border-[2px] border-rose-600 flex justify-center items-center'>
                        <img src={favorite} alt="&#9825;" className='w-5' />
                    </div>
                    <div className='h-full flex justify-center border-[1px] border-l-0 border-neutral-400 items-center px-2 rounded-r-lg text-sm font-medium text-neutral-700'>
                        Add to Favorites
                    </div>
                </button>
                <button onClick={() => { setShowReviewsPopup(true) }} className='w-fit h-9 flex rounded-lg justify-center items-center'>
                    <div className='w-8 h-full rounded-l-lg bg-amber-500 flex justify-center items-center'>
                        <img src={star_white} alt="" className='w-5' />
                    </div>
                    <div className='h-full flex justify-center items-center border-[1px] border-l-0 border-neutral-400 px-2 rounded-r-lg text-sm font-medium text-neutral-700'>
                        Reviews
                    </div>
                </button>
            </div>
        </div>
    );
};

export default RestaurantInfo;