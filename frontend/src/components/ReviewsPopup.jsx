import React, { useContext, useEffect, useState } from 'react'
import { RestaurantContext } from '../context/RestaurantContext'
import axiosClient from '../utils/axiosClient';

const ReviewsPopup = () => {
    const restaurantUUID = localStorage.getItem("restaurantUUID") ? localStorage.getItem("restaurantUUID") : null;
    const { setShowReviewsPopup } = useContext(RestaurantContext);
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
            <div className='w-2/4 h-3/4 bg-neutral-100 border-2 border-gray-200 flex flex-col justify-start items-center rounded-t-lg overflow-y-auto py-4 px-5 relative'>
                
            </div>
        </div>
    )
}

export default ReviewsPopup
