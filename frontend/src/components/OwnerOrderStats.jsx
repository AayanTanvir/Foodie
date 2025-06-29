import React from 'react'
import { PieChart, Tooltip, Pie, Cell, Legend } from 'recharts';

const OwnerOrderStats = () => {
    
    const data = [
        { name: 'Delivered', value: 142 },
        { name: 'Cancelled', value: 57 },
        { name: 'Declined', value: 14 },
    ];
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
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
                <h1 className='select-none text-4xl text-emerald-600 font-poppins'>Completions: <span className='text-4xl font-hedwig border-[1px] border-emerald-500 py-1 px-3 rounded-xl ml-5'>78%</span></h1>
                <h1 className='select-none text-4xl text-rose-600 font-poppins'>Cancellations: <span className='text-4xl font-hedwig border-[1px] border-rose-600 py-1 px-3 rounded-xl ml-5'>78%</span></h1>
                <h1 className='select-none text-4xl text-yellow-500 font-poppins'>Declined: <span className='text-4xl font-hedwig border-[1px] border-yellow-500 py-1 px-3 rounded-xl ml-5'>78%</span></h1>
            </div>
        </div>
    )
}

export default OwnerOrderStats
