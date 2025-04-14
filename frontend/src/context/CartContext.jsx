import React, {createContext, useEffect, useState} from 'react'

let CartContext = createContext()

export const CartContextProvider = ({children}) => {

    const getInitialCartItems = () => {
        const cartItems = localStorage.getItem("cartItems");
        return cartItems ? JSON.parse(cartItems) : [];
    }

    const [cartItems, setCartItems] = useState(getInitialCartItems);
    const [isCartEmpty, setIsCartEmpty] = useState(cartItems.length === 0);

    const doCartItemAction = (item, action) => {
        if (action === "add") {
            setCartItems(prevItems => ([...prevItems, item]));
        }
        else if (action === "remove") {
            setCartItems(prevItems => prevItems.filter(prevItem => prevItem.id !== item.id))
        }
    }
    
    useEffect(() => {
        setIsCartEmpty(cartItems.length === 0);
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems])

    let context = {
        isCartEmpty:isCartEmpty,
        cartItems:cartItems,
        doCartItemAction:doCartItemAction,
    }

    return (
        <CartContext.Provider value={context}>
            {children}
        </CartContext.Provider>
    )

}

export default CartContext
