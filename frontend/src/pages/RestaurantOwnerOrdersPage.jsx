import React, { useContext, useEffect, useState } from 'react';
import { FiInbox } from 'react-icons/fi';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../utils/axiosClient';
import { GlobalContext } from '../context/GlobalContext';
import { formatDateTime, getOrderStatus } from '../utils/Utils';

const RestaurantOwnerOrdersPage = () => {
    const [pendingOrders, setPendingOrders] = useState(null);
    const { user } = useContext(AuthContext);
    const { setMessageAndMode } = useContext(GlobalContext);
    const navigate = useNavigate();

    const fetchPendingOrders = async (next=null) => {
        try {
            let res = null;
            if (!next) {
                res = await axiosClient.get(`owner/orders/pending/`);
            } else {
                res = await axiosClient.get(next);
            }

            if (res.status === 200) {
                setPendingOrders(res.data);
            } else {
                setMessageAndMode("Unexpected response", "failure");
                console.error("unexpected response status: ", res.status);
                navigate("/");
            }
        } catch (err) {
            console.error("Error while fetching orders", err);
            setMessageAndMode("An error occurred", "failure");
            navigate('/');
        }
    } 

    useEffect(() => {
        if (user) {
            fetchPendingOrders();
        }
    }, [])

    return (
        <div className='absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center mt-12'>
            <div className='w-full h-full flex flex-col justify-start items-center py-8 px-8 gap-6'>
                <div className='border-[1.5px] border-neutral-400 w-full h-fit rounded-md flex flex-col justify-start items-start'>
                    <div className='w-full h-fit border-b-[1.5px] border-neutral-400 px-4 py-2'>
                        <h1 className='cursor-default font-notoserif text-2xl text-neutral-800'>Pending Approvals</h1>
                    </div>
                    {pendingOrders ? (
                        Array.isArray(pendingOrders.results) && pendingOrders.results.length !== 0 ? (
                            <table className='w-full h-40 table-auto border-collapse'>
                                <thead className='border-b-[1.5px] border-neutral-400'>
                                    <tr className='text-neutral-700 font-opensans text-md cursor-default'>
                                        <th className='w-12 h-10 px-4'><div className='w-6 h-6 rounded-md border-[1px] border-neutral-400 cursor-pointer hover:border-neutral-600'/></th>
                                        <th>Restaurant</th>
                                        <th>Total Price / Discounted Price</th>
                                        <th>Payment Method</th>
                                        <th>Status</th>
                                        <th>Ordered At</th>
                                        <th className='w-[20rem] h-10'></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingOrders.results.map((order, index) => (
                                        <tr key={order.uuid} className={`text-neutral-700 relative h-16 ${index === pendingOrders.results.length - 1 ? '' : 'border-b-2 border-gray-200'}`}>
                                            <td className='w-12 h-10 px-4'>
                                                <div className='w-6 h-6 rounded-full border-[1px] border-neutral-400 cursor-pointer hover:border-neutral-600' />
                                            </td>
                                            <td className='text-center'>{order.restaurant_name}</td>
                                            <td className='text-center'>{order.total_price} / {order.discounted_price}</td>
                                            <td className='text-center'>{order.payment_method === "cash_on_delivery" ? "Cash" : order.payment_method === "card" && "Card"}</td>
                                            <td className='text-center'>{getOrderStatus(order.order_status)}</td>
                                            <td className='text-center'>{formatDateTime(order.created_at)}</td>
                                            <td>
                                                <div className='flex justify-center items-center w-full h-full gap-2'>
                                                    <button className='text-neutral-700 font-opensans border-neutral-400 border-[1px] rounded px-2 py-1 text-md transition duration-200 ease-in-out hover:text-neutral-100 hover:bg-neutral-800'>Show Items</button>
                                                    <button className='text-emerald-500 border-emerald-400 border-[1px] font-opensans rounded px-2 py-1 text-md transition duration-200 ease-in-out hover:text-neutral-100 hover:bg-emerald-500'>Accept</button>
                                                    <button className='text-rose-500 border-rose-400 border-[1px] font-opensans rounded px-2 py-1 text-md transition duration-200 ease-in-out hover:text-neutral-100 hover:bg-rose-500'>Decline</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className='w-full min-h-40 flex flex-col justify-center items-center'>
                                <h1 className='text-[5rem] text-neutral-300 cursor-default'><FiInbox /></h1>
                                <h1 className='text-3xl text-neutral-700 cursor-default font-poppins'>No incoming orders yet..</h1>
                            </div>
                        )
                    ) : (
                        <div className='w-full h-fit flex flex-col justify-start items-start gap-4 p-6'>
                            <div className='w-full h-20 bg-neutral-200 rounded' />
                            <div className='w-full h-20 bg-neutral-200 rounded' />
                            <div className='w-full h-20 bg-neutral-200 rounded' />
                        </div>
                    )}
                </div>
                <div className='border-[1.5px] border-neutral-400 w-full h-fit rounded-md flex flex-col justify-start items-start'>
                    <div className='w-full h-fit border-b-[1.5px] border-neutral-400 px-4 py-2'>
                        <h1 className='cursor-default font-notoserif text-2xl text-neutral-800'>Orders</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RestaurantOwnerOrdersPage
