import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../context/AuthContext';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalContext';
import { MdEdit } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { IoCreateOutline } from "react-icons/io5";

const RestaurantOwnerDashboard = () => {

    const [ownedRestaurants, setOwnedRestaurants] = useState(null);
    const { user } = useContext(AuthContext);
    const { setMessageAndMode } = useContext(GlobalContext);
    const navigate = useNavigate();

    const fetchOwnedRestaurants = async () => {
        try {
            const res = await axiosClient.get(`/users/${user.uuid}/restaurants/`);

            if (res.status === 200) {
                setOwnedRestaurants(res.data);
            } else {
                setMessageAndMode("Unexpected response", "failure");
                console.error("unexpected response status: ", res.status);
                navigate("/");
            }

        } catch (err) {
            console.error("Error while fetching owned restaurants");
            console.error(err);
            setMessageAndMode("An error occurred", "failure");
            navigate('/');
        }
    }

    useEffect(() => {
        if (user && user.uuid) {
            fetchOwnedRestaurants();
        }
    }, [user])

    return (
        <div className='absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center mt-12'>
            <div className='w-full h-full flex flex-col justify-start items-center py-4 px-8 overflow-x-hidden'>
                <div className='w-full h-fit flex justify-center items-center gap-4 mb-10'>
                    <div className='flex-1 h-0 border-b-[1px] border-neutral-400'></div>
                    <h1 className='cursor-default font-notoserif text-4xl text-neutral-800 '>Dashboard</h1>
                    <div className='flex-1 h-0 border-b-[1px] border-neutral-400'></div>
                </div>
                <div className='border-[1.5px] border-neutral-400 w-full h-fit rounded-md flex flex-col justify-start items-start'>
                    <div className='w-full h-fit border-b-[1.5px] border-neutral-400 px-4 py-2'>
                        <h1 className='cursor-default font-notoserif text-2xl text-neutral-800'>Owned Restaurants</h1>
                    </div>
                    <div className='w-full h-fit grid auto-rows-auto grid-cols-4 p-6 gap-6'>
                        {!ownedRestaurants ? (
                            <>
                                <div className='w-full h-32 bg-neutral-200 rounded flex flex-col justify-center items-center'>

                                </div>
                                <div className='w-full h-32 bg-neutral-200 rounded flex flex-col justify-center items-center'>
                                
                                </div>
                                <div className='w-full h-32 bg-neutral-200 rounded flex flex-col justify-center items-center'>
                                
                                </div>
                            </>
                        ) : (
                            <>
                                {ownedRestaurants?.map(restaurant => (
                                    <div key={restaurant.uuid} className='group w-full h-36 border-[1px] border-neutral-400 rounded flex flex-col justify-start items-center cursor-pointer transition duration-150 ease-out relative'>
                                        <div className='w-full h-[60%] flex justify-center items-center overflow-hidden'>
                                            <img src={restaurant.image} alt="" className='w-full object-cover' />
                                        </div>
                                        <div className='w-full flex-1 flex justify-center items-center gap-2'>
                                            <div className='flex-1 h-0 border-b-[1px] border-neutral-400'></div>
                                            <p className='font-poppins text-2xl font-bold text-neutral-800'>{restaurant.name}</p>
                                            <div className='flex-1 h-0 border-b-[1px] border-neutral-400'></div>
                                        </div>
                                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="bg-white w-8 h-8 rounded-full flex justify-center items-center hover:bg-neutral-100">
                                                <span className='text-neutral-800 text-lg'>
                                                    <MdEdit />
                                                </span>
                                            </button>
                                            <button className="bg-white w-8 h-8 rounded-full flex justify-center items-center hover:bg-neutral-100">
                                                <span className='text-rose-600 text-lg'>
                                                    <MdDeleteOutline />
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <div onClick={() => {  }} className='w-full h-36 border-2 border-emerald-500 hover:bg-green-100 rounded flex justify-center items-center cursor-pointer gap-2'>
                                    <span className='text-emerald-700 text-4xl'>
                                        <IoCreateOutline />
                                    </span>
                                    <h1 className='font-poppins text-emerald-700 text-3xl'>Create</h1>
                                </div>
                            </>
                        )}                    
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RestaurantOwnerDashboard
