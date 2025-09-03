import React, { useContext, useEffect, useState } from 'react';
import OwnerPendingOrders from '../components/OwnerPendingOrders';
import OwnerOrderStats from '../components/OwnerOrderStats';
import OwnerActiveOrders from '../components/OwnerActiveOrders';
import OwnerAllOrders from '../components/OwnerAllOrders';
import AuthContext from '../context/AuthContext';
import { GlobalContext } from '../context/GlobalContext';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../utils/axiosClient';

const RestaurantOwnerOrdersPage = () => {

    const [ownedRestaurants, setOwnedRestaurants] = useState(null);
    const { user } = useContext(AuthContext);
    const { setMessageAndMode } = useContext(GlobalContext);
    const navigate = useNavigate();

    const fetchOwnedRestaurants = async () => {
        try {
            const res = await axiosClient.get(`/owner/restaurants/?compact=true`);

            if (res.status === 200) {
                setOwnedRestaurants(res.data);
            } else {
                setMessageAndMode("Unexpected response", "failure");
                console.error("unexpected response status: ", res.status);
                navigate("/");
            }

        } catch (err) {
            console.error("Error while fetching owned restaurants", err);
            setMessageAndMode("An error occurred", "failure");
            navigate('/');
        }
    }

    useEffect(() => {
        if (user) {
            fetchOwnedRestaurants();
        }
    }, [])

    return (
        <div className='absolute top-0 left-0 w-full h-fit flex flex-col justify-center items-center mt-12'>
            <div className='w-full h-fit flex flex-col justify-start items-center py-8 px-8 gap-6'>

                <OwnerActiveOrders ownedRestaurants={ownedRestaurants} />
                <OwnerPendingOrders ownedRestaurants={ownedRestaurants} />
                <OwnerOrderStats />
                <OwnerAllOrders ownedRestaurants={ownedRestaurants} />

                <div className="w-full h-24" />
            </div>
        </div>
    )
}

export default RestaurantOwnerOrdersPage
