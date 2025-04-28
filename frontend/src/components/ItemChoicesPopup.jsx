import React, { useContext, useState } from 'react'
import { CartContext } from '../context/CartContext'

const ItemChoicesPopup = () => {

    let { sideItems, menuItemModifiers } = useContext(CartContext);

    return (
        <div className='fixed z-50 top-0 left-0 w-full h-screen flex items-center justify-center flex-col bg-black/50'>
            <div className='w-2/4 h-3/4 bg-slate-100 border-2 border-gray-200 rounded-lg flex flex-col justify-between items-start p-4 gap-4 overflow-y-auto'>
                {menuItemModifiers.map((modifier) => (
                    <h1>{modifier.name}</h1>
                ))}
            </div>
        </div>
    )
}

export default ItemChoicesPopup
