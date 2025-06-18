import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../context/AuthContext';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalContext';
import { MdEdit } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { IoCreateOutline } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { formatDate } from '../utils/Utils';

const RestaurantOwnerDashboard = () => {

    // const [ownedRestaurants, setOwnedRestaurants] = useState(null);
    const [totalRevenueAndOrders, setTotalRevenueAndOrders] = useState(null);
    const [recentOrdersReviews, setRecentOrdersReviews] = useState(null);
    const [ordersPeriod, setOrdersPeriod] = useState("today");
    const { user } = useContext(AuthContext);
    const { setMessageAndMode } = useContext(GlobalContext);
    const navigate = useNavigate();

    // const fetchOwnedRestaurants = async () => {
    //     try {
    //         const res = await axiosClient.get(`/users/${user.uuid}/restaurants/`);

    //         if (res.status === 200) {
    //             setOwnedRestaurants(res.data);
    //         } else {
    //             setMessageAndMode("Unexpected response", "failure");
    //             console.error("unexpected response status: ", res.status);
    //             navigate("/");
    //         }

    //     } catch (err) {
    //         console.error("Error while fetching owned restaurants");
    //         console.error(err);
    //         setMessageAndMode("An error occurred", "failure");
    //         navigate('/');
    //     }
    // }

    const fetchRevenueEarned = async () => {
        try {
            const res = await axiosClient.get(`/owner/total_revenue_and_orders/`)

            if (res.status === 200) {
                setTotalRevenueAndOrders(res.data);
            } else {
                setMessageAndMode("Unexpected response", "failure");
                console.error("unexpected response status: ", res.status);
                navigate("/");
            }

        } catch (err) {
            console.error("Error while fetching revenue earned");
            console.error(err);
            setMessageAndMode("An error occurred while fetching revenue", "failure");
            navigate('/');
        }
    }

    const fetchRecentOrdersReviews = async () => {
        try {
            const res = await axiosClient.get(`/owner/recent_orders_and_reviews/`)

            if (res.status === 200) {
                setRecentOrdersReviews(res.data);
            } else {
                setMessageAndMode("Unexpected response", "failure");
                console.error("unexpected response status: ", res.status);
                navigate("/");
            }

        } catch (err) {
            console.error("Error while fetching recent orders and reviews");
            console.error(err);
            setMessageAndMode("An error occurred while fetching recent orders and reviews", "failure");
            navigate('/');
        }
    }

    useEffect(() => {
        if (user && user.uuid) {
            fetchRevenueEarned();
            fetchRecentOrdersReviews();
        }
    }, [])

    return (
        <div className='absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center mt-12'>
            <div className='w-full h-full flex flex-col justify-start items-center py-4 px-8'>
                <div className='w-full h-fit flex justify-start items-center gap-4 mt-2 mb-6'>
                    <h1 className='cursor-default font-notoserif text-4xl text-neutral-800 '>Dashboard</h1>
                </div>
                <div className='w-full h-fit flex flex-col justify-normal items-start gap-6'>
                    <div className='w-full h-fit flex justify-between items-start'>
                        <div className='w-[34%] h-full border-[1px] border-neutral-500 rounded py-4 px-6 flex flex-col justify-normal items-center'>
                            <h1 className='font-opensans text-2xl text-neutral-800 cursor-default'>Orders Completed</h1>
                            <div className='w-full h-full flex flex-col justify-center items-center mt-2'>
                                <div className='w-32 h-28 border-[1px] border-neutral-500 rounded mb-2 flex justify-center items-center'>
                                    {!totalRevenueAndOrders ? (
                                        <div className='w-16 h-16 bg-neutral-300 rounded' />
                                    ) : (
                                        ordersPeriod === "today" ? (
                                            <h1 className='font-hedwig text-4xl text-neutral-800 cursor-default'>{totalRevenueAndOrders.orders.today}</h1>
                                        ) : ordersPeriod === "week" ? (
                                            <h1 className='font-hedwig text-4xl text-neutral-800 cursor-default'>{totalRevenueAndOrders.orders.week}</h1>
                                        ) : ordersPeriod === "month" ? (
                                            <h1 className='font-hedwig text-4xl text-neutral-800 cursor-default'>{totalRevenueAndOrders.orders.month}</h1>
                                        ) : null
                                    )}
                                </div>
                                <Select
                                    value={ordersPeriod}
                                    autoWidth
                                    onChange={e => setOrdersPeriod(e.target.value)}
                                    size='small'
                                    sx={{ 
                                        minWidth: 120,
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'gray', // default border color
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#262626', // border color on focus
                                        },
                                    }}
                                >
                                    <MenuItem value="today">Today</MenuItem>
                                    <MenuItem value="week">Week</MenuItem>
                                    <MenuItem value="month">Month</MenuItem>
                                </Select>
                            </div>
                        </div>
                        <div className='w-[64%] border-[1px] border-neutral-500 py-4 rounded flex flex-col justify-normal items-center gap-5'>
                            <h1 className='font-opensans text-2xl text-neutral-800 cursor-default'>Revenue Earned</h1>
                            <div className='w-full h-fit flex justify-around items-start'>
                                <div className='w-fit h-fit flex flex-col justify-normal items-center'>
                                    <div className='w-fit h-28 border-[1px] border-neutral-500 rounded mb-2 flex justify-center items-center px-4'>
                                        {!totalRevenueAndOrders ? (
                                            <div className='w-16 h-16 bg-neutral-300 rounded' />
                                        ) : (
                                            <h1 className='font-hedwig text-4xl text-emerald-600 cursor-default'>Rs. {totalRevenueAndOrders.revenue.today}</h1>
                                        )}
                                    </div>
                                    <h1 className='font-opensans text-lg text-neutral-800 cursor-default'>Today</h1>
                                </div>
                                <div className='w-fit h-fit flex flex-col justify-normal items-center'>
                                    <div className='w-fit h-28 px-4 border-[1px] border-neutral-500 rounded mb-2 flex justify-center items-center'>
                                        {!totalRevenueAndOrders ? (
                                            <div className='w-16 h-16 bg-neutral-300 rounded' />
                                        ) : (
                                            <h1 className='font-hedwig text-4xl text-emerald-600 cursor-default'>Rs. {totalRevenueAndOrders.revenue.week}</h1>
                                        )}
                                    </div>
                                    <h1 className='font-opensans text-lg text-neutral-800 cursor-default'>Week</h1>
                                </div>
                                <div className='w-fit h-fit flex flex-col justify-normal items-center'>
                                    <div className='w-fit h-28 px-4 border-[1px] border-neutral-500 rounded mb-2 flex justify-center items-center'>
                                        {!totalRevenueAndOrders ? (
                                            <div className='w-16 h-16 bg-neutral-300 rounded' />
                                        ) : (
                                            <h1 className='font-hedwig text-4xl text-emerald-600 cursor-default'>Rs. {totalRevenueAndOrders.revenue.month}</h1>
                                        )}
                                    </div>
                                    <h1 className='font-opensans text-lg text-neutral-800 cursor-default'>Month</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='w-full h-fit border-[1px] border-neutral-500 rounded flex flex-col justify-start items-start p-4'>
                        <h1 className='font-opensans text-2xl text-neutral-800 cursor-default'>Recent Orders</h1>
                        <div className='w-full h-fit grid auto-rows-auto grid-cols-2 gap-2 mt-2'>
                            {!recentOrdersReviews ? (
                                <>
                                    <div className="relative w-full h-28 flex justify-between items-start border-[1.5px] border-neutral-400 rounded-lg p-4 bg-white">
                                        <div className="w-fit flex flex-col justify-between items-start">
                                            <div className='w-24 h-12 bg-neutral-300 rounded' />
                                            <div>
                                                <div className="w-10 h-5 text-neutral-300 rounded" />
                                                <div className="w-16 h-8 text-neutral-300 rounded" />
                                            </div>
                                        </div>
                                        <div className="flex-1 h-full flex flex-col justify-between items-end">
                                            <div className="w-10 h-5 text-neutral-300 rounded" />
                                            <div>
                                                <div className="w-20 h-10 text-neutral-300 rounded" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative w-full h-28 flex justify-between items-start border-[1.5px] border-neutral-400 rounded-lg p-4 bg-white">
                                        <div className="w-fit flex flex-col justify-between items-start">
                                            <div className='w-24 h-12 bg-neutral-300 rounded' />
                                            <div>
                                                <div className="w-10 h-5 text-neutral-300 rounded" />
                                                <div className="w-16 h-8 text-neutral-300 rounded" />
                                            </div>
                                        </div>
                                        <div className="flex-1 h-full flex flex-col justify-between items-end">
                                            <div className="w-10 h-5 text-neutral-300 rounded" />
                                            <div>
                                                <div className="w-20 h-10 text-neutral-300 rounded" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative w-full h-28 flex justify-between items-start border-[1.5px] border-neutral-400 rounded-lg p-4 bg-white">
                                        <div className="w-fit flex flex-col justify-between items-start">
                                            <div className='w-24 h-12 bg-neutral-300 rounded' />
                                            <div>
                                                <div className="w-10 h-5 text-neutral-300 rounded" />
                                                <div className="w-16 h-8 text-neutral-300 rounded" />
                                            </div>
                                        </div>
                                        <div className="flex-1 h-full flex flex-col justify-between items-end">
                                            <div className="w-10 h-5 text-neutral-300 rounded" />
                                            <div>
                                                <div className="w-20 h-10 text-neutral-300 rounded" />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                recentOrdersReviews.recent_orders.map((order) => (
                                    <div key={order.uuid} className="relative w-full h-28 flex justify-between items-start border-[1.5px] border-neutral-400 rounded-lg p-4 bg-white">
                                        <div className="w-fit flex flex-col justify-between items-start">
                                            <h1 className='font-poppins text-2xl text-neutral-700 cursor-default'>Rs. {Math.round(order?.discounted_price)} {order?.discounted_price !== order?.total_price && <span className='font-poppins line-through text-sm text-neutral-500'>{Math.round(order?.total_price)}</span>}</h1>
                                            <div>
                                                <p className="font-roboto text-md text-neutral-600 capitalize cursor-default">At {order?.restaurant_name}</p>
                                                <span className={`px-2 py-1 rounded text-xs font-roboto font-semibold capitalize cursor-default
                                                ${order?.order_status === 'delivered' ? 'bg-emerald-100 text-emerald-700' : ''}
                                                ${order?.order_status === 'pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                                                ${order?.order_status === 'cancelled' ? 'bg-rose-100 text-rose-700' : ''}
                                                `}>
                                                    {order?.order_status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex-1 h-full flex flex-col justify-between items-end">
                                            <span className="font-poppins text-xs text-neutral-600 cursor-default">{formatDate(order?.created_at)}</span>
                                            <div>
                                                <button onClick={() => navigate(`/orders/${order.uuid}`)} className="px-2 py-1 rounded border-[1px] border-neutral-400 transition duration-150 hover:border-neutral-500 text-neutral-700 text-md font-semibold">View Details</button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    <div className='w-full h-fit border-[1px] border-neutral-500 rounded flex flex-col justify-start items-start p-4'>
                        <h1 className='font-opensans text-2xl text-neutral-800 cursor-default'>Recent Feedback</h1>
                        <div className='w-full h-fit flex flex-col justify-start items-start gap-2 mt-2'>
                            <div className='w-full min-h-16 rounded-md border-[1px] border-neutral-400 flex flex-col justify-start items-start gap-2 p-4'>
                                <div className='w-full h-fit flex justify-between items-center'>
                                    <div className='flex gap-2'>
                                        <h1 className='text-lg text-neutral-700 font-poppins font-bold capitalize cursor-default'>Username</h1>
                                        <div className="flex items-center gap-1">
                                            <span className='text-2xl text-amber-400'>
                                                <FaStar />
                                            </span>
                                            <span className="text-xl text-neutral-700 mr-1 font-semibold cursor-default">4</span>
                                        </div>
                                    </div>
                                    <div className='w-fit h-fit flex justify-normal items-center gap-2'>
                                        <p className='text-xs text-neutral-600 cursor-default'>6 June 2025</p>
                                        <p className='text-xs text-neutral-600 cursor-default'>On Aayan</p>
                                    </div>
                                </div>
                                <div>
                                    <p className='text-md text-neutral-700 font-poppins font-medium text-wrap whitespace-break-spaces cursor-default'>Seems like you cannot be replaced</p>
                                </div>
                            </div>
                            <div className='w-full min-h-16 rounded-md border-[1px] border-neutral-400 flex flex-col justify-start items-start gap-2 p-4'>
                                <div className='w-full h-fit flex justify-between items-center'>
                                    <div className='flex gap-2'>
                                        <h1 className='text-lg text-neutral-700 font-poppins font-bold capitalize cursor-default'>Username</h1>
                                        <div className="flex items-center gap-1">
                                            <span className='text-2xl text-amber-400'>
                                                <FaStar />
                                            </span>
                                            <span className="text-xl text-neutral-700 mr-1 font-semibold cursor-default">4</span>
                                        </div>
                                    </div>
                                    <div className='w-fit h-fit flex justify-normal items-center gap-2'>
                                        <p className='text-xs text-neutral-600 cursor-default'>6 June 2025</p>
                                        <p className='text-xs text-neutral-600 cursor-default'>On Aayan</p>
                                    </div>
                                </div>
                                <div>
                                    <p className='text-md text-neutral-700 font-poppins font-medium text-wrap whitespace-break-spaces cursor-default'>Seems like you cannot be replaced Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quos unde maiores sequi recusandae vitae earum nemo odit natus. Nihil beatae iusto nulla! Sequi repudiandae dicta illum excepturi sunt corporis ipsam.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='w-1 h-[1.5rem]'/>
                </div>
                {/* <div className='border-[1.5px] border-neutral-400 w-full h-fit rounded-md flex flex-col justify-start items-start'>
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
                </div> */}
            </div>
        </div>
    )
}

export default RestaurantOwnerDashboard
