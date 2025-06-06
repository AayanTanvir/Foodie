import React, { useContext, useEffect, useState } from 'react'
import { RestaurantContext } from '../context/RestaurantContext'
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router-dom';

const ReviewsPopup = () => {
    const restaurantUUID = localStorage.getItem("restaurantUUID") ? localStorage.getItem("restaurantUUID") : null;
    const { setShowReviewsPopup } = useContext(RestaurantContext);
    const [reviews, setReviews] = useState(null);


    const fetchReviews = async () => {
        try {
            const res = await axiosClient.get(`/restaurants/${restaurantUUID}/reviews/`);
            if (res.status === 200) {
                setReviews(res.data);
                console.log(reviews);
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
    }, [restaurantUUID])

    return (
        <div>
            hi
        </div>
    )
}

export default ReviewsPopup
