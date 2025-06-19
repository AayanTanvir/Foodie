import React, { useEffect, useState, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalContext';
import axiosClient from '../utils/axiosClient';
import { formatTime } from '../utils/Utils';
import { MdEdit } from 'react-icons/md';
import { MdDeleteOutline } from 'react-icons/md';

const RestaurantOwnerRestaurantPage = () => {
    const [restaurant, setRestaurant] = useState(null);
    const { uuid } = useParams();
    const { setMessageAndMode } = useContext(GlobalContext);
    const navigate = useNavigate();
    const formattedTimings = `${formatTime(restaurant?.opening_time)} - ${formatTime(restaurant?.closing_time)}`;

    const fetchRestaurant = async () => {
        try {
            const res = await axiosClient.get(`/restaurants/${uuid}`);

            if (res.status === 200) {
                setRestaurant(res.data);
            } else {
                setMessageAndMode("Unexpected response", "failure");
                console.error("unexpected response status: ", res.status);
                navigate("/");
            }
        } catch (err) {
            console.error("Error while fetching restaurant details", err);
            setMessageAndMode("An error occurred", "failure");
            navigate('/');
        }
    }

    useEffect(() => {
        if (uuid) {
            fetchRestaurant();
        } else {
            navigate('/');
        }
    }, []);

    return (
        <div className='absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center mt-12'>
            <div className='w-full h-full flex flex-col justify-start items-center py-4 px-8'>
                <div className='border-[1.5px] border-neutral-500 w-full h-[92%] rounded-md flex flex-col justify-start items-start'>
                    <div className='w-full h-fit flex justify-between items-center px-6 py-4 border-b-[1.5px] border-neutral-500'>
                        {!restaurant ? (
                            <>
                                <div className='w-28 h-10 bg-neutral-200 rounded' />
                                <div>
                                    <div className='w-28 h-20 bg-neutral-200 rounded' />
                                    <div className='w-2 h-20 bg-neutral-200 rounded' />
                                </div>
                            </>
                        ) : (
                            <>
                                <h1 className='cursor-default font-notoserif text-4xl text-neutral-800'>{restaurant.name}</h1>
                                <div className='w-fit h-full flex justify-center items-center gap-2'>
                                    <button onClick={() => { navigate(`/restaurant-owner/restaurants/${restaurant.uuid}/edit`) }} className="bg-white w-fit h-full px-2 rounded flex justify-center items-center gap-1 border-[1px] border-neutral-400 hover:bg-neutral-100">
                                        <span className='text-neutral-800 text-xl'>
                                            <MdEdit />
                                        </span>
                                        <span className='text-neutral-800 text-md font-opensans font-semibold'>Edit</span>
                                    </button>
                                    <button onClick={() => {  }} className="group bg-white hover:bg-rose-600 px-2 w-fit h-full rounded flex justify-center items-center gap-1 border-[1px] border-rose-400">
                                        <span className='text-rose-600 group-hover:text-white text-xl'>
                                            <MdDeleteOutline />
                                        </span>
                                        <span className='text-rose-600 group-hover:text-white text-md font-opensans font-semibold'>Delete</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                    <div className='w-full flex-1 flex-col justify-start items-start p-6 overflow-y-auto'>
                        <div className='w-full h-fit flex flex-col justify-start items-start'>
                            {!restaurant ? (
                                <div className='w-20 h-10 bg-neutral-200 rounded' />
                            ) : (
                                <>
                                    <h1 className='w-full h-fit mb-2 font-poppins text-neutral-800 text-2xl cursor-default'>Info</h1>
                                    <div className='w-full h-fit flex flex-col justify-start items-start'>
                                        <p className='text-md font-roboto font-semibold text-neutral-600 mb-2 cursor-default'>Category - <span className='font-normal'>{restaurant.restaurant_category}</span></p>
                                        <p className='text-md font-roboto font-semibold text-neutral-600 mb-2 cursor-default'>Timing - <span className='font-normal'>{formattedTimings}</span></p>
                                        <p className='text-md font-roboto font-semibold text-neutral-600 mb-2 cursor-default'>Address - <span className='font-normal'>{restaurant.address}</span></p>
                                        <p className='text-md font-roboto font-semibold text-neutral-600 mb-2 cursor-default'>Phone - <span className='font-normal'>{restaurant.phone}</span></p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RestaurantOwnerRestaurantPage
