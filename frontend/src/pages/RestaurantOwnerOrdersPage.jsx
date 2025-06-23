import React, { useContext, useEffect, useState } from 'react';
import { FiInbox } from 'react-icons/fi';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../utils/axiosClient';
import { GlobalContext } from '../context/GlobalContext';

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
                            <div className='w-full min-h-24 flex flex-col justify-start items-start'>
                                {pendingOrders.results.map((order, index) => (
                                    <div key={order.uuid} className={`w-full h-12 ${index === pendingOrders.results.length - 1 ? '' : 'border-b-[1px]'} border-neutral-400`} />
                                ))}
                            </div>
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
