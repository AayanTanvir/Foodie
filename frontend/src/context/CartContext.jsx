import React, {createContext, useEffect, useState} from 'react'

let CartContext = createContext()

export const CartContextProvider = ({children}) => {

    const getInitialCartItems = () => {
        const cartItems = localStorage.getItem("cartItems");
        return cartItems ? JSON.parse(cartItems) : [];
    }

    const [cartItems, setCartItems] = useState(getInitialCartItems);
    const [isCartEmpty, setIsCartEmpty] = useState(cartItems.length === 0);

    const addItemToCart = (item) => {
        setCartItems(prev => ([...prev, item]));
    }
    
    useEffect(() => {
        setIsCartEmpty(cartItems.length === 0);
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems])

    let context = {
        isCartEmpty:isCartEmpty,
        cartItems:cartItems,
        addItemToCart:addItemToCart,
    }

    return (
        <CartContext.Provider value={context}>
            {children}
        </CartContext.Provider>
    )

}

export default CartContext
