import React, { useContext, useEffect } from 'react'
import { GlobalContext } from '../context/GlobalContext'
import { useParams } from 'react-router-dom';
import { formatDateTime } from '../utils/Utils';

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

    useEffect(() => {
        if (currentOrder.uuid !== order_uuid) {
            window.location.href = '/';
        }
    }, [order_uuid])

    return (
        <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center pt-12 mb-4'>
            <div className='w-4/5 h-[90%] border-[1.75px] border-neutral-300 flex flex-col justify-start items-start'>
                <div className='w-full h-fit flex justify-center items-center px-6 py-2 gap-4'>
                    <div className='flex-1 h-0 border-b-[1px] border-neutral-400'></div>
                    <h1 className='cursor-default font-notoserif text-3xl text-neutral-800 '>Order</h1>
                    <div className='flex-1 h-0 border-b-[1px] border-neutral-400'></div>
                </div>
                <div className='w-full h-full flex-1 grid grid-rows-8 grid-cols-10 px-5 pb-5'>
                    <div className='border-[1.5px] border-neutral-300 p-4 flex justify-between items-center row-start-1 row-end-4 col-start-1 col-end-7 gap-2'>
                        <div className='h-full flex flex-col justify-start items-start gap-2'>
                            <p className='font-poppins cursor-default text-lg text-neutral-700 border-[1px] border-neutral-400 rounded-xl px-3 py-1'>
                                <span className='font-notoserif text-lg mr-1 cursor-default text-neutral-700'>From</span> {currentOrder.restaurantName || currentOrder.restaurant_name || "Unknown"}
                            </p> 
                            <p className='font-poppins cursor-default text-lg text-neutral-700 border-[1px] border-neutral-400 rounded-xl px-3 py-1'>
                                <span className='font-notoserif text-lg mr-1 cursor-default text-neutral-700'>To</span> {currentOrder.delivery_address || "Unknown"}
                            </p> 
                            <p className='font-poppins cursor-default text-lg text-neutral-700 border-[1px] border-neutral-400 rounded-xl px-3 py-1'>
                                <span className='font-notoserif text-lg mr-1 cursor-default text-neutral-700'>Placed on</span> {formatDateTime(currentOrder.created_at)}
                            </p>
                        </div>
                        <div className='h-full flex flex-col justify-start items-end gap-2'>
                            <p className='font-poppins cursor-default text-lg text-neutral-700 border-[1px] border-neutral-400 rounded-xl px-3 py-1'>
                                <span className='font-notoserif text-lg mr-1 cursor-default text-neutral-700'>Status</span> {getOrderStatus(currentOrder.order_status)}
                            </p>
                            <p className='font-poppins cursor-default text-lg text-neutral-700 border-[1px] border-neutral-400 rounded-xl px-3 py-1'>
                                <span className='font-notoserif text-lg mr-1 cursor-default text-neutral-700'>Payment Method</span> {getPaymentMethod(currentOrder.payment_method)}
                            </p>
                        </div>
                    </div>
                    <div className='border-[1.5px] border-neutral-300 p-4 flex justify-between items-center row-start-5 row-end-9 col-start-1 col-end-7'>
                        <div className='h-full flex flex-col justify-start items-start gap-2'>
                            <p className='font-hedwig cursor-default text-lg text-neutral-700 border-[1px] border-neutral-400 rounded-xl px-3 py-1'>
                                <span className='font-notoserif text-xl mr-4 cursor-default text-neutral-700'>Discount</span> Rs. {currentOrder.total_price - currentOrder.discounted_price}
                            </p>
                            <div className='w-fit h-fit border-[1px] border-neutral-400 rounded-xl px-3 py-1 flex justify-between items-start'>
                                <span className='font-notoserif text-xl mr-4 cursor-default text-neutral-700'>Total</span>
                                <div className='w-fit h-fit flex flex-col justify-start items-end'>
                                    <span className='font-hedwig cursor-default text-lg text-neutral-700'>Rs. {currentOrder.discounted_price}</span>
                                    <span className='font-poppins cursor-default text-xs text-neutral-500 line-through'>Rs. {currentOrder.total_price}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='border-[1.5px] border-neutral-300 p-4 flex flex-col justify-start items-start gap-2 row-start-1 row-end-9 col-start-8 col-end-11'>
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
