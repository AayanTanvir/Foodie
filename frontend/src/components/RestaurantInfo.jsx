import React, { useContext, useState } from 'react';
import { FaStar } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import { formatTime } from '../utils/Utils';
import { RestaurantContext } from '../context/RestaurantContext';

const RestaurantInfo = ({ restaurant }) => {
    const formattedTimings = `${formatTime(restaurant?.opening_time)} - ${formatTime(restaurant?.closing_time)}`;
    const { setShowReviewsPopup, setReviewsPopupMode } = useContext(RestaurantContext);

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
                    <p className="text-sm text-neutral-500 cursor-default">{restaurant.restaurant_category}</p>
                    <div className='flex justify-between items-center w-full h-fit mb-4'>
                        <h1 className="text-3xl font-bold text-neutral-800 mb-2 cursor-default">{restaurant.name}</h1>
                        <div className="flex items-center mb-2">
                            <span className='text-xl text-amber-400 cursor-default'>
                                <FaStar />
                            </span>
                            <span className="text-lg font-medium text-neutral-700 ml-1 cursor-default">{restaurant.rating}</span>
                        </div>
                    </div>
                    <div className="text-sm font-roboto text-neutral-600 mb-2 cursor-default">
                        <span className="font-semibold">Timing - </span> {formattedTimings}
                        <div><span className="font-semibold">Address - </span> {restaurant.address}</div>
                        <div><span className="font-semibold">Phone - </span> {restaurant.phone}</div>
                    </div>           
                </div>
            </div>
            <div className='absolute bottom-2 right-2 w-full h-fit flex justify-end items-center gap-4'>
                <button className="group w-fit h-9 flex rounded-lg justify-center items-center">
                    <div className='w-8 h-full rounded-l-lg border-2 border-rose-600 transition ease-out group-hover:bg-rose-600 flex justify-center items-center'>
                        <span className='text-lg text-rose-600 transition ease-out group-hover:text-white'>
                            <FaRegHeart />
                        </span>
                    </div>
                    <div className='h-full flex justify-center group-hover:border-neutral-500 border-[1px] border-l-0 border-neutral-400 items-center px-2 rounded-r-lg text-sm font-medium text-neutral-700'>
                        Add to Favorites
                    </div>
                </button>
                <button onClick={() => { setReviewsPopupMode("read"); setShowReviewsPopup(true) }} className='group w-fit h-9 flex rounded-lg justify-center items-center'>
                    <div className='w-8 h-full rounded-l-lg border-2 border-amber-500 transition ease-out group-hover:bg-amber-500 flex justify-center items-center'>
                        <span className='text-xl text-amber-500 transition ease-out group-hover:text-white'>
                            <FaRegStar />
                        </span>
                    </div>
                    <div className='h-full flex justify-center items-center border-[1px] group-hover:border-neutral-500 border-l-0 border-neutral-400 px-2 rounded-r-lg text-sm font-medium text-neutral-700'>
                        Reviews
                    </div>
                </button>
            </div>
        </div>
    );
};

export default RestaurantInfo;