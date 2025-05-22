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

    const getExtrasSubtotal = (modifiers={}) => {
        if (Object.keys(modifiers).length === 0) return 0;
        const modifierPrices = Object.values(modifiers).flatMap(choicesArray => choicesArray.map(choice => choice.price));
        let subtotal = 0;

        modifierPrices.forEach((price) => {
            subtotal += price;
        })

        return subtotal;
    }

    const getSubtotal = () => {
        let subtotal = 0
        cartItems.forEach((cartItem) => {
            subtotal += (cartItem.price * cartItem.quantity) + getExtrasSubtotal(cartItem.modifiers);
        })
        return subtotal;
    }

    const getItemSubtotal = (item) => {
        return (item.price * item.quantity) + getExtrasSubtotal(item.modifiers);
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
                    const itemInCart = prevItems.find(cartItem => cartItem.uuid === item.uuid);
                    let updatedItems;

                    if (itemInCart) {
                        updatedItems = prevItems.map(cartItem =>
                            cartItem.uuid === item.uuid
                            ? { ...cartItem, quantity: cartItem.quantity + 1 }
                            : cartItem
                        );
                    } else {
                        updatedItems = [...prevItems, { ...item, quantity: quantity, special_instructions: specialInstructions, modifiers: modifiers }];
                    }

                    sideItems.forEach(sideItem => {
                        const sideItemInCart = updatedItems.find(cartItem => cartItem.uuid === sideItem.uuid);
                        if (sideItemInCart) {
                            updatedItems = updatedItems.map(cartItem =>
                                cartItem.uuid === sideItem.uuid
                                    ? { ...cartItem, quantity: cartItem.quantity + 1 }
                                    : cartItem
                            );
                        } else {
                            updatedItems = [...updatedItems, { ...sideItem, quantity: 1 }];
                        }
                    });

                    return updatedItems;

                case "removeItem":
                    return prevItems.filter(cartItem => cartItem.uuid !== item.uuid);

                case "addQuantity":
                    return prevItems.map(cartItem => {
                        if (cartItem.uuid === item.uuid) {
                            if (Number(cartItem.quantity) >= 20) return cartItem;
                            return { ...cartItem, quantity: Number(cartItem.quantity) + 1 };
                        }
                        return cartItem;
                    });

                case "subtractQuantity":
                    return prevItems
                    .map(cartItem =>
                    cartItem.uuid === item.uuid
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
    
    const activateChoicesPopup = (item=null, isActivating) => {
        if (isActivating) {
            setChoicesItem(item);
            setShowChoicesPopup(true);
        } else {
            setChoicesItem(null);
            setShowChoicesPopup(false);
        }
    }

    const clearCart = () => {
        localStorage.removeItem("cartItems");
        setCartItems([]);
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
        clearCart: clearCart,
    }

    return (
        <CartContext.Provider value={context}>
            {children}
        </CartContext.Provider>
    )

}
