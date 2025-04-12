import React, {createContext, useState} from 'react'

let CartContext = createContext()

export const CartContextProvider = ({children}) => {

    const [isCartEmpty, setIsCartEmpty] = useState(true);

    let context = {
        isCartEmpty:isCartEmpty,
    }

    return (
        <CartContext.Provider value={context}>
            {children}
        </CartContext.Provider>
    )

}

export default CartContext
