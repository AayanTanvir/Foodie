import React, { useContext, useEffect } from 'react'
import { GlobalContext } from '../context/GlobalContext'
import { useParams } from 'react-router-dom';
import { formatDate } from '../utils/Utils';

const CurrentOrderPage = () => {
    const { currentOrder } = useContext(GlobalContext);
    let { order_uuid } = useParams();

    const getOrderStatus = (status) => {
        if (!status) return "Unknown";
        
        if (status === "in_progress") {
            return "In Progress";
        } else if (status === "completed") {
            return "Completed";
        } else if (status === "cancelled") {
            return "Cancelled";
        }
    }

    const getPaymentMethod = (method) => {
        if (!method) return "Unknown";

        if (method === "cash_on_delivery") {
            return "Cash";
        } else if (method === "card") {
            return "Card";
        }
    }

    const getStatusValue = () => {
        if (currentOrder.order_status === "cancelled") return 'w-0';

        if (currentOrder.order_status === "in_progress") {
            return 'w-1/2'
        } else if (currentOrder.order_status === "completed") {
            return 'w-full';
        }
    }

    useEffect(() => {
        if (currentOrder.uuid !== order_uuid) {
            window.location.href = '/';
        }
    }, [order_uuid])

    return (
        <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center pt-12 mb-4'>
            <div className='w-4/5 h-[90%] border-[1.75px] rounded border-neutral-300 flex flex-col justify-start items-start'>
                <div className='w-full h-fit flex justify-center items-center px-6 py-2 gap-4'>
                    <div className='flex-1 h-0 border-b-[1px] border-neutral-400'></div>
                    <h1 className='cursor-default font-notoserif text-3xl text-neutral-800 '>Order</h1>
                    <div className='flex-1 h-0 border-b-[1px] border-neutral-400'></div>
                </div>
                <div className='w-full h-full flex-1 grid grid-rows-8 grid-cols-10 px-5 pb-5'>
                    <div className='border-[1.5px] rounded border-neutral-300 flex flex-col justify-start items-start row-start-1 row-end-5 col-start-1 col-end-7'>
                        <div className='w-full h-fit p-4 flex flex-col justify-start items-start border-b-[1px] border-neutral-300'>
                            {currentOrder.order_status !== "cancelled" ? (
                                <>
                                    <h1 className='font-notoserif text-2xl cursor-default text-neutral-700'>Status</h1>
                                    <div className='w-full flex flex-col justify-center items-center'>
                                        <div className='w-full h-5 border-[1.5px] border-neutral-400'>
                                            <div className={`${getStatusValue()} h-5 bg-neutral-700`}></div>
                                        </div>
                                        <div className='w-full h-fit flex justify-between items-center'>
                                            <h1 className='font-poppins text-sm cursor-default text-neutral-600'>Order Placed</h1>
                                            <h1 className='font-poppins text-sm cursor-default text-neutral-600'>In Progress</h1>
                                            <h1 className='font-poppins text-sm cursor-default text-neutral-600'>Completed</h1>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <h1 className='font-notoserif text-2xl cursor-default text-neutral-700'>Status: Cancelled</h1>
                            )}
                        </div>
                        <div className='w-full flex-1 flex justify-center items-center'>
                            <div className='w-1/2 h-full p-4 flex flex-col justify-center items-center border-r-[1px] border-neutral-300'>
                                <div className='w-full flex justify-between items-center gap-2'>
                                    <p className='font-poppins text-neutral-700 text-md'>Date</p>
                                    <p className='font-poppins text-neutral-600 text-md'>{formatDate(currentOrder.created_at)}</p>
                                </div>
                                <div className='w-full flex justify-between items-center gap-2'>
                                    <p className='font-poppins text-neutral-700 text-md'>From</p>
                                    <p className='font-poppins text-neutral-600 text-md'>{currentOrder.restaurantName || currentOrder.restaurant_name || "Unknown"}</p>
                                </div>
                                <div className='w-full flex justify-between items-center gap-2'>
                                    <p className='font-poppins text-neutral-700 text-md'>To</p>
                                    <p className='font-poppins text-neutral-600 text-md text-right'>{currentOrder.delivery_address || "Unknown"}</p>
                                </div>
                                <div className='w-full flex justify-between items-center gap-2'>
                                    <p className='font-poppins text-neutral-700 text-md'>Payment Method</p>
                                    <p className='font-poppins text-neutral-600 text-md'>{getPaymentMethod(currentOrder.payment_method)}</p>
                                </div>
                            </div>
                            <div className='w-1/2 h-full pt-5 p-4 flex flex-col justify-start items-center border-r-[1px] border-neutral-300'>
                                <div className='w-full flex justify-between items-center gap-2'>
                                    <p className='font-poppins text-neutral-700 text-sm'>ID</p>
                                    <p className='font-poppins text-neutral-600 text-sm text-nowrap'>{currentOrder.uuid}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='border-[1.5px] rounded border-neutral-300 p-4 flex justify-between items-center row-start-6 row-end-9 col-start-1 col-end-7'>
                        <div className='w-full h-full flex flex-col justify-start items-start gap-2'>
                            <div className='w-full flex justify-between items-center border-b-[1px] border-neutral-400'>
                                <p className='font-notoserif text-xl cursor-default text-neutral-700'>Discount</p>
                                <p className='font-hedwig cursor-default text-lg text-neutral-700'> Rs. {currentOrder.total_price - currentOrder.discounted_price}</p>
                            </div>
                            <div className='w-full flex justify-between items-center border-b-[1px] border-neutral-400'>
                                <p className='font-notoserif text-xl cursor-default text-neutral-700'>Total</p>
                                <div className='flex flex-col justify-start items-end'>
                                    <p className='font-hedwig cursor-default text-lg text-neutral-700'> Rs. {currentOrder.discounted_price}</p>
                                    {currentOrder.total_price - currentOrder.discounted_price !== currentOrder.total_price && (
                                        <p className='font-poppins cursor-default text-xs text-neutral-500 line-through'> Rs. {currentOrder.total_price}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='border-[1.5px] rounded border-neutral-300 p-4 flex flex-col justify-start items-start gap-2 row-start-1 row-end-9 col-start-8 col-end-11'>
                        <div className='w-full border-b-[1px] border-neutral-400 mb-2'>
                            <h1 className='cursor-default font-notoserif text-2xl text-neutral-700'>Order Items</h1>
                        </div>
                        <div className="w-full h-fit flex flex-col justify-start items-start mb-2">
                            {currentOrder.order_items_read.map((orderItem) => (
                                <div key={orderItem.menu_item.uuid} className="w-full h-fit flex justify-between items-start mb-3">
                                    <div className="flex justify-start items-start w-fit h-fit">
                                        {orderItem.menu_item.is_side_item ? (
                                            <h1 className="text-md font-poppins text-neutral-700 text-left cursor-default">{orderItem.quantity} x {orderItem.menu_item.name}</h1>
                                        ) : (
                                            <>
                                                <span className="text-md font-poppins text-neutral-700 text-left cursor-default">{orderItem.quantity}</span>
                                                <span className="text-md font-poppins text-neutral-700 text-left cursor-default mx-1">x</span>
                                                <div className="h-fit flex flex-col justify-start items-start">
                                                    <span className="text-md font-poppins text-neutral-700 text-left cursor-default">{orderItem.menu_item.name}</span>
                                                    {orderItem.modifiers.map((modifier) => (
                                                        <span key={modifier.id} className="text-sm font-poppins text-neutral-700 text-left cursor-default">+ {modifier.label}</span>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <h1 className="text-md font-hedwig text-neutral-700 text-left cursor-default">Rs. {orderItem.subtotal}</h1>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CurrentOrderPage
