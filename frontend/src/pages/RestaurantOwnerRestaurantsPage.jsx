import React, { useState, useEffect, useContext } from 'react';
import { MdEdit } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { IoCreateOutline } from "react-icons/io5";
import AuthContext from '../context/AuthContext';
import { GlobalContext } from '../context/GlobalContext';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../utils/axiosClient';
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    LabelList,
    Label,
    ResponsiveContainer,
} from 'recharts';

const RestaurantOwnerRestaurantsPage = () => {

    const [ownedRestaurants, setOwnedRestaurants] = useState(null);
    const { user } = useContext(AuthContext);
    const { setMessageAndMode } = useContext(GlobalContext);
    const navigate = useNavigate();

    const fetchOwnedRestaurants = async () => {
        try {
            const res = await axiosClient.get(`/owner/restaurants/`);

            if (res.status === 200) {
                setOwnedRestaurants(res.data);
            } else {
                setMessageAndMode("Unexpected response", "failure");
                console.error("unexpected response status: ", res.status);
                navigate("/");
            }

        } catch (err) {
            console.error("Error while fetching owned restaurants", err);
            setMessageAndMode("An error occurred", "failure");
            navigate('/');
        }
    }

    useEffect(() => {
        if (user && user.uuid) {
            fetchOwnedRestaurants();
        }
    }, []);

    return (
        <div className='absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center mt-12'>
            <div className='w-full h-full flex flex-col justify-start items-center py-8 px-8 gap-6'>
                <div className='w-full h-fit flex flex-col justify-start items-center'>
                    <h1 className='font-poppins text-neutral-800 text-2xl cursor-default text-center'>Restaurant Performance</h1>
                    <ResponsiveContainer width="100%" height={350}>
                        <ScatterChart margin={{ top: 20, right: 40, bottom: 30, left: 40 }}>
                            <CartesianGrid stroke='#a3a3a3'/>
                            <XAxis type="number" dataKey="total_orders" name="Orders">
                                <Label
                                    value="Total Orders ->"
                                    offset={10}
                                    position="bottom"
                                    style={{ fill: '#262626', fontSize: 20 }}
                                />
                            </XAxis>
                            <YAxis type="number" dataKey="rating" name="Rating" domain={[0, 5]} ticks={[0,1,2,3,4,5]} label={{ value: 'Rating ->', angle: -90, position: 'insideLeft', offset: 10, style: { fill: '#262626', fontSize: 20 } }} />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                            <Scatter name="Restaurants" data={ownedRestaurants} fill="#262626" >
                                <LabelList dataKey="name" position="bottom" style={{ fill: '#262626', fontSize: 20 }} />
                            </Scatter>
                        </ScatterChart>
                    </ResponsiveContainer>
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
                                    <div key={restaurant.uuid} onClick={() => { navigate(`/restaurant-owner/restaurants/${restaurant.uuid}`) }} className='group w-full h-48 border-[1px] border-neutral-400 rounded flex flex-col justify-start items-center cursor-pointer transition duration-150 ease-out relative'>
                                        <div className='w-full h-[60%] flex justify-center items-center overflow-hidden'>
                                            <img src={restaurant.image} alt="" className='w-full object-cover' />
                                        </div>
                                        <div className='w-full flex-1 flex justify-center items-center gap-2'>
                                            <div className='flex-1 h-0 border-b-[1px] border-neutral-400'></div>
                                            <p className='font-poppins text-2xl font-bold text-neutral-800'>{restaurant.name}</p>
                                            <div className='flex-1 h-0 border-b-[1px] border-neutral-400'></div>
                                        </div>
                                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => { navigate(`/restaurant-owner/restaurants/${restaurant.uuid}/edit`) }} className="bg-white w-10 h-10 rounded-full flex justify-center items-center hover:bg-neutral-100">
                                                <span className='text-neutral-800 text-xl'>
                                                    <MdEdit />
                                                </span>
                                            </button>
                                            <button onClick={() => {  }} className="bg-rose-500 hover:bg-rose-600 w-10 h-10 rounded-full flex justify-center items-center">
                                                <span className='text-white text-xl'>
                                                    <MdDeleteOutline />
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <div onClick={() => {  }} className='w-full h-48 border-[1.5px] border-emerald-500 transition duration-150 ease-out hover:bg-green-100 rounded flex justify-center items-center cursor-pointer gap-2'>
                                    <span className='text-emerald-500 text-4xl'>
                                        <IoCreateOutline />
                                    </span>
                                    <h1 className='font-poppins text-emerald-500 text-3xl'>Create</h1>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RestaurantOwnerRestaurantsPage
