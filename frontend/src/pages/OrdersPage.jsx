import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axiosClient from '../utils/axiosClient';
import { formatDate, getOrderStatus } from '../utils/Utils';

const OrdersPage = () => {

    let { user_uuid } = useParams();
    const [orders, setOrders] = useState(null);
    let navigate = useNavigate();
    const [sortedOrders, setSortedOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const res = await axiosClient.get(`/users/${user_uuid}/orders/`);
            if (res.status === 200) {
                setOrders(res.data);
            } else {
                console.error('Unexpected response status:', res.status);
                setOrders(null);
                navigate('/');
            }
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            setOrders(null);
            navigate('/');
        }
    }

    useEffect(() => {
        fetchOrders();
    }, [user_uuid]);

    useEffect(() => {
        if (orders && Array.isArray(orders)) {
            setSortedOrders([...orders].sort((a, b) => {
                if (a.created_at < b.created_at) {
                    return 1;
                }
                if (a.created_at > b.created_at) {
                    return -1;
                }
                return 0;
            }));
        }
    }, [orders])

    return (
        <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center pt-12 mb-4'>
            {orders?.length === 0 ? (
                <div className='w-[80%] h-full flex justify-center items-center'>
                    <h1 className='font-notoserif text-5xl text-neutral-800'>You have no orders yet.</h1>
                </div>
            ) : !orders ? (
                    <div className='w-[80%] h-full flex flex-col justify-start items-start pt-4 overflow-y-visible'>
                        <div className='w-full h-fit flex justify-between items-center gap-3 mb-4 pb-2'>
                            <h1 className='font-notoserif text-4xl text-neutral-800 cursor-default'>Your Orders</h1>
                        </div>
                        <div className='h-full w-full grid grid-cols-2 auto-rows-auto gap-4'>
                                <div className='w-full h-full bg-neutral-100 rounded-lg p-2 '></div>
                                <div className='w-full h-full bg-neutral-100 rounded-lg p-2 '></div>
                                <div className='w-full h-full bg-neutral-100 rounded-lg p-2 '></div>
                                <div className='w-full h-full bg-neutral-100 rounded-lg p-2 '></div>
                                <div className='w-full h-full bg-neutral-100 rounded-lg p-2 '></div>
                                <div className='w-full h-full bg-neutral-100 rounded-lg p-2 '></div>
                            <div className='w-full h-5'></div>
                        </div>
                    </div>
                ) : (
                    <div className='w-[80%] h-full flex flex-col justify-start items-start pt-4 overflow-y-visible'>
                        <div className='w-full h-fit flex justify-between items-center gap-3 mb-4 pb-2'>
                            <h1 className='font-notoserif text-4xl text-neutral-800 cursor-default'>Your Orders</h1>
                        </div>
                        <div className='h-fit w-full grid grid-cols-2 auto-rows-auto gap-4'>
                            {sortedOrders?.map((order) => (
                                <div key={order.uuid} onClick={() => navigate(`/orders/${order.uuid}`)} className='w-full h-fit flex flex-col justify-start items-start border-[1.5px] border-neutral-300 rounded-lg p-4 cursor-pointer transition hover:border-neutral-500'>
                                    <div className='w-full h-fit flex justify-between items-center'>
                                        <h1 className='font-poppins text-2xl text-neutral-700'>Rs. {Math.round(order?.discounted_price)} {order?.discounted_price !== order?.total_price && <span className='font-poppins line-through text-sm text-neutral-500'>{Math.round(order?.total_price)}</span>}</h1>
                                        <span className='font-poppins text-xs text-neutral-600'>{formatDate(order?.created_at)}</span>
                                    </div>
                                    <div className='w-full h-fit flex flex-col justify-start items-start'>
                                        <p className='font-roboto text-md text-neutral-600 capitalize'>At {order?.restaurant_name}</p>
                                        <span className={`px-2 py-1 rounded text-xs font-roboto font-semibold capitalize
                                        ${
                                            order.order_status === 'delivered'
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : order.order_status === 'cancelled' || order.order_status === 'declined'
                                            ? 'bg-rose-100 text-rose-700'
                                            : 'bg-neutral-200 text-neutral-700'
                                        }
                                        `}>
                                            {getOrderStatus(order?.order_status)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            <div className='w-full h-5'></div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default OrdersPage
