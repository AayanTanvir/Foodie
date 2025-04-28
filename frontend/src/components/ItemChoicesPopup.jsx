import React, { useContext, useState } from 'react'
import { CartContext } from '../context/CartContext'

const ItemChoicesPopup = ({ item }) => {

    let { sideItems, menuItemModifiers } = useContext(CartContext);

    const getModifiers = (item, modifiers) => {
        return modifiers.filter((modifier) => modifier.menu_item === item.name);
    }

    const itemModifiers = getModifiers(item, menuItemModifiers);

    return (
        <div className='fixed z-50 top-0 left-0 w-full h-screen flex items-center justify-center flex-col bg-black/50'>
            <div className='w-2/4 h-3/4 bg-slate-100 border-2 border-gray-200 rounded-lg flex flex-col justify-between items-start p-4 gap-4 overflow-y-auto'>
                {itemModifiers.length !== 0 && (
                    itemModifiers.map((modifier) => {
                        return (
                            <h1 key={modifier.id}>{modifier.name}</h1>
                        )
                    })
                )}
            </div>
        </div>
    )
}

export default ItemChoicesPopup
