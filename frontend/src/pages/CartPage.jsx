import React, { useContext } from 'react'
import CartContext from '../context/CartContext'
import add from '../assets/add.svg';
import remove from '../assets/remove.svg';
import close from '../assets/close.svg';


const CartPage = () => {

    let { cartItems, isCartEmpty, doCartItemAction } = useContext(CartContext);

    return (
        <div className="absolute top-0 left-0 w-full h-screen flex items-center justify-center flex-col pt-12">            <div className='w-[80%] h-[85%] border-2 border-gray-300 rounded-lg grid grid-rows-6 grid-cols-6'>
                <div className='row-start-1 row-end-7 col-start-1 col-end-5'>
                    {isCartEmpty ? (
                        <>
                            <h1>Cart is empty...</h1>
                        </>
                    ) : (
                        <div className='p-6 w-full h-fit grid auto-rows-auto grid-cols-3 overflow-y-auto gap-2'>
                            {cartItems.map((item) => (
                                <div key={item.id} className='w-full h-full px-4 py-2 mb-5 border-2 border-gray-200 flex justify-between items-center rounded-xl cursor-pointer relative'>
                                    <div className='w-4/5 h-full text-left overflow-hidden'>
                                        <h1 className='text-lg font-roboto truncate'>{item.name}</h1>
                                        <div className='w-fit h-fit flex justify-start items-center gap-2'>
                                            <button className='w-fit h-fit rounded-2xl border-2 border-gray-300 flex justify-center items-center hover:bg-gray-100'>
                                                <img src={add} alt="+" className='w-full h-full' />
                                            </button>
                                            <p className='text-center'>2</p>
                                            <button className='w-fit h-fit rounded-2xl border-2 border-gray-300 flex justify-center items-center hover:bg-gray-100'>
                                                <img src={remove} alt="-" className='w-full h-full' />
                                            </button>
                                        </div>
                                    </div>
                                    <div className='w-[5rem] h-[3rem] flex justify-center items-center'>
                                        <img src={item.image} alt="Image not found" className='w-full h-full rounded-xl object-cover' />
                                    </div>
                                    <button onClick={() => doCartItemAction(item, "remove")} className='w-fit h-fit absolute top-2 right-2'>
                                        <img src={close} alt="X" className='w-5 h-5'/>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className='border-l-2 border-gray-300 row-start-1 row-end-7 col-start-5 col-end-7'>
                    {/* cart items and quantity and stuff */}
                </div>
            </div>
        </div>
    )
}

export default CartPage
