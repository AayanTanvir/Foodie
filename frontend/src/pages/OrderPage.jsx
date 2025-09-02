import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { formatDate } from '../utils/Utils';
import axiosClient from '../utils/axiosClient';
import { RestaurantContext } from '../context/RestaurantContext';

const OrderPage = () => {
    const [order, setOrder] = useState({});
    let { order_uuid } = useParams();
    const [cancelConfirmPopup, setCancelConfirmPopup] = useState(null);
    const [showingCancelConfirm, setShowingCancelConfirm] = useState(false);
    const [isCancellingOrder, setIsCancellingOrder] = useState(false);
    let { setShowReviewsPopup, setReviewsPopupMode, setReviewItems } = useContext(RestaurantContext);
    const websocket = useRef(null);
    const navigate = useNavigate();

    const getPaymentMethod = (method) => {
        if (!method) return "Unknown";

        if (method === "cash_on_delivery") {
            return "Cash";
        } else if (method === "card") {
            return "Card";
        }
    }

    const getStatusValue = () => {
        switch (order.order_status) {
            case 'preparing':
                return "w-[14%]";
            case 'out_for_delivery':
                return "w-[47%]";
            case 'delivered':
                return "w-[82%]";
            default:
                return "w-0";
        }
    }

    const handleCancelOrder = async () => {
        try {
            setIsCancellingOrder(true);
            const res = await axiosClient.patch(`/orders/${order_uuid}/update/`, {
                order_status: "cancelled"
            });
            if (res.status === 200) {
                let newOrder = {...order, order_status: "cancelled"};
                setOrder(newOrder);
                setShowingCancelConfirm(false);
                setCancelConfirmPopup(null);
                setIsCancellingOrder(false);
            } else {
                console.error("Unexpected response:", res);
                setFailureMessage("Unexpected response. Please try again later.");
                setShowingCancelConfirm(false);
                setCancelConfirmPopup(null);
                setIsCancellingOrder(false);
            }
        } catch (err) {
            console.error("An error occurred while placing the order.", err);
            setFailureMessage("An error occurred. Please try again later.");
            setShowingCancelConfirm(false);
            setCancelConfirmPopup(null);
            setIsCancellingOrder(false);
        }
    }

    const showCancelConfirmPopup = () => {
        setShowingCancelConfirm(true);
        setCancelConfirmPopup(
            <div className='fixed z-50 top-0 left-0 w-full h-screen flex items-center justify-center flex-col bg-black/50'>
                <div className='w-[30%] h-1/2 bg-neutral-100 border-2 border-gray-200 flex flex-col justify-center items-center p-4'>
                    <h1 className='cursor-default font-notoserif text-3xl text-neutral-800 '>Are you sure?</h1>
                    <div className='w-1/2 h-fit flex justify-between items-center mt-4'>
                        <button onClick={() => { handleCancelOrder() }} disabled={isCancellingOrder} className={`w-16 h-fit rounded ${isCancellingOrder ? 'bg-neutral-600 cursor-not-allowed' : 'bg-neutral-800'} text-white p-2 whitespace-nowrap text-nowrap flex justify-center items-center font-poppins text-md mt-2`}>
                            Yes
                        </button>
                        <button onClick={() => { setShowingCancelConfirm(false) }} disabled={isCancellingOrder} className={`w-16 h-fit rounded ${isCancellingOrder ? 'bg-neutral-600 cursor-not-allowed' : 'bg-neutral-800'} text-white p-2 whitespace-nowrap text-nowrap flex justify-center items-center font-poppins text-md mt-2`}>
                            No
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    const fetchOrder = async () => {
        try {
            const res = await axiosClient.get(`/orders/${order_uuid}/`);
            if (res.status === 200) {
                setOrder(res.data);
            } else {
                console.error("Unexpected response:", res);
                setFailureMessage("Unexpected response. Please try again later.");
                navigate("/");
            }

        } catch (err) {
            console.error("An error occurred while placing the order.", err);
            setFailureMessage("An error occurred. Please try again later.");
            navigate("/");
        }
    }

    useEffect(() => {
        if (Object.keys(order).length === 0) {
            fetchOrder();
        }
    }, [order_uuid])

    useEffect(() => {
        const wsUrl = `ws://127.0.0.1:8000/ws/orders/${order_uuid}/status/`;
        websocket.current = new WebSocket(wsUrl);

        websocket.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.order_status) {
                setOrder(prevOrder => ({ ...prevOrder, order_status: data.order_status }));
            }
        }
        
        websocket.current.onerror = (error) => {
            console.error("Websocket connection error: ", error);
        }

        return () => {
            if (websocket.current && websocket.current.readyState === WebSocket.OPEN) {
                websocket.current.close();
            }
        };
    }, [])

    return (
        <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center pt-12 mb-4'>
            {showingCancelConfirm && (
                cancelConfirmPopup
            )}
            <div className='w-4/5 h-fit border-[1.75px] rounded border-neutral-300 flex flex-col justify-start items-start'>
                <div className='w-full h-fit flex justify-center items-center px-6 py-2 gap-4'>
                    <div className='flex-1 h-0 border-b-[1px] border-neutral-400'></div>
                    <h1 className='cursor-default font-notoserif text-3xl text-neutral-800 '>Order Receipt</h1>
                    <div className='flex-1 h-0 border-b-[1px] border-neutral-400'></div>
                </div>
                <div className='w-full h-full flex-1 grid grid-rows-8 grid-cols-10 px-5 pb-5'>
                    <div className='border-[1.5px] rounded border-neutral-300 flex flex-col justify-start items-start row-start-1 row-end-5 col-start-1 col-end-7'>
                        <div className='w-full h-fit p-4 flex flex-col justify-start items-start border-b-[1px] border-neutral-300'>
                            {order.order_status !== "cancelled" && order.order_status !== "delivered" && order.order_status !== "pending" && order.order_status !== "declined" ? (
                                <>
                                    <h1 className='font-notoserif text-2xl cursor-default text-neutral-700'>Status</h1>
                                    <div className='w-full flex flex-col justify-center items-center'>
                                        <div className='w-full h-5 border-[1.5px] border-neutral-400'>
                                            <div className={`${getStatusValue()} h-5 bg-neutral-700`}></div>
                                        </div>
                                        <div className='w-full h-fit flex justify-around items-center'>
                                            <h1 className='font-poppins text-sm cursor-default text-neutral-600'>Preparing</h1>
                                            <h1 className='font-poppins text-sm cursor-default text-neutral-600'>Out for Delivery</h1>
                                            <h1 className='font-poppins text-sm cursor-default text-neutral-600'>Delivered</h1>
                                        </div>
                                    </div>
                                </>
                            ) : order.order_status === "cancelled" ? (
                                <h1 className='font-notoserif text-2xl cursor-default text-neutral-700'>Status: <span className='font-notoserif text-2xl cursor-default text-rose-500'>Cancelled</span></h1>
                            ) : order.order_status === "delivered" ? (
                                <h1 className='font-notoserif text-2xl cursor-default text-neutral-700'>Status: <span className='font-notoserif text-2xl cursor-default text-neutral-800'>Delivered</span></h1>
                            ) : order.order_status === "pending" ? (
                                <h1 className='font-notoserif text-2xl cursor-default text-neutral-700'>Status: <span className='font-notoserif text-2xl cursor-default text-neutral-600'>Pending Approval</span></h1>
                            ) : order.order_status === "declined" && (
                                <h1 className='font-notoserif text-2xl cursor-default text-neutral-700'>Status: <span className='font-notoserif text-2xl cursor-default text-rose-500'>Order Declined</span></h1>
                            )}
                        </div>
                        <div className='w-full flex-1 flex flex-col justify-between items-center p-4'>
                            <div className='w-full flex justify-between items-center border-b-[1px] border-neutral-300'>
                                <p className='font-poppins text-neutral-700 text-md'>Date</p>
                                <p className='font-poppins text-neutral-600 text-md'>{formatDate(order?.created_at)}</p>
                            </div>
                            <div className='w-full flex justify-between items-center border-b-[1px] border-neutral-300'>
                                <p className='font-poppins text-neutral-700 text-md'>From</p>
                                <p className='font-poppins text-neutral-600 text-md'>{order?.restaurantName || order?.restaurant_name || "Unknown"}</p>
                            </div>
                            <div className='w-full flex justify-between items-center border-b-[1px] border-neutral-300'>
                                <p className='font-poppins text-neutral-700 text-md'>To</p>
                                <p className='font-poppins text-neutral-600 text-md text-right text-wrap whitespace-break-spaces overflow-auto'>{order?.delivery_address || "Unknown"}</p>
                            </div>
                            <div className='w-full flex justify-between items-center border-b-[1px] border-neutral-300'>
                                <p className='font-poppins text-neutral-700 text-md'>Payment Method</p>
                                <p className='font-poppins text-neutral-600 text-md'>{getPaymentMethod(order?.payment_method)}</p>
                            </div>
                            <div className='w-full flex justify-between items-center '>
                                <p className='font-poppins text-neutral-700 text-md'>Estimated Delivery</p>
                                <p className='font-poppins text-neutral-600 text-md text-nowrap'>10-20 Minutes</p>
                            </div>
                        </div>
                    </div>
                    <div className='border-[1.5px] rounded border-neutral-300 p-4 flex flex-col justify-start items-start gap-1 row-start-6 row-end-9 col-start-1 col-end-7'>
                        <div className='w-full flex justify-between items-center border-b-[1px] border-neutral-400'>
                            <p className='font-notoserif text-xl cursor-default text-neutral-700'>Discount</p>
                            <p className='font-hedwig cursor-default text-lg text-neutral-700'> Rs. {Math.round(order?.total_price) - Math.round(order?.discounted_price)}</p>
                        </div>
                        <div className='w-full flex justify-between items-center '>
                            <p className='font-notoserif text-xl cursor-default text-neutral-700'>Total</p>
                            <div className='flex flex-col justify-start items-end'>
                                <p className='font-hedwig cursor-default text-lg text-neutral-700'> Rs. {Math.round(order?.discounted_price)}</p>
                                {order?.total_price !== order?.discounted_price && (
                                    <p className='font-poppins cursor-default text-xs text-neutral-500 line-through'> Rs. {order?.total_price}</p>
                                )}
                            </div>
                        </div>
                        {order?.order_status === "cancelled" ? (
                            <div className='w-full flex-1 flex justify-center items-center'>
                                <button className='w-full h-5 rounded cursor-not-allowed bg-neutral-300 text-white p-4 whitespace-nowrap text-nowrap flex justify-center items-center font-poppins text-md mt-2'>
                                    Cancel Order
                                </button>
                            </div>
                        ) : (
                            <>
                                {order?.order_status === "delivered" ? (
                                    <button onClick={() => { setReviewsPopupMode("write"); setShowReviewsPopup(true); setReviewItems(order?.order_items) }} className='w-full h-5 rounded bg-neutral-800 text-white p-4 whitespace-nowrap text-nowrap flex justify-center items-center font-poppins text-md mt-2'>
                                        Write a Review
                                    </button>
                                ) : (
                                    <>
                                        <button className='w-full h-5 rounded cursor-not-allowed bg-neutral-300 text-white p-4 whitespace-nowrap text-nowrap flex justify-center items-center font-poppins text-md mt-2'>
                                            Write a Review
                                        </button>
                                        <div className='w-full flex-1 flex justify-center items-center'>
                                            <button onClick={() => { showCancelConfirmPopup(true) }} className='w-full h-5 rounded bg-neutral-800 text-white p-4 whitespace-nowrap text-nowrap flex justify-center items-center font-poppins text-md mt-2'>
                                                Cancel Order
                                            </button>
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                    <div className='border-[1.5px] rounded border-neutral-300 p-4 flex flex-col justify-start items-start gap-2 row-start-1 row-end-9 col-start-8 col-end-11'>
                        <div className='w-full border-b-[1px] border-neutral-400 mb-2'>
                            <h1 className='cursor-default font-notoserif text-2xl text-neutral-700'>Order Items</h1>
                        </div>
                        <div className="w-full h-fit flex flex-col justify-start items-start mb-2">
                            {(order?.order_items || []).map((orderItem) => (
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

export default OrderPage
