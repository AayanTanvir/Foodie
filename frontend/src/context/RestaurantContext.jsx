import React, {createContext, useContext, useEffect, useState} from 'react'
import axiosClient from '../utils/axiosClient';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


export const RestaurantContext = createContext();

export const RestaurantContextProvider = ({ children }) => {

    const [restaurantUUID, setRestaurantUUID] = useState("");
    const [restaurant, setRestaurant] = useState(null);
    const [restaurants, setRestaurants] = useState([]);
    const [menuItemModifiers, setMenuItemModifiers] = useState(null);
    const [sideItems, setSideItems] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    let { setFailureMessage } = useContext(AuthContext);
    const navigate = useNavigate();

    const fetchRestaurant = async (uuid) => {
        try {
            const response = await axiosClient.get(`/restaurants/${uuid}`);
            
            if (response.status === 200) {
                setRestaurant(response.data || null);
                setRestaurantUUID(uuid);
            } else {
                setFailureMessage("Unexpected response.", response.status);
                setRestaurant(null);
                setRestaurantUUID("");
            }

        } catch (error) {
            setFailureMessage("An error occurred.", error.response?.status);
            setRestaurant(null);
            setRestaurantUUID("");
            navigate('/');
        }
    }

    const fetchRestaurants = async () => {
        try {
            const response = await axiosClient.get("/restaurants/");

            if (response.status === 200) {
                setRestaurants(response.data || null);
            } else {
                setFailureMessage("Unexpected response.", response.status);
                setRestaurants(null);
            }

        } catch (error) {
            setFailureMessage("An error occurred.", error.response?.status);
            setRestaurants(null);
        }
    };

    const getMenuItemModifiers = async () => {
        if (restaurantUUID === "") {
            console.error("Restaurant UUID is empty");
            setMenuItemModifiers(null);
            return;
        }

        try {
            const res = await axiosClient.get(`/restaurants/${restaurantUUID}/menu_item_modifiers`);

            if (res.status === 200) {
                setMenuItemModifiers(res.data || null);
            } else {
                console.log("Unexpected response status", res.status);
                setMenuItemModifiers(null);
            }
        } catch (error) {
            setFailureMessage("An error occurred while fetching item modifiers", error.response?.status);
            setMenuItemModifiers(null);
        }
    }

    const getSideItems = () => {
        if (!restaurant) return;
        const items = restaurant.menu_items.filter(item => item.is_side_item);
        setSideItems(items);
    }

    const getDiscounts = async () => {
        try {
            const response = await axiosClient.get(`/restaurants/${restaurant.uuid}/discounts`);
            if (response.status === 200) {
                setDiscounts(response.data);
            } else {
                setFailureMessage("Unexpected response", response.status);
                setDiscounts([]);
            }

        } catch (error) {
            setFailureMessage("An error occurred while fetching discounts.", error.response?.status);
            setDiscounts([]);
        }
    };

    useEffect(() => {
        fetchRestaurants();
    }, []);

    useEffect(() => {
        if (restaurantUUID !== "") {
            getMenuItemModifiers();
            getSideItems();
            getDiscounts();
        }
    }, [restaurantUUID])
    
    let context = {
        restaurant: restaurant,
        restaurants: restaurants,
        menuItemModifiers: menuItemModifiers,
        sideItems: sideItems,
        discounts: discounts,
        fetchRestaurant: fetchRestaurant,
    }

    return (
        <RestaurantContext.Provider value={context}>
            {children}
        </RestaurantContext.Provider>
    )
}