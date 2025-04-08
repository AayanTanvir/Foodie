import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import RestaurantInfo from '../components/RestaurantInfo';
import RestaurantMenu from '../components/RestaurantMenu';
import RestaurantDiscounts from '../components/RestaurantDiscounts';

const RestaurantPage = () => {
    const { uuid } = useParams();
    const { setFailureMessage } = useContext(AuthContext);
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        fetch(`http://127.0.0.1:8000/restaurants/${uuid}`)
            .then((response) => response.json())
            .then((data) => {
                setRestaurant(data || null);
                setLoading(false);
            })
            .catch((error) => {
                setFailureMessage(`${error}`);
                setRestaurant(null);
                setLoading(false);
            });
    }, [uuid]);

    useEffect(() => {
        if (restaurant && restaurant.is_open === false) {
            navigate('/');
        }
    }, [restaurant, navigate]);

    if (loading) {
        return <div className="pt-12 text-center">Loading...</div>;
    }

    if (!restaurant) {
        return <div className="pt-12 text-center">Restaurant not found.</div>;
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
