import React, { useState, useEffect } from 'react'
import axiosClient from '../utils/axiosClient';
import discount_svg from '../assets/discount.svg';


const RestaurantDiscounts = ({ restaurant }) => {

    const [discounts, setDiscounts] = useState([]);

    useEffect(() => {
        const getDiscounts = async () => {
            try {
                const response = await axiosClient.get(`/restaurants/${restaurant.uuid}/discounts`);
                if (response.status === 200) {
                    setDiscounts(response.data);
                } else {
                    alert("Unexpected response", response.status)
                }

            } catch (error) {
                alert("An error occurred while fetching discounts.", response.status);
            }
        };

        if (restaurant?.uuid) {
            getDiscounts();
        }
    }, [restaurant?.uuid]);

    if (!discounts || discounts.length === 0) {
        return null;
    }

    let discountInfo = (discount) => {
        
        let discountType = discount.discount_type;
        let discountMinOrderAmount = discount.min_order_amount
        let discountLabel = "";
        let discountInfo = "";
        let validTill = new Date(discount.valid_to).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });

        if (discountType === "percentage") { 
            discountLabel = `${discount.amount}% off`;
        }
        else if (discountType === "fixed_amount") {
            discountLabel = `Rs. ${discount.amount} off`;
        }
        else if (discountType === "free_delivery") {
            discountLabel = "Free Delivery";
        }

        if (discountMinOrderAmount > 0) {
            discountInfo = `On orders above Rs. ${discountMinOrderAmount}`;
        }
        else if (discountMinOrderAmount == 0) {
            discountInfo = "No minimum order amount";
        }

        return (
            <>
                <h1 className='font-poppins font-semibold text-lg text-neutral-600'>{discountLabel}</h1>
                <p className='text-sm text-neutral-700 text-nowrap'>Valid till <span className='tracking-wider font-hedwig'>{validTill}</span></p>
                <p className='text-sm font-roboto text-neutral-700 text-nowrap'>{discountInfo}</p>
            </>
        )
    }
    
    return (
        <div className='relative min-h-[10rem] w-full mt-5 px-48'>
            <div className='w-full h-[3rem]'>
                <h1 className='absolute left-48 text-left font-roboto font-semibold text-3xl text-neutral-800'>Discounts</h1>
            </div>
            <div className='w-[80%] h-fit grid grid-cols-3 auto-rows-auto gap-x-4 gap-y-2 '>
                {discounts.map((discount) => (
                    <div key={discount.id} className='w-full h-fit border-2 border-neutral-300 rounded-l-md flex justify-between items-center cursor-pointer transition duration-150 ease-out hover:border-neutral-500 hover:scale-[101%]'>
                        <div className='h-full w-fit ml-2 flex justify-center items-center'>
                            <img src={discount_svg} alt='' className='w-5 h-5' />
                        </div>
                        <div className='h-full flex-1 p-2 flex flex-col justify-start items-start'>
                            {discountInfo(discount)}
                        </div>
                        <div className='h-[100px] w-fit flex flex-col justify-evenly items-center mx-2 border-l-2 border-dashed pl-2 border-neutral-300'>
                            <div className='w-3 h-3 border-2 border-neutral-300 rounded-full'></div>
                            <div className='w-3 h-3 border-2 border-neutral-300 rounded-full'></div>
                            <div className='w-3 h-3 border-2 border-neutral-300 rounded-full'></div>
                            <div className='w-3 h-3 border-2 border-neutral-300 rounded-full'></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default RestaurantDiscounts
