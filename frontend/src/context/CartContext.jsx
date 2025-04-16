import React, {createContext, useEffect, useState} from 'react'

let CartContext = createContext()

export const CartContextProvider = ({ children }) => {

    const getInitialCartItems = () => {
        const cartItems = localStorage.getItem("cartItems");
        return cartItems ? JSON.parse(cartItems) : [];
    }

    const [cartItems, setCartItems] = useState(getInitialCartItems);
    const [isCartEmpty, setIsCartEmpty] = useState(cartItems.length === 0);
    const [discounts, setDiscounts] = useState([]);

    useEffect(() => {
        const getDiscounts = async () => {
            let restaurant_uuid = cartItems[0].restaurant_uuid
            const response = await fetch(`http://localhost:8000/discounts/${restaurant_uuid}`);
            const data = await response.json();
            setDiscounts(data);
        };

        if (restaurant_uuid) {
            getDiscounts();
        }
    }, []);

    if (!discounts || discounts.length === 0) {
        return null;
    }

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

    const getSubtotal = () => {
        let subtotal = 0
        cartItems.map((cartItem) => {
            subtotal += cartItem.price * cartItem.quantity;
        })
        return parseFloat(subtotal.toFixed(2));
    }

    const getApplicableDiscounts = (discounts, subtotal) => {
        //return only 1 discount if multiple discounts are available or do something else
        if (!discounts.length) {
            return null;
        }

        let applicableDiscounts = [];
        discounts.forEach((discount) => {
            const min_amount = parseFloat(discount.min_order_amount);
            if (min_amount == 0 && discount.is_valid) {
                applicableDiscounts.push(discount);
            } else if (min_amount <= subtotal && discount.is_valid) {
                applicableDiscounts.push(discount);
            }
        });
        return applicableDiscounts
    }

    const getShippingExpense = () => {
        let shipping = 0
        const discounts = [...discounts.filter(discount => discount.is_valid && discount.discount_type === "free_delivery")];
        if (!discounts.length) {
            shipping = 0;
        } else {
            
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
        getSubtotal:getSubtotal,
        getShippingExpense:getShippingExpense,
    }

    return (
        <CartContext.Provider value={context}>
            {children}
        </CartContext.Provider>
    )

}

export default CartContext
