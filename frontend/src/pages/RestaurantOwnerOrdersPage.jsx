import React, { useState } from 'react';
import OwnerPendingOrders from '../components/OwnerPendingOrders';
import OwnerOrderStats from '../components/OwnerOrderStats';

const RestaurantOwnerOrdersPage = () => {
    const [orderItemsPopup, setOrderItemsPopup] = useState(null);

    const showOrderItems = (order) => {
        return
    }

    return (
        <div className='absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center mt-12'>
            <div className='w-full h-full flex flex-col justify-start items-center py-8 px-8 gap-6'>
                
                <OwnerPendingOrders showOrderItems={showOrderItems}/>
                <OwnerOrderStats />
              

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
