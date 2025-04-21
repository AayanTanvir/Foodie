import React, { useState, useEffect } from 'react'

const RestaurantDiscounts = ({ restaurant }) => {

    const [discounts, setDiscounts] = useState([]);

    useEffect(() => {
        const getDiscounts = async () => {
            const response = await fetch(`http://localhost:8000/restaurants/${restaurant.uuid}/discounts`);
            const data = await response.json();
            setDiscounts(data);
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
                <h1 className='text-lg font-semibold font-roboto text-neutral-800 whitespace-nowrap cursor-default'>{discountLabel}</h1>
                <p className='text-sm font-roboto text-gray-500 whitespace-nowrap cursor-default'>{discountInfo}</p>
                <p className='text-[0.8rem] font-roboto text-gray-500 whitespace-nowrap cursor-default'>Valid until: {validTill}</p>
            </>
        )
    }
    
    return (
        <div className='relative min-h-[10rem] w-full mt-5 px-48'>
            <div className='w-full h-[3rem]'>
                <h1 className='absolute left-48 text-left font-roboto font-semibold text-3xl text-neutral-800'>Discounts</h1>
            </div>
            <div className="h-fit grid grid-cols-4 auto-rows-auto gap-4">
                {discounts.map((discount) => (
                    <div key={discount.id} className="relative w-full h-full border-2 border-gray-200 rounded-xl shadow-md p-2 flex flex-col justify-center items-start transition hover:border-gray-300 hover:bg-neutral-100">
                        {/* <h1 className='text-gray-500 font-roboto text-[0.75rem] absolute right-2 top-2'>Valid till: {</h1> */}
                        {discountInfo(discount)}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default RestaurantDiscounts
