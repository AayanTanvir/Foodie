import React, {createContext, useEffect, useState} from 'react'

export const CartContext = createContext();

export const CartContextProvider = ({ children }) => {

    const getInitialCartItems = () => {
        const cartItems = localStorage.getItem("cartItems");
        return cartItems ? JSON.parse(cartItems) : [];
    }

    // const [discounts, setDiscounts] = useState([]);
    const [cartItems, setCartItems] = useState(getInitialCartItems);
    const [isCartEmpty, setIsCartEmpty] = useState(cartItems.length === 0);
    const [showChoicesPopup, setShowChoicesPopup] = useState(false);

    // if (!discounts) {
    //     return <>{children}</>;
    // }

    // useEffect(() => {
    //     if (!cartItems.length) return;
        
    //     const restaurant_uuid = cartItems[0].restaurant_uuid;
        
    //     const getDiscounts = async () => {
    //         try {
    //             const response = await fetch(`http://localhost:8000/discounts/${restaurant_uuid}`);
    //             const data = await response.json();
    //             setDiscounts(data);
    //         } catch (err) {
    //             console.error("Failed to fetch discounts", err);
    //         }
    //     };
        
    //     if (restaurant_uuid) {
    //         getDiscounts();
    //     }
    // }, []);
    
    const getSubtotal = () => {
        let subtotal = 0
        cartItems.map((cartItem) => {
            subtotal += cartItem.price * cartItem.quantity;
        })
        return parseFloat(subtotal.toFixed(2));
    }
    
    // const getApplicableDiscounts = () => {
    //     const subtotal = getSubtotal();
    //     let applicableDiscounts = discounts.filter((discount) => discount.is_valid && discount.min_order_amount <= subtotal);

    //     return applicableDiscounts;
    // }


    const doCartItemAction = (item, action) => {
        if (cartItems.length !== 0) {
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

    const getShippingExpense = () => {
        // const bestDiscount = getBestDiscount();
        // return bestDiscount?.discount_type === "free_delivery" ? 0 : 150;
        return 150;
    }

    // const getDiscountAmount = (discount) => {
    //     //returns the amount saved by the discount
    //     if (!discount) return;

    //     if (discount.discount_type === "free_delivery") {
    //         return 100;
    //     }
    //     else if (discount.discount_type === "percentage") {
    //         return (discount.amount / 100) * getSubtotal();
    //     }
    //     else if (discount.discount_type === "fixed_amount") {
    //         return discount.amount;
    //     }
    //     else {
    //         return 0;
    //     }
    // }

    // const getBestDiscount = () => {
    //     const applicable = getApplicableDiscounts();
        
    //     let bestDiscount = null;
    //     let bestValue = 0;

    //     applicable.forEach((discount) => {
    //         const discountAmount = getDiscountAmount(discount);
    //         if (discountAmount > bestValue) {
    //             bestDiscount = discount;
    //             bestValue = discountAmount;
    //         }
    //     })
    //     return bestDiscount;
    // }

    const getItemChoices = async(item) => {
        console.log(item);
    }
    
    const activateChoicesPopup = (item) => {
        setShowChoicesPopup(true);
        getItemChoices(item);
    }

    useEffect(() => {
        setIsCartEmpty(cartItems.length === 0);
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems])

    let context = {
        isCartEmpty: isCartEmpty,
        cartItems: cartItems,
        showChoicesPopup: showChoicesPopup,
        doCartItemAction: doCartItemAction,
        getSubtotal: getSubtotal,
        getShippingExpense: getShippingExpense,
        setShowChoicesPopup: setShowChoicesPopup,
        activateChoicesPopup: activateChoicesPopup,
    }

    return (
        <CartContext.Provider value={context}>
            {children}
        </CartContext.Provider>
    )

}
