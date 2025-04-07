import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AuthContext from '../context/AuthContext';
import RestaurantInfo from '../components/RestaurantInfo';
import RestaurantMenu from '../components/RestaurantMenu';
import RestaurantDiscounts from '../components/RestaurantDiscounts';


const RestaurantPage = () => {
  
    let { uuid } = useParams();
    let { setFailureMessage } = useContext(AuthContext);
    const [restaurant, setRestaurant] = useState(null);
    let navigate = useNavigate()

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/restaurants/${uuid}`)
            .then((response) => response.json())
            .then((data) => {
                if (data) {
                    setRestaurant(data); 
                } else {
                    setRestaurant(null);
                }
            })
            .catch((error) => {
                setFailureMessage(`${error}`);
                setRestaurant(null);
            });
    }, [uuid]);

    useEffect(() => {
        if (restaurant.is_open == false) {
            navigate('/');
        }
    }, [restaurant, navigate]);


    return (
        <div className="absolute top-0 left-0 w-full min-h-screen  pt-12">
            <RestaurantInfo restaurant={restaurant} />
            <RestaurantDiscounts restaurant={restaurant} />
            <RestaurantMenu restaurant={restaurant} />
        </div>
    )
}

export default RestaurantPage
