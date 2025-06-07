import React, { useContext, useEffect, useState } from 'react';
import { RestaurantContext } from '../context/RestaurantContext';
import axiosClient from '../utils/axiosClient';
import { CapitalizeString, formatDate } from '../utils/Utils';
import star from '../assets/star.svg';
import add from '../assets/add.svg';
import close from '../assets/close.svg';
import { CartContext } from '../context/CartContext';

const ReviewsPopup = ({ mode }) => {
    const restaurantUUID = localStorage.getItem("restaurantUUID") ? localStorage.getItem("restaurantUUID") : null;
    const { setShowReviewsPopup } = useContext(RestaurantContext);
    const { doCartItemAction } = useContext(CartContext);
    const [reviews, setReviews] = useState(null);


    const fetchReviews = async () => {
        try {
            const res = await axiosClient.get(`/restaurants/${restaurantUUID}/reviews/`);
            if (res.status === 200) {
                setReviews(res.data);
            } else {
                console.error("Unexpected response from server: ", res.status);
                setReviews(null);
                setShowReviewsPopup(false);
            }
        } catch (err) {
            console.error("An error occurred while fetching reviews");
            console.error(err);
            setShowReviewsPopup(false);
        }
    }
    
    useEffect(() => {
        if (!restaurantUUID) {
            setShowReviewsPopup(false);
        } else {
            fetchReviews();
        }
    }, [])

    console.log(reviews);

    return (
        <div className='fixed z-50 top-0 left-0 w-full h-screen flex items-center justify-center flex-col bg-black/50'>
            <div className='w-2/4 h-3/4 bg-neutral-100 border-2 border-gray-200 rounded-lg overflow-y-auto py-4 px-5 relative'>
            {mode === "read" ? (
                reviews?.length === 0 ? (
                    <>
                        <div className='w-full h-fit flex justify-between items-center'>
                            <h1 className='text-xl cursor-default font-medium text-neutral-800'>Reviews</h1>
                            <img src={close} alt="Close" className='cursor-pointer' onClick={() => { setShowReviewsPopup(false) }}/>
                        </div>
                        <h1 className='text-3xl text-neutral-800 font-semibold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>No reviews..</h1>
                    </>
                ) : !reviews ? (
                        <div className='w-full h-fit flex flex-col justify-start items-center'>
                            <div className='w-full h-16 rounded-md bg-neutral-200'></div>
                            <div className='w-full h-16 rounded-md bg-neutral-200'></div>
                            <div className='w-full h-16 rounded-md bg-neutral-200'></div>
                            <div className='w-full h-16 rounded-md bg-neutral-200'></div>
                        </div>
                    ) : (
                        <div className='w-full h-fit flex flex-col justify-start items-center gap-4 '>
                            <div className='w-full h-fit flex justify-between items-center'>
                                <h1 className='text-xl cursor-default font-medium text-neutral-800'>Reviews</h1>
                                <img src={close} alt="Close" className='cursor-pointer' onClick={() => { setShowReviewsPopup(false) }}/>
                            </div>
                            {reviews.map((review) => (
                                <div key={review.uuid} className='w-full min-h-16 rounded-md border-[1px] border-neutral-400 flex flex-col justify-start items-start gap-2 p-4'>
                                    <div className='w-full h-fit flex justify-between items-center'>
                                        <div className='flex gap-2'>
                                            <h1 className='text-lg text-neutral-700 font-poppins font-bold'>{CapitalizeString(review.user_name)}</h1>
                                            <div className="flex items-center">
                                                <img src={star} alt="star" className="w-5 h-5" />
                                                <span className="text-md text-neutral-700 mr-1">{review.rating}</span>
                                            </div>
                                        </div>
                                        <p className='text-xs text-neutral-600'>{formatDate(review.created_at)}</p>
                                    </div>
                                    <div>
                                        <p className='text-md text-neutral-700 font-poppins font-medium text-wrap whitespace-break-spaces'>{review.body}</p>
                                    </div>
                                    <div className='w-full h-fit grid auto-row-auto grid-cols-3 gap-2'>
                                        {review.items.map((item) => (
                                            <div key={item.uuid} className='w-full h-20 rounded-lg border-[1px] border-neutral-400 flex justify-between items-center'>
                                                <div className='h-full w-[40%] flex justify-center items-center overflow-hidden'>
                                                    <img src={item.image} alt="" className='w-full h-full object-cover rounded-l-lg' />
                                                </div>
                                                <div className='h-full flex-1 flex flex-col justify-between items-start p-2 relative'>
                                                    <h1 className='text-md text-neutral-700'>{item.name}</h1>
                                                    {item.is_available ? (
                                                        <button onClick={() => { doCartItemAction(item, 'addItem') }} className='w-6 h-6 rounded-full border-[1px] border-neutral-300 flex justify-center items-center hover:border-neutral-500'>
                                                            <img src={add} alt="+" className='w-5'/>
                                                        </button>
                                                    ) : (
                                                        <h1 className='text-md text-rose-700 font-roboto font-semibold'>Unavailable</h1>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
            ) : (
                <h1>WRITE MODE</h1>
            )}
            </div>
        </div>
    )
}

export default ReviewsPopup
