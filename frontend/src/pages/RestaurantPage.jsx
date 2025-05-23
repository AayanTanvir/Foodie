import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RestaurantInfo from '../components/RestaurantInfo';
import RestaurantMenu from '../components/RestaurantMenu';
import RestaurantDiscounts from '../components/RestaurantDiscounts';
import { RestaurantContext } from '../context/RestaurantContext';


const RestaurantPage = () => {
    const { uuid } = useParams();
    const navigate = useNavigate();
    let { fetchRestaurant, restaurant } = useContext(RestaurantContext);

    useEffect(() => {
        fetchRestaurant(uuid);
    }, [uuid]);

    useEffect(() => {
        if (restaurant && restaurant.is_open === false) {
            navigate('/');
        }
    }, [restaurant, navigate]);

    if (!restaurant) {
        return null;
    }

    return (
        <div className="absolute top-0 left-0 w-full min-h-screen pt-12">
            <RestaurantInfo restaurant={restaurant} />
            <RestaurantDiscounts restaurant={restaurant} />
            <RestaurantMenu restaurant={restaurant} />
        </div>
    );
};

export default RestaurantPage;
