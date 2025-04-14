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
        if (cartItems != []) {
            if (cartItems.some(cartItem => cartItem.restaurant !== item.restaurant)) {
                setCartItems([]);
            }
        }

        setCartItems(prevItems => {
            const itemInCart = prevItems.find(cartItem => cartItem.id === item.id);

            switch (action) {
            case "addItem":
                if (itemInCart) {
                // increase quantity
                return prevItems.map(cartItem =>
                    cartItem.id === item.id
                    ? { ...cartItem, quantity: cartItem.quantity + 1 }
                    : cartItem
                );
                } else {
                // add new item
                return [...prevItems, { ...item, quantity: 1 }];
                }

            case "removeItem":
                return prevItems.filter(cartItem => cartItem.id !== item.id);

            case "addQuantity":
                return prevItems.map(cartItem =>
                cartItem.id === item.id
                    ? { ...cartItem, quantity: cartItem.quantity + 1 }
                    : cartItem
                );

            case "subtractQuantity":
                return prevItems
                .map(cartItem =>
                cartItem.id === item.id
                    ? { ...cartItem, quantity: cartItem.quantity - 1 }
                    : cartItem
                )
                .filter(cartItem => cartItem.quantity > 0);

            default:
                return prevItems;
            }
        });
    };

    
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
