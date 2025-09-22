import React, {createContext, useState} from 'react';


export const CreateRestaurantContext = createContext();

export const CreateRestaurantContextProvider = ({ children }) => {

    const [restaurantInfo, setRestaurantInfo] = useState({ name: "", category: "", address: "", phone: "", opening_time: "", closing_time: "", image: null });
	const [menuItems, setMenuItems] = useState([]);
	const [menuItemCategories, setMenuItemCategories] = useState([]);
	const [menuItemModifiers, setMenuItemModifiers] = useState([]);
	const [modifierChoices, setModifierChoices] = useState({});



    let context = {
        restaurantInfo, setRestaurantInfo,
		menuItems, setMenuItems,
		menuItemCategories, setMenuItemCategories,
		menuItemModifiers, setMenuItemModifiers,
		modifierChoices, setModifierChoices,
    }

    return (
        <CreateRestaurantContext.Provider value={context}>
            {children}
        </CreateRestaurantContext.Provider>
    )
}