import React, { useContext, useState } from 'react'
import CartContext from '../context/CartContext'
import cart_svg from '../assets/cart.svg';


const CartWidget = () => {

    const [isActivated, setIsActivated] = useState(false);

    let {cart_name} = useContext(CartContext);

    return (
        isActivated ? (
            <div className='w-[18rem] h-[20rem] fixed top-28 right-10 bg-neutral-400 shadow-xl rounded-xl z-30'>
            
            </div>
        ) : (
            <div className='w-[3rem] h-[3rem] fixed top-20 right-10 bg-white shadow-xl rounded-full z-30 flex justify-center items-center cursor-pointer' onClick={() => setIsActivated(!isActivated)}>
                <img src={cart_svg} alt="cart" className='w-[2rem] h-[2rem]' />
            </div>
        )

    )
}

export default CartWidget
