import React, {createContext, useState} from 'react'

let CartContext = createContext()

export const CartContextProvider = ({children}) => {

    

    let context = {
        cart_name:"cart",
    }

    return (
        <CartContext.Provider value={context}>
            {children}
        </CartContext.Provider>
    )

}

export default CartContext
