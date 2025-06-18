import React, { useContext, useEffect, useState } from 'react';
import { RestaurantContext } from '../context/RestaurantContext';
import axiosClient from '../utils/axiosClient';
import { CapitalizeString, formatDate } from '../utils/Utils';
import { FaStar } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { CartContext } from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import { GlobalContext } from '../context/GlobalContext';

const ReviewsPopup = ({ mode }) => {
    const restaurantUUID = localStorage.getItem("restaurantUUID") ? localStorage.getItem("restaurantUUID") : null;
    let { setShowReviewsPopup, reviewItems } = useContext(RestaurantContext);
    let { doCartItemAction } = useContext(CartContext);
    let { user } = useContext(AuthContext);
    let { setMessageAndMode } = useContext(GlobalContext);
    const [reviews, setReviews] = useState(null);
    const [writeReviewRating, setWriteReviewRating] = useState(1);
    const [writeReviewBody, setWriteReviewBody] = useState("");

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

    const submitReview = async () => {
        let writeReview = {
            body: writeReviewBody,
            rating: writeReviewRating,
            restaurant: restaurantUUID,
            user: user.uuid,
            items: reviewItems.map((item) => {
               return item.menu_item.uuid
            })
        }
        try {
            const res = await axiosClient.post("/reviews/create/", writeReview);
            if (res.status === 201) {
                setMessageAndMode("Review submitted!", "success");
                setShowReviewsPopup(false);
                setWriteReviewBody("");
                setWriteReviewRating(1);
            } else {
                console.error("Unexpected response from server: ", res.status);
                setMessageAndMode("Unexpected response from server", "failure");
                setShowReviewsPopup(false);
                setWriteReviewBody("");
                setWriteReviewRating(1);
            }
        } catch (err) {
            console.error("An error occurred while fetching reviews");
            console.error(err);
            setShowReviewsPopup(false);
            setMessageAndMode("An error occurred please try again.", "failure")
        }
    }
    
    useEffect(() => {
        if (!restaurantUUID) {
            setShowReviewsPopup(false);
        } else if (mode !== "write") {
            fetchReviews();
        }
    }, [])

    return (
        <div className='fixed z-50 top-0 left-0 w-full h-screen flex items-center justify-center flex-col bg-black/50'>
            {mode === "read" ? (
                <div className='w-2/4 h-3/4 bg-neutral-100 border-2 border-gray-200 rounded-lg overflow-y-auto py-4 px-5 relative'>
                    {reviews?.length === 0 ? (
                        <>
                            <div className='w-full h-fit flex justify-between items-center'>
                                <h1 className='text-xl cursor-default font-medium text-neutral-800'>Reviews</h1>
                                <span className='text-neutral-800 text-xl cursor-pointer' onClick={() => { setShowReviewsPopup(false) }}>
                                    <IoMdClose />
                                </span>
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
                                    <span className='text-neutral-800 text-xl cursor-pointer' onClick={() => { setShowReviewsPopup(false) }}>
                                        <IoMdClose />
                                    </span>
                                </div>
                                {reviews?.map((review) => (
                                    <div key={review.uuid} className='w-full min-h-16 rounded-md border-[1px] border-neutral-400 flex flex-col justify-start items-start gap-2 p-4'>
                                        <div className='w-full h-fit flex justify-between items-center'>
                                            <div className='flex gap-2'>
                                                <h1 className='text-lg text-neutral-700 font-poppins font-bold cursor-default'>{CapitalizeString(review.user_name)}</h1>
                                                <div className="flex items-center gap-1">
                                                    <span className='text-xl text-amber-400'>
                                                        <FaStar />
                                                    </span>
                                                    <span className="text-md text-neutral-700 mr-1 font-semibold cursor-default">{review.rating}</span>
                                                </div>
                                            </div>
                                            <p className='text-xs text-neutral-600 cursor-default'>{formatDate(review.created_at)}</p>
                                        </div>
                                        <div>
                                            <p className='text-md text-neutral-700 font-poppins font-medium text-wrap whitespace-break-spaces cursor-default'>{review.body}</p>
                                        </div>
                                        <div className='w-full h-fit grid auto-row-auto grid-cols-3 gap-2'>
                                            {review.items.map((item) => (
                                                <div key={item.uuid} className='w-full h-20 rounded-lg border-[1px] border-neutral-400 flex justify-between items-center'>
                                                    <div className='h-full w-[40%] flex justify-center items-center overflow-hidden'>
                                                        <img src={item.image} alt="" className='w-full h-full object-cover rounded-l-lg' />
                                                    </div>
                                                    <div className='h-full flex-1 flex flex-col justify-between items-start p-2 relative'>
                                                        <h1 className='text-md text-neutral-700 cursor-default'>{item.name}</h1>
                                                        {item.is_available ? (
                                                            <button onClick={() => { doCartItemAction(item, 'addItem') }} className='w-6 h-6 rounded-full border-2 border-neutral-300 flex justify-center items-center hover:border-neutral-500'>
                                                                <span className='text-neutral-500 text-lg cursor-default'>
                                                                    <FiPlus />
                                                                </span>
                                                            </button>
                                                        ) : (
                                                            <h1 className='text-md text-rose-700 font-roboto font-semibold cursor-default'>Unavailable</h1>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
            ) : (
                <div className='w-2/4 h-fit bg-neutral-100 border-2 border-gray-200 rounded-lg overflow-y-auto py-4 px-5 relative gap-2'>
                    <div className='w-full h-fit flex justify-between items-center mb-6'>
                        <h1 className='text-xl cursor-default font-medium text-neutral-800'>Write a Review</h1>
                        <img src={close} alt="Close" className='cursor-pointer' onClick={() => { setShowReviewsPopup(false) }} />
                    </div>
                    <textarea
                        className="w-full h-24 p-3 border-[1px] border-neutral-300 resize-none rounded-md transition duration-150 ease focus:outline-none focus:border-neutral-500"
                        pattern="[a-zA-Z0-9\s,.-]+"
                        placeholder="Review"
                        onChange={(e) => { setWriteReviewBody(e.target.value) }}
                        onInput={(e) => {
                            e.target.value = e.target.value.replace(/[^a-zA-Z0-9\s,.-]/g, "");
                        }}
                        value={writeReviewBody}
                    />
                    <div className='w-full h-fit flex justify-start items-center gap-2 mb-2'>
                        <input 
                            type="text"
                            inputMode='numeric'
                            className="w-10 h-10 text-center border-[1px] border-neutral-300 text-md rounded-md transition duration-150 ease focus:outline-none focus:border-neutral-500"
                            maxLength={1}
                            defaultValue={1}
                            onChange={(e) => { 
                                let val = parseInt(e.target.value, 10);
                                if (isNaN(val) || val < 1) val = 1;
                                if (val > 5) val = 5;
                                setWriteReviewRating(val);
                            }}
                            onInput={(e) => {
                                if (e.target.value > 5 || (e.target.value == 0 && e.target.value != "")) {
                                    e.target.value = 1
                                }
                                e.target.value = e.target.value.replace(/\D/g, "");
                            }}
                        />
                        <div className='w-fit h-fit flex justify-center items-center'>
                                {[...Array(writeReviewRating)].map((_, i) => (
                                    <img key={i} src={star} alt="star" />
                                ))}
                        </div>
                    </div>
                    <div className='w-full h-fit grid auto-row-auto grid-cols-3 gap-2'>
                        {reviewItems.map((item) => (
                            <div key={item.menu_item.uuid} className='w-full h-20 rounded-lg border-[1px] border-neutral-400 flex justify-between items-center'>
                                <div className='h-full w-[40%] flex justify-center items-center overflow-hidden'>
                                    <img src={item.menu_item.image} alt="" className='w-full h-full object-cover rounded-l-lg' />
                                </div>
                                <div className='h-full flex-1 flex flex-col justify-start items-start p-2 relative'>
                                    <h1 className='text-md text-neutral-700'>{item.menu_item.name}</h1>
                                    <h1 className='text-md text-neutral-700'>Rs. {item.menu_item.price}</h1>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='w-full h-fit flex justify-end items-center'>
                        {writeReviewBody.trim() !== "" ? (
                            <button onClick={() => { submitReview() }} className='w-fit bg-neutral-800 text-neutral-100 rounded px-4 py-2 '>
                                Submit
                            </button>
                        ) : (
                            <button className='w-fit bg-neutral-500 text-neutral-100 rounded px-4 py-2 cursor-not-allowed'>
                                Submit
                            </button>
                        )}
                    </div>
                </div>

            )}
        </div>
    )
}

export default ReviewsPopup
