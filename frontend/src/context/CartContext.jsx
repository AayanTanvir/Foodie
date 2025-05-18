import React, {createContext, useContext, useEffect, useState} from 'react'


export const CartContext = createContext();

export const CartContextProvider = ({ children }) => {

    const getInitialCartItems = () => {
        const cartItems = localStorage.getItem("cartItems");
        return cartItems ? JSON.parse(cartItems) : [];
    }

    const [cartItems, setCartItems] = useState(getInitialCartItems);
    const [isCartEmpty, setIsCartEmpty] = useState(cartItems.length === 0);
    const [showChoicesPopup, setShowChoicesPopup] = useState(false);
    const [choicesItem, setChoicesItem] = useState(null);

    const getExtrasSubtotal = (extras) => {
        if (Object.keys(extras.modifiers).length === 0 && extras.sideItems.length === 0) return 0;
        const modifierPrices = Object.values(extras.modifiers).flatMap(choicesArray => choicesArray.map(choice => choice.price));
        let subtotal = 0;

        modifierPrices.forEach((price) => {
            subtotal += price;
        })
        extras.sideItems.forEach((item) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
        })

        return subtotal;
    }

    const getSubtotal = () => {
        let subtotal = 0
        cartItems.forEach((cartItem) => {
            subtotal += (cartItem.price * cartItem.quantity) + getExtrasSubtotal({ modifiers: cartItem.modifiers, sideItems: cartItem.side_items });
        })
        return subtotal;
    }

    const getItemSubtotal = (item) => {
        return (item.price * item.quantity) + getExtrasSubtotal({ modifiers: item.modifiers, sideItems: item.side_items });
    }

    const doCartItemAction = (item, action, specialInstructions="", modifiers={}, sideItems=[], quantity=1) => {
        if (cartItems.length !== 0) {
            if (cartItems.some(cartItem => cartItem.restaurant !== item.restaurant)) {
                setCartItems([]);
            }
        }

        setCartItems(prevItems => {
            switch (action) {
                case "addItem":
                    const itemInCart = prevItems.find(cartItem => cartItem.id === item.id);
                    if (itemInCart) {
                    // increase quantity
                    return prevItems.map(cartItem =>
                        cartItem.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                    );
                } else {
                    // add new item
                    return [...prevItems, { ...item, quantity: quantity, special_instructions: specialInstructions, modifiers: modifiers, side_items: sideItems }];
                }

            case "removeItem":
                return prevItems.filter(cartItem => cartItem.id !== item.id);

            case "addQuantity":
                return prevItems.map(cartItem => {
                    if (cartItem.id === item.id) {
                        if (Number(cartItem.quantity) >= 20) return cartItem;
                        return { ...cartItem, quantity: Number(cartItem.quantity) + 1 };
                    }
                    return cartItem;
                });

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

    const getShippingExpense = (discount=null) => {
        if (discount?.discount_type === "free_delivery") {
            return "Free";
        }
        return 150;
    }

    const getDiscountAmount = (discount) => {
        if (!discount) return 0;

        if (discount.discount_type === "free_delivery") {
            return 150;
        }
        else if (discount.discount_type === "percentage") {
            return (discount.amount / 100) * getSubtotal();
        }
        else if (discount.discount_type === "fixed_amount") {
            return discount.amount;
        }
        else {
            return 0;
        }
    }

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
    
    
    const activateChoicesPopup = (item=null, isActivating) => {
        if (isActivating) {
            setChoicesItem(item);
            setShowChoicesPopup(true);
        } else {
            setChoicesItem(null);
            setShowChoicesPopup(false);
        }
    }
    
    useEffect(() => {
        setIsCartEmpty(cartItems.length === 0);
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems])
    
    let context = {
        isCartEmpty: isCartEmpty,
        cartItems: cartItems,
        showChoicesPopup: showChoicesPopup,
        choicesItem: choicesItem,
        doCartItemAction: doCartItemAction,
        getSubtotal: getSubtotal,
        getExtrasSubtotal: getExtrasSubtotal,
        getShippingExpense: getShippingExpense,
        getItemSubtotal: getItemSubtotal,
        getDiscountAmount: getDiscountAmount,
        setShowChoicesPopup: setShowChoicesPopup,
        activateChoicesPopup: activateChoicesPopup,
    }

    return (
        <CartContext.Provider value={context}>
            {children}
        </CartContext.Provider>
    )

}
