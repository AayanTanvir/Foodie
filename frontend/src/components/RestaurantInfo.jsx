import React, {useState} from 'react';
import star from '../assets/star.svg';
import { formatTime } from '../utils/Utils';


const RestaurantInfo = ({ restaurant }) => {

    const formattedTimings = `${formatTime(restaurant.opening_time)} - ${formatTime(restaurant.closing_time)}`;
    const [moreInfo, setMoreInfo] = useState(false);

    return (
        <div className='relative h-fit w-full py-2 pl-48 flex justify-start items-center gap-5'>
            <div className='flex justify-center items-center overflow-hidden rounded-lg shadow-gray-500 shadow-md w-[12rem] h-[12rem] mr-2'>
                <img src={restaurant.image} alt='' className='object-cover w-full h-full'/>
            </div>
            <div className='relative h-[12rem] py-4'>
                <div className='w-fit h-fit'>
                    <p className='font-hedwig text-left text-neutral-800'>{restaurant.restaurant_category}</p>
                </div>
                <div className='w-fit h-fit mb-5'>
                    <h1 className='text-5xl font-poppins text-left text-neutral-800'>{restaurant.name}</h1>
                </div>
                <div className='flex flex-col justify-center items-start w-fit h-fit'>
                    <div className='w-fit h-fit flex justify-center items-center'>
                        <img src={star} alt="" className='w-4 h-4 mr-1' />
                        <h1 className='text-sm font-roboto text-center text-neutral-800'>4.1/5</h1>
                    </div>
                    <h1 className='text-sm font-roboto text-center text-neutral-800'>{formattedTimings}</h1>
                    {moreInfo ? (
                        <>
                            <h1 className='text-sm font-roboto text-center text-neutral-800'>{restaurant.address}</h1>
                            <h1 className='text-sm font-roboto text-center text-neutral-800'>{restaurant.phone}</h1>
                        </>
                    ) : (
                        <>
                            <button onClick={() => {setMoreInfo(!moreInfo)}} className='px-2 py-1 border-2 border-gray-200 rounded-lg hover:bg-gray-100 text-sm'>More Info</button>
                        </>
                    )}
                </div>
            </div>
            <div className='h-fit absolute top-6 right-48'>
                <div className='border-red-500 border-2 rounded-xl w-[3rem] h-[2.75rem] flex justify-center items-start cursor-pointer hover:bg-red-100'>
                    <h1 className='text-4xl text-red-500 cursor-pointer'>&#9825;</h1>
                </div>
            </div>
        </div>
    )
}

export default RestaurantInfo
