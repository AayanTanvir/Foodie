import React, {createContext, useContext, useEffect, useState} from 'react'
import axiosClient from '../utils/axiosClient';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from './GlobalContext';
import { sendRequest } from '../utils/Utils';
import { MdDesignServices } from 'react-icons/md';


export const RestaurantContext = createContext();

export const RestaurantContextProvider = ({ children }) => {

    const [restaurantUUID, setRestaurantUUID] = useState(localStorage.getItem("restaurantUUID") || "");
    const [restaurant, setRestaurant] = useState(null);
    const [restaurants, setRestaurants] = useState([]);
    const [menuItemModifiers, setMenuItemModifiers] = useState(null);
    const [sideItems, setSideItems] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [showReviewsPopup, setShowReviewsPopup] = useState(false);
    const [reviewsPopupMode, setReviewsPopupMode] = useState("read");
    const [reviewItems, setReviewItems] = useState([]);
    let { user } = useContext(AuthContext);
    let { setMessageAndMode } = useContext(GlobalContext);
    const navigate = useNavigate();

    const fetchRestaurant = async (uuid) => {
        const res = await sendRequest({
            method: 'get',
            to: `/restaurants/${uuid}/`,
        });

        if (res) {
            setRestaurant(res.data);
            setRestaurantUUID(uuid);
            localStorage.setItem("restaurantUUID", uuid);
        } else {
            setMessageAndMode("An error occurred");
            setRestaurant(null);
            setRestaurantUUID("");
            navigate('/');
        }
    }

    const fetchRestaurants = async () => {
        const res = await sendRequest({
            method: 'get',
            to: '/restaurants/'
        })

        if (res) {
            setRestaurants(res.data);
        } else {
            setRestaurants(null);
            setMessageAndMode("An error occurred");
        }
    };

    const getMenuItemModifiers = async () => {
        if (restaurantUUID === "") {
            console.error("Restaurant UUID is empty");
            setMenuItemModifiers(null);
            return;
        }

        try {
            const res = await axiosClient.get(`/restaurants/${restaurantUUID}/menu_item_modifiers/`);

            if (res.status === 200) {
                setMenuItemModifiers(res.data || null);
            } else {
                console.error("Unexpected response status", res.status);
                setMessageAndMode("Unexpected response", "failure");
                setMenuItemModifiers(null);
            }
        } catch (error) {
            setMessageAndMode("An error occurred.", "failure");
            console.error("Error fetching menu item modifiers:", error);
            setMenuItemModifiers(null);
        }
    }

    const getSideItems = () => {
        const items = restaurant.menu_items.filter(item => item.is_side_item);
        setSideItems(items);
    }

    const getDiscounts = async () => {
        try {
            const response = await axiosClient.get(`/restaurants/${restaurantUUID}/discounts/`);
            if (response.status === 200) {
                setDiscounts(response.data);
            } else {
                setMessageAndMode("Unexpected response", "failure");
                console.error("Unexpected response:", response);
                setDiscounts([]);
            }

        } catch (error) {
            setMessageAndMode("An error occurred.", "failure");
            console.error("Error fetching discounts:", error);
            setDiscounts([]);
        }
    };

    useEffect(() => {
        if (user) {
            fetchRestaurants();
        }
    }, [user]);

    useEffect(() => {
        if (restaurantUUID !== "") {
            getMenuItemModifiers();
            getDiscounts();
        }
        if (restaurant) {
            getSideItems();
        }
    }, [restaurantUUID, restaurant])
    
    let context = {
        restaurant,
        restaurants,
        menuItemModifiers,
        sideItems,
        discounts, 
        showReviewsPopup,
        reviewsPopupMode,
        reviewItems,
        setReviewItems,
        setReviewsPopupMode,
        setShowReviewsPopup,
        fetchRestaurant,
    }

    return (
        <RestaurantContext.Provider value={context}>
            {children}
        </RestaurantContext.Provider>
    )
}