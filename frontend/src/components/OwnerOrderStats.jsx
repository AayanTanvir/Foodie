import React, { useContext, useEffect, useState } from 'react'
import { PieChart, Tooltip, Pie, Cell, Legend } from 'recharts';
import AuthContext from '../context/AuthContext';
import { GlobalContext } from '../context/GlobalContext';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../utils/axiosClient';
import { sendRequest } from '../utils/Utils';

const OwnerOrderStats = () => {
    const [orders, setOrders] = useState(null);
    const { user } = useContext(AuthContext);
    const { setMessageAndMode } = useContext(GlobalContext);
    const navigate = useNavigate();

    const data = [
        { name: 'Delivered', value: orders?.delivered_orders },
        { name: 'Cancelled', value: orders?.cancelled_orders },
        { name: 'Declined', value: orders?.declined_orders },
    ];

    const fetchOrders = async () => {
        const res = await sendRequest({
            method: "get",
            to: '/owner/orders/stats/'
        });

        if (res) {
            setOrders(res.data);
        } else {
            setMessageAndMode("An error occurred.", "failure");
            navigate("/");
        }
    }

    useEffect(() => {
        if (user) {
            fetchOrders();
        } else {
            navigate('/');
        }
    }, [])
    
    if (orders?.delivered_orders + orders?.cancelled_orders + orders?.declined_orders === 0) {
        return null
    }

    return !orders ? (
        <div className='w-full h-96 flex justify-center items-center bg-neutral-200 rounded-lg' />
    ) : (
        <div className='w-full h-fit flex justify-center items-center gap-20 relative'>
            <h1 className='font-poppins text-3xl text-neutral-700 select-none absolute top-2'>Order Performance</h1>
            <div className='max-w-md p-4 rounded-xl flex flex-col justify-center items-center gap-2'>
                <PieChart width={400} height={400}>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%" cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        label
                        className='outline-none focus:outline-none select-none'
                    >
                        <Cell fill='#059669' />
                        <Cell fill='#e11d48' />
                        <Cell fill='#eab308' />
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </div>
            <div className='h-full w-fit flex flex-col justify-center items-center gap-8'>
                <h1 className='select-none text-4xl text-emerald-600 font-poppins'>Delivered: <span className='text-4xl font-hedwig border-[1px] border-emerald-500 py-1 px-3 rounded-xl ml-5'>{orders?.delivered_percentage}%</span></h1>
                <h1 className='select-none text-4xl text-rose-600 font-poppins'>Cancelled: <span className='text-4xl font-hedwig border-[1px] border-rose-600 py-1 px-3 rounded-xl ml-5'>{orders?.cancelled_percentage}%</span></h1>
                <h1 className='select-none text-4xl text-yellow-500 font-poppins'>Declined: <span className='text-4xl font-hedwig border-[1px] border-yellow-500 py-1 px-3 rounded-xl ml-5'>{orders?.declined_percentage}%</span></h1>
            </div>
        </div>
    );
}

export default OwnerOrderStats
