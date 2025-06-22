import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../context/AuthContext';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalContext';
import { FaStar } from "react-icons/fa";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { formatDate } from '../utils/Utils';

const RestaurantOwnerDashboard = () => {

    const [totalRevenueAndOrders, setTotalRevenueAndOrders] = useState(null);
    const [recentOrdersReviews, setRecentOrdersReviews] = useState(null);
    const [dashboardInfo, setDashboardInfo] = useState(null);
    const [ordersPeriod, setOrdersPeriod] = useState("today");
    const { user } = useContext(AuthContext);
    const { setMessageAndMode } = useContext(GlobalContext);
    const navigate = useNavigate();


    const fetchInfo = async () => {
        try {
            const res = await axiosClient.get(`/owner/dashboard/`)

            if (res.status === 200) {
                setDashboardInfo(res.data);
            } else {
                setMessageAndMode("Unexpected response", "failure");
                console.error("unexpected response status: ", res.status);
                navigate("/");
            }

        } catch (err) {
            console.error("Error while fetching revenue earned", err);
            setMessageAndMode("An error occurred while fetching revenue", "failure");
            navigate('/');
        }
    }

    useEffect(() => {
        if (user && user.uuid) {
            fetchInfo();
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
                                    {!dashboardInfo ? (
                                        <div className='w-16 h-16 bg-neutral-300 rounded' />
                                    ) : (
                                        ordersPeriod === "today" ? (
                                            <h1 className='font-hedwig text-4xl text-neutral-800 cursor-default'>{dashboardInfo.orders.today}</h1>
                                        ) : ordersPeriod === "week" ? (
                                            <h1 className='font-hedwig text-4xl text-neutral-800 cursor-default'>{dashboardInfo.orders.week}</h1>
                                        ) : ordersPeriod === "month" ? (
                                            <h1 className='font-hedwig text-4xl text-neutral-800 cursor-default'>{dashboardInfo.orders.month}</h1>
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
                                            borderColor: 'gray',
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#262626',
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
                                        {!dashboardInfo ? (
                                            <div className='w-16 h-16 bg-neutral-300 rounded' />
                                        ) : (
                                            <h1 className='font-hedwig text-4xl text-emerald-600 cursor-default'>Rs. {dashboardInfo.revenue.today}</h1>
                                        )}
                                    </div>
                                    <h1 className='font-opensans text-lg text-neutral-800 cursor-default'>Today</h1>
                                </div>
                                <div className='w-fit h-fit flex flex-col justify-normal items-center'>
                                    <div className='w-fit h-28 px-4 border-[1px] border-neutral-500 rounded mb-2 flex justify-center items-center'>
                                        {!dashboardInfo ? (
                                            <div className='w-16 h-16 bg-neutral-300 rounded' />
                                        ) : (
                                            <h1 className='font-hedwig text-4xl text-emerald-600 cursor-default'>Rs. {dashboardInfo.revenue.week}</h1>
                                        )}
                                    </div>
                                    <h1 className='font-opensans text-lg text-neutral-800 cursor-default'>Week</h1>
                                </div>
                                <div className='w-fit h-fit flex flex-col justify-normal items-center'>
                                    <div className='w-fit h-28 px-4 border-[1px] border-neutral-500 rounded mb-2 flex justify-center items-center'>
                                        {!dashboardInfo ? (
                                            <div className='w-16 h-16 bg-neutral-300 rounded' />
                                        ) : (
                                            <h1 className='font-hedwig text-4xl text-emerald-600 cursor-default'>Rs. {dashboardInfo.revenue.month}</h1>
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
                            {!dashboardInfo ? (
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
                                dashboardInfo.recent_orders.map((order) => (
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
                        <div className='w-full h-fit flex flex-col justify-start items-start gap-4 mt-2'>
                            {!dashboardInfo ? (
                                <>
                                    <div className='w-full min-h-16 rounded-md border-[1px] border-neutral-400 flex flex-col justify-start items-start gap-2 p-4'>
                                        <div className='w-full h-fit flex justify-between items-center'>
                                            <div className='flex gap-2'>
                                                <div className='w-20 h-12 bg-neutral-300 rounded'/>
                                            </div>
                                            <div className='w-fit h-fit flex justify-normal items-center gap-2'>
                                                <div className='w-20 h-8 bg-neutral-300 rounded'/>
                                                <div className='w-20 h-8 bg-neutral-300 rounded'/>
                                            </div>
                                        </div>
                                        <div>
                                            <div className='w-20 h-12 bg-neutral-300 rounded'/>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                dashboardInfo.recent_reviews.map((review) => (
                                    <div key={review.uuid} className='w-full min-h-16 rounded-md border-[1.5px] border-neutral-500 flex flex-col justify-start items-start gap-2 p-4'>
                                        <div className='w-full h-fit flex justify-between items-center'>
                                            <div className='flex gap-2'>
                                                <h1 className='text-lg text-neutral-700 font-poppins font-bold capitalize cursor-default'>{review.user_name}</h1>
                                                <div className="flex items-center gap-2">
                                                    <div className='flex items-center'>
                                                        {[...Array(review.rating)].map((_, i) => (
                                                            <span key={i} className='text-2xl text-amber-400'>
                                                                <FaStar />
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <span className="text-xl text-neutral-700 mr-1 font-semibold cursor-default">{review.rating}</span>
                                                </div>
                                            </div>
                                            <div className='w-fit h-fit flex flex-col justify-normal items-end gap-2'>
                                                <p className='text-xs text-neutral-600 cursor-default'>{formatDate(review.created_at)}</p>
                                                <p className='text-md text-neutral-600 cursor-default capitalize'>On {review.restaurant_name}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className='text-md text-neutral-700 font-poppins font-medium text-wrap whitespace-break-spaces cursor-default'>{review.body}</p>
                                        </div>
                                        <div className='w-full h-fit grid auto-row-auto grid-cols-3 gap-2'>
                                            {review.items.map((item) => (
                                                <div key={item.uuid} className='w-full h-20 rounded-lg border-[1px] border-neutral-400 flex justify-between items-center'>
                                                    <div className='h-full w-[40%] flex justify-center items-center overflow-hidden border-r-[1px] border-neutral-400'>
                                                        <img src={item.image} alt="" className='w-full h-full object-cover rounded-l-lg' />
                                                    </div>
                                                    <div className='h-full flex-1 flex flex-col justify-between items-start p-2 relative'>
                                                        <h1 className='text-xl text-neutral-700 cursor-default'>{item.name}</h1>
                                                        <h1 className='text-lg text-emerald-600 font-semibold cursor-default'>Rs. {item.price}</h1>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    <div className='w-1 h-[1.5rem]'/>
                </div>
            </div>
        </div>
    )
}

export default RestaurantOwnerDashboard
