import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axiosClient from '../utils/axiosClient';

const ProfilePage = () => {

    let { user_uuid } = useParams();
    const [userInfo, setUserInfo] = useState([]);
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
        <div>
            
        </div>
    )
}

export default ProfilePage
