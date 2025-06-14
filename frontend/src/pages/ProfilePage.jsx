import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axiosClient from '../utils/axiosClient';
import { formatDate } from '../utils/Utils';
import AuthContext from '../context/AuthContext';
import { CapitalizeString } from '../utils/Utils';
import { IoMdClose } from 'react-icons/io';
import { FaCheckCircle } from 'react-icons/fa';

const ProfilePage = () => {

    let { user_uuid } = useParams();
    const [userInfo, setUserInfo] = useState({});
    let { verifyEmail } = useContext(AuthContext);
    const navigate = useNavigate();

    const fetchUserInfo = async () => {
        try {
            const res = await axiosClient(`/users/${user_uuid}/`);
            
            if (res.status === 200) {
                setUserInfo(res.data);
            } else {
                navigate('/');
                setUserInfo(null);
            }

        } catch (error) {
            setUserInfo(null);
            console.error(error);
            navigate('/');
        }
    }

    useEffect(() => {
        fetchUserInfo();
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
                <div className='w-full flex-1 flex flex-col justify-start items-start p-4 '>
                    <div className='w-full h-fit flex justify-between items-center gap-4'>
                        <p className='font-poppins text-xl text-neutral-800'>UUID</p>
                        <div className='w-full h-0 border-t-[1px] border-neutral-300'></div>
                        <p className='font-poppins text-xl text-neutral-800 text-nowrap'>{userInfo?.uuid}</p>
                    </div>
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
                    {!userInfo.is_email_verified && (
                        <button onClick={() => verifyEmail("send")} className='w-fit h-fit rounded-lg border-[1px] border-neutral-500 text-nowrap px-4 py-2 mt-4 font-poppins text-md'>
                            Verify Email
                        </button>
                    )} 
                </div>
            </div>
        </div>
    )
}

export default ProfilePage
