import React, { useState } from 'react';
import OwnerPendingOrders from '../components/OwnerPendingOrders';
import OwnerOrderStats from '../components/OwnerOrderStats';
import OwnerActiveOrders from '../components/OwnerActiveOrders';
import OwnerAllOrders from '../components/OwnerAllOrders';

const RestaurantOwnerOrdersPage = () => {

    return (
        <div className='absolute top-0 left-0 w-full h-fit flex flex-col justify-center items-center mt-12'>
            <div className='w-full h-fit flex flex-col justify-start items-center py-8 px-8 gap-6'>
                
                <OwnerActiveOrders />
                <OwnerPendingOrders />
                <OwnerOrderStats />
                <OwnerAllOrders />

                <div className="w-full h-24" />
            </div>
        </div>
    )
}

export default RestaurantOwnerOrdersPage
