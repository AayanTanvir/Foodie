import React, { useEffect, useState, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalContext';
import axiosClient from '../utils/axiosClient';
import { formatTime } from '../utils/Utils';
import { MdEdit } from 'react-icons/md';
import { MdDeleteOutline } from 'react-icons/md';
import { CiDiscount1 } from 'react-icons/ci';
import { IoCreateOutline } from 'react-icons/io5';
import {
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { Select, MenuItem } from '@mui/material';

const RestaurantOwnerRestaurantPage = () => {
    const [restaurant, setRestaurant] = useState(null);
    const [restaurantDiscounts, setRestaurantDiscounts] = useState(null);
    const [mostOrderedItemPeriod, setMostOrderedItemPeriod] = useState("week");
    const { uuid } = useParams();
    const { setMessageAndMode } = useContext(GlobalContext);
    const navigate = useNavigate();
    const formattedTimings = `${formatTime(restaurant?.opening_time)} - ${formatTime(restaurant?.closing_time)}`;
    const data = [
        { name: 'Pizza', orders: 240 },
        { name: 'Burger', orders: 139 },
        { name: 'Pasta', orders: 980 },
        { name: 'Salad', orders: 390 },
    ];
    const data2 = [
        { name: 'Pizza', rating: 4.2 },
        { name: 'Burger', rating: 3.8 },
        { name: 'Pasta', rating: 4.0 },
        { name: 'Salad', rating: 3.5 },
    ];


    const fetchRestaurant = async () => {
        try {
            const res = await axiosClient.get(`/restaurants/${uuid}/`);

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

    const fetchDiscounts = async () => {
        try {
            const res = await axiosClient.get(`/restaurants/${uuid}/discounts/`);

            if (res.status === 200) {
                setRestaurantDiscounts(res.data);
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

    const discountInfo = (discount) => {
        
        let discountType = discount.discount_type;
        let discountMinOrderAmount = discount.min_order_amount
        let discountLabel = "";
        let discountInfo = "";
        let validTill = new Date(discount.valid_to).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });

        if (discountType === "percentage") { 
            discountLabel = `${discount.amount}% off`;
        }
        else if (discountType === "fixed_amount") {
            discountLabel = `Rs. ${discount.amount} off`;
        }
        else if (discountType === "free_delivery") {
            discountLabel = "Free Delivery";
        }

        if (discountMinOrderAmount > 0) {
            discountInfo = `On orders above Rs. ${discountMinOrderAmount}`;
        }
        else if (discountMinOrderAmount == 0) {
            discountInfo = "No minimum order amount";
        }

        return (
            <>
                <h1 className='font-poppins font-semibold text-lg text-neutral-600 cursor-default truncate'>{discountLabel}</h1>
                <p className='text-sm font-roboto text-neutral-700 text-nowrap cursor-default truncate'>Valid till <span className='tracking-wider cursor-default font-hedwig'>{validTill}</span></p>
                <p className='text-sm font-roboto text-neutral-700 text-nowrap cursor-default truncate'>{discountInfo}</p>
            </>
        )
    }

    useEffect(() => {
        if (uuid) {
            fetchRestaurant();
            fetchDiscounts();
        } else {
            navigate('/');
        }
    }, []);

    return (
        <div className='absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center'>
            <div className='w-full h-full flex flex-col justify-start items-center py-4 px-8 mt-12 overflow-hidden'>
                <div className='border-[1.5px] border-neutral-500 w-full h-full rounded-md flex flex-col justify-start items-start overflow-y-auto'>
                    <div className='w-full h-fit flex justify-between items-center px-6 py-4 border-b-[1.5px] border-neutral-500'>
                        {!restaurant ? (
                            <>
                                <div className='w-28 h-10 bg-neutral-200 rounded' />
                                <div className='flex gap-2'>
                                    <div className='w-20 h-10 bg-neutral-200 rounded' />
                                    <div className='w-20 h-10 bg-neutral-200 rounded' />
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
                        <div className='w-full h-fit flex justify-between items-start mb-8'>
                            {!restaurant ? (
                                <div className='w-20 h-10 bg-neutral-200 rounded' />
                            ) : (
                                <>
                                    <div className='w-[50%] h-fit flex flex-col justify-start items-center'>
                                        <div className='w-full h-fit flex justify-center items-center gap-4'>
                                            <h1 className='font-poppins text-neutral-800 text-2xl cursor-default text-center'>Most Ordered Items of</h1>
                                            <Select
                                                value={mostOrderedItemPeriod}
                                                autoWidth
                                                onChange={e => setMostOrderedItemPeriod(e.target.value)}
                                                size='small'
                                                sx={{
                                                    minWidth: 120,
                                                    paddingRight: '8px',
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: 'gray',
                                                    },
                                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: '#262626',
                                                    },
                                                }}
                                            >
                                                <MenuItem value="week">The Week</MenuItem>
                                                <MenuItem value="month">The Month</MenuItem>
                                                <MenuItem value="all time">All Time</MenuItem>
                                            </Select>
                                        </div>
                                        <ResponsiveContainer width="100%" height={500}>
                                            <BarChart data={data} margin={{ top: 20, right: 30, left: 5, bottom: 5 }}>
                                                <CartesianGrid stroke="#737373" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="orders" fill="#262626" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className='w-[50%] h-fit flex flex-col justify-start items-start'>
                                        <h1 className='w-full h-fit mb-2 font-poppins text-neutral-800 text-2xl cursor-default text-center'>Highest Rated Items</h1>
                                        <ResponsiveContainer width="100%" height={500}>
                                            <BarChart data={data2} margin={{ top: 20, right: 30, left: 5, bottom: 5 }}>
                                                <CartesianGrid stroke="#737373" />
                                                <XAxis dataKey="name" />
                                                <YAxis type="number" domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]}/>
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="rating" fill="#262626" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </>
                            )}
                        </div>
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
                        <div className='w-full h-fit flex flex-col justify-start items-start mt-8'>
                            {!restaurantDiscounts ? (
                                <div className='w-20 h-10 bg-neutral-200 rounded' />
                            ) : (
                                <>
                                    <h1 className='w-full h-fit mb-2 font-poppins text-neutral-800 text-2xl cursor-default'>Discounts</h1>
                                    <div className='w-full min-h-24 grid grid-cols-4 auto-rows-auto gap-x-4 gap-y-2'>
                                        {restaurantDiscounts.map(discount => (
                                            <div key={discount.uuid} className='w-full h-full border-[1px] border-neutral-300 rounded-l-md flex justify-between items-center'>
                                                <div className='flex h-full w-fit overflow-hidden'>
                                                    <div className='h-full w-8 flex justify-center items-center'>
                                                        <span className='text-2xl text-neutral-700'>
                                                            <CiDiscount1 />
                                                        </span>
                                                    </div>
                                                    <div className='h-full w-fit p-2 flex flex-col justify-start items-start truncate'>
                                                        {discountInfo(discount)}
                                                    </div>
                                                </div>
                                                <div className='flex h-full w-fit'>
                                                    <div className='h-full w-8 cursor-pointer hover:bg-neutral-100 flex justify-center items-center border-l-[1px] border-neutral-300'>
                                                        <span className='text-neutral-800 text-xl'>
                                                            <MdEdit />
                                                        </span>
                                                    </div>
                                                    <div className='h-full w-8 cursor-pointer group hover:bg-rose-500 flex justify-center items-center border-l-[1px] border-neutral-300'>
                                                        <span className='text-rose-600 group-hover:text-white text-xl'>
                                                            <MdDeleteOutline />
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div onClick={() => {  }} className='w-full h-full border-[1.5px] border-emerald-500 hover:bg-green-100 rounded flex justify-center items-center cursor-pointer gap-2'>
                                            <span className='text-emerald-500 text-4xl'>
                                                <IoCreateOutline />
                                            </span>
                                            <h1 className='font-poppins text-emerald-500 text-3xl'>Create</h1>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className='w-full h-fit flex flex-col justify-start items-start mt-8'>
                            {!restaurant ? (
                                <div className='w-20 h-10 bg-neutral-200 rounded' />
                            ) : (
                                <>
                                    <h1 className='w-full h-fit mb-2 font-poppins text-neutral-800 text-2xl cursor-default'>Menu</h1>
                                    <div className='w-full min-h-24 grid grid-cols-4 auto-rows-auto gap-x-4 gap-y-2'>
                                        {restaurant.menu_items.map(item => (
                                            <div
                                                key={item.uuid}
                                                className='w-full h-[162px] group px-4 py-2 flex justify-between items-center border-[1px] border-neutral-400 rounded transition-transform duration-200 hover:border-neutral-500 relative'
                                            >
                                                <div className='flex-1 h-full flex flex-col justify-between items-start overflow-hidden'>
                                                    <div className='flex flex-col justify-center items-start'>
                                                        {!item.is_available && (
                                                            <h1 className='text-xs font-roboto font-semibold cursor-default text-red-700 bg-red-400 w-fit px-2 py-1 rounded text-nowrap'>Not Available</h1>
                                                        )}
                                                        <h1 className='text-lg font-roboto font-semibold truncate text-neutral-700 cursor-default'>{item.name}</h1>
                                                        <h1 className='text-xl text-nowrap font-hedwig text-neutral-700 cursor-default'>Rs. {item.price}</h1>
                                                    </div>
                                                    <div className='flex justify-normal items-center gap-2 opacity-0 group-hover:opacity-100'>
                                                        <button onClick={() => {  }} className="bg-white w-8 h-8 rounded-full flex justify-center items-center border-[1px] border-neutral-400 hover:bg-neutral-100">
                                                            <span className='text-neutral-800 text-lg'>
                                                                <MdEdit />
                                                            </span>
                                                        </button>
                                                        <button onClick={() => {  }} className="bg-rose-500 hover:bg-rose-600 w-8 h-8 rounded-full flex justify-center items-center">
                                                            <span className='text-white text-lg'>
                                                                <MdDeleteOutline />
                                                            </span>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className='w-1/2 h-full flex justify-center items-center overflow-hidden rounded-xl'>
                                                    <img src={item.image} alt="Image not found" className='w-full object-cover' />
                                                </div>
                                            </div>
                                        ))}
                                        <div onClick={() => {  }} className='w-full h-full border-[1.5px] border-emerald-500 hover:bg-green-100 rounded flex justify-center items-center cursor-pointer gap-2'>
                                            <span className='text-emerald-500 text-4xl'>
                                                <IoCreateOutline />
                                            </span>
                                            <h1 className='font-poppins text-emerald-500 text-3xl'>Create</h1>
                                        </div>
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
