import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import AuthContext from '../context/AuthContext';
import RestaurantInfo from '../components/RestaurantInfo';
import RestaurantMenu from '../components/RestaurantMenu';
import RestaurantDiscounts from '../components/RestaurantDiscounts';


const RestaurantPage = () => {
  
    let { uuid, slug } = useParams();
    let { setFailureMessage } = useContext(AuthContext);
    const [restaurant, setRestaurant] = useState(null);

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


    return (
        <div className="absolute top-0 left-0 w-full min-h-screen p-4 pt-12">
            <RestaurantInfo restaurant={restaurant} />
            <RestaurantDiscounts restaurant={restaurant} />
            <RestaurantMenu restaurant={restaurant} />
        </div>
    )
}

export default RestaurantPage
