import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { formatDate, sendRequest } from '../utils/Utils';
import AuthContext from '../context/AuthContext';
import { CapitalizeString } from '../utils/Utils';
import { IoMdClose } from 'react-icons/io';
import { FaCheckCircle } from 'react-icons/fa';
import { GlobalContext } from '../context/GlobalContext';
import { MdDeleteOutline, MdEdit } from 'react-icons/md';
import { IoCreateOutline } from 'react-icons/io5';

const ProfilePage = () => {

    const { user_uuid } = useParams();
    const [userInfo, setUserInfo] = useState({});
    const [userRestaurants, setUserRestaurants] = useState([]);
    const { verifyEmail, user } = useContext(AuthContext);
    const { setMessageAndMode } = useContext(GlobalContext);
    const navigate = useNavigate();

    const fetchUserInfo = async () => {
        const res = await sendRequest({
            method: 'get',
            to: `/users/${user_uuid}/`
        });

        if (res) {
            setUserInfo(res.data);
        } else {
            setUserInfo(null);
            setUserRestaurants(null);
            setMessageAndMode("An error occurred.");
            navigate('/');
        }
    }

    const fetchUserRestaurants = async () => {
        const res = await sendRequest({
            method: "get",
            to: "/owner/restaurants/",
        });

        if (res) {
            setUserRestaurants(res.data);
        } else {
            setUserInfo(null);
            setUserRestaurants(null);
            setMessageAndMode("An error occurred.");
            navigate('/');
        }
            
    }

    useEffect(() => {
        if (user && user.uuid === user_uuid) {
            fetchUserInfo();
            if (user.groups && user.groups.includes("restaurant owner")) {
                fetchUserRestaurants();
            }
        } else {
            setMessageAndMode("You can only view your own profile.", "failure");
            navigate('/');
        }
    }, [user_uuid])

    return (
        <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center pt-12'>
            <div className='w-3/5 h-4/5 border-[1.5px] border-neutral-300 rounded flex flex-col justify-start items-start'>
                <div className='w-full h-fit p-4 border-b-[1px] border-neutral-300 flex justify-between items-center'>
                    <h1 className='font-notoserif text-neutral-800 text-4xl cursor-default'>
                        {userInfo?.username
                            ? CapitalizeString(userInfo.username)
                            : "Unknown"
                        }
                    </h1>
                    <div className='w-fit h-full flex justify-center items-center gap-2'>
                        {userInfo?.is_email_verified ? (
                            <>
                                <span className='text-lime-500 text-2xl'>
                                    <FaCheckCircle />
                                </span>
                                <h1 className='font-poppins text-neutral-800 text-lg cursor-default'>Verified</h1>
                            </>
                        ) : (
                            <>
                                <span className='text-rose-500 cursor-pointer text-xl'>
                                    <IoMdClose />
                                </span>
                                <h1 className='font-poppins text-neutral-800 text-lg cursor-default'>Unverified</h1>
                            </>
                        )}
                    </div>
                </div>
                <div className='w-full h-fit flex flex-col justify-start items-start p-4 '>
                    <div className='w-full h-fit flex justify-between items-center gap-4'>
                        <p className='font-poppins text-xl text-neutral-800'>Email</p>
                        <div className='w-full h-0 border-t-[1px] border-neutral-300'></div>
                        <p className='font-poppins text-xl text-neutral-800 text-nowrap'>{userInfo?.email}</p>
                    </div>
                    <div className='w-full h-fit flex justify-between items-center gap-4'>
                        <p className='font-poppins text-xl text-neutral-800 text-nowrap'>Date Joined</p>
                        <div className='w-full h-0 border-t-[1px] border-neutral-300'></div>
                        <p className='font-poppins text-xl text-neutral-800 text-nowrap'>{formatDate(userInfo?.date_joined)}</p>
                    </div>
                    <div className='w-full h-fit flex justify-between items-center mt-4'>
                        {!userInfo.is_email_verified && (
                            <button onClick={() => verifyEmail("send")} className='w-fit h-fit rounded-lg border-[1px] border-neutral-800/50 text-neutral-700 text-nowrap px-4 py-2 font-poppins text-md transition hover:bg-gray-100/50'>
                                Verify Email
                            </button>
                        )}
                        <div className={`w-fit h-full rounded border-[1px] px-4 py-2 border-neutral-800/50 flex justify-center items-center`}>
                            <p className='text-nowrap text-neutral-700 font-poppins text-lg'>Orders - {userInfo?.order_count || 0}</p>
                        </div>
                    </div>
                </div>
                    {userInfo?.is_email_verified ? (
                        <div className='flex-1 w-full flex flex-col justify-start items-start'>
                            <h1 className='text-neutral-700 font-opensans font-semibold text-2xl mx-auto'>Restaurants</h1>
                            <div className='w-full h-full grid auto-rows-auto grid-cols-3 items-start gap-4 p-4'>
                                {userRestaurants.length > 0 && userRestaurants.map((restaurant) => (
                                    <div key={restaurant.uuid} onClick={() => { navigate(`/restaurant-owner/restaurants/${restaurant.uuid}`) }} className='w-full h-48 border-[1px] border-neutral-400 rounded flex flex-col justify-start items-center cursor-pointer transition duration-150 ease-out select-none'>
                                        <div className='w-full h-[60%] flex justify-center items-center overflow-hidden'>
                                            <img src={restaurant.image} alt="" className='w-full object-cover' />
                                        </div>
                                        <div className='w-full flex-1 flex justify-center items-center gap-2'>
                                            <div className='flex-1 h-0 border-b-[1px] border-neutral-400'></div>
                                            <p className='font-poppins text-2xl font-bold text-neutral-800'>{restaurant.name}</p>
                                            <div className='flex-1 h-0 border-b-[1px] border-neutral-400'></div>
                                        </div>
                                    </div>
                                ))}
                                <div onClick={() => { navigate('/create-restaurant') }} className='w-full h-48 border-[1.5px] border-emerald-500 transition duration-150 ease-out hover:bg-green-100 rounded flex justify-center items-center cursor-pointer gap-2'>
                                    <span className='text-emerald-500 text-4xl'>
                                        <IoCreateOutline />
                                    </span>
                                    <h1 className='font-poppins text-emerald-500 text-3xl'>Create</h1>
                                </div>

                            </div>
                        </div>
                    ) : (
                        <div className='flex-1 w-full flex flex-col justify-center items-center'>
                            <h1 className='text-neutral-700 font-opensans font-semibold text-2xl mx-auto'>Verify your email to create your own restaurants</h1>
                        </div>
                    )}
            </div>
        </div>
    )
}

export default ProfilePage
