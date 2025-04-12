import React, { useContext } from 'react'
import CartContext from '../context/CartContext'

const CartPage = () => {

    
    return (
        <div className="absolute top-0 left-0 w-full h-screen flex items-center justify-center flex-col pt-12">            <div className='w-[80%] h-[85%] border-2 border-gray-300 rounded-lg grid grid-rows-6 grid-cols-6'>
                <div className='row-start-1 row-end-7 col-start-1 col-end-5'>
                    {/* pricing and stuff */}
                </div>
                <div className='border-l-2 border-gray-300 row-start-1 row-end-7 col-start-5 col-end-7'>
                    {/* cart items and quantity and stuff */}
                </div>
            </div>
        </div>
    )
}

export default CartPage
