import React, { useState } from 'react';
import star from '../assets/star.svg';
import star_white from '../assets/star_white.svg';
import { formatTime } from '../utils/Utils';

const RestaurantInfo = ({ restaurant }) => {
    const [moreInfo, setMoreInfo] = useState(false);
    const formattedTimings = `${formatTime(restaurant.opening_time)} - ${formatTime(restaurant.closing_time)}`;

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
                    <p className="text-sm text-neutral-500 mb-1">{restaurant.restaurant_category}</p>
                    <h1 className="text-3xl font-bold text-neutral-800 mb-2">{restaurant.name}</h1>
                    <div className="flex items-center mb-2">
                        <img src={star} alt="star" className="w-5 h-5 mr-1" />
                        <span className="text-lg font-medium text-neutral-700">{restaurant.rating || "4.1"}/5</span>
                    </div>
                    <div className="text-sm text-neutral-600 mb-2">
                        <span className="font-semibold">Timings:</span> {formattedTimings}
                    </div>
                </div>
                {moreInfo && (
                    <div className="mt-4 text-sm text-neutral-700">
                        <div><span className="font-semibold">Address:</span> {restaurant.address}</div>
                        <div><span className="font-semibold">Phone:</span> {restaurant.phone}</div>
                    </div>
                )}
                <button
                    onClick={() => setMoreInfo(!moreInfo)}
                    className="mt-4 px-4 py-2 bg-neutral-100 border-[1px] border-neutral-400 transition hover:scale-[101%] rounded-lg text-sm font-medium text-neutral-700 self-start"
                >
                    {moreInfo ? "Hide Info" : "More Info"}
                </button>
            </div>
            <div className="absolute top-4 right-4">
                <button className="border-red-500 border-2 rounded-xl w-12 h-11 flex justify-center items-center hover:bg-red-100">
                    <span className="text-3xl text-red-500">&#9825;</span>
                </button>
            </div>
            <button onClick={() => {  }} className='absolute bottom-6 right-4 w-fit h-9 border-[1px] border-neutral-400 flex rounded-lg justify-center items-center transition hover:scale-[101%]'>
                <div className='w-8 h-full rounded-l-lg bg-amber-500 flex justify-center items-center'>
                    <img src={star_white} alt="" className='w-5' />
                </div>
                <div className='h-full flex justify-center items-center px-2 bg-gray-100 rounded-r-lg text-sm font-medium text-neutral-700'>
                    Reviews
                </div>
            </button>
        </div>
    );
};

export default RestaurantInfo;