import { useContext, useEffect } from 'react';
import { RestaurantContext } from '../context/RestaurantContext';
import { CiDiscount1 } from "react-icons/ci";


const RestaurantDiscounts = ({ restaurant }) => {

    const { discounts } = useContext(RestaurantContext);

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
                <h1 className='font-poppins font-semibold text-lg text-neutral-600 cursor-default'>{discountLabel}</h1>
                <p className='text-sm text-neutral-700 text-nowrap cursor-default'>Valid till <span className='tracking-wider cursor-default font-hedwig'>{validTill}</span></p>
                <p className='text-sm font-roboto text-neutral-700 text-nowrap cursor-default'>{discountInfo}</p>
            </>
        )
    }
    
    return (
        <div className='relative w-full max-w-4xl max-h-[16rem] mt-5 mx-auto flex flex-col justify-center items-center border-[1px] border-neutral-300 rounded-lg'>
            <div className='w-full h-[3rem] px-5 border-b-[1px] border-neutral-300 flex justify-start items-center'>
                <h1 className='text-3xl font-bold text-neutral-800 my-1'>Discounts</h1>
            </div>
            <div className='w-full h-full grid grid-cols-3 auto-rows-auto gap-x-4 gap-y-2 p-5 overflow-y-auto'>
                {discounts.map((discount) => (
                    <div key={discount.uuid} className='w-full h-fit border-[1px] border-neutral-300 rounded-l-md flex justify-between items-center'>
                        <div className='h-full w-fit ml-2 flex justify-center items-center'>
                            <span className='text-2xl text-neutral-700'>
                                <CiDiscount1 />
                            </span>
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
