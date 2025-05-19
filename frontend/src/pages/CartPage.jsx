import React, { useContext, useState } from 'react'
import { CartContext } from '../context/CartContext'
import add from '../assets/add.svg';
import remove from '../assets/remove.svg';
import close from '../assets/close.svg';
import { useNavigate } from 'react-router-dom';


const CartPage = () => {

    let { cartItems, isCartEmpty, doCartItemAction, getSubtotal, getExtrasSubtotal, getShippingExpense } = useContext(CartContext);
    const shippingExpense = getShippingExpense();
    const subtotal = getSubtotal();
    const [showExtrasCard, setShowExtrasCard] = useState(false);
    let [extrasCard, setExtrasCard] = useState(null);
    let navigate = useNavigate();
    console.log(cartItems);

    const showExtras = (extras) => {
        if (!extras) return;
        const modifierChoices = Object.values(extras.modifiers).flatMap(choicesArray => choicesArray);
        setShowExtrasCard(!showExtrasCard);
        setExtrasCard(
            <div className='absolute top-0 left-0 w-full h-screen flex items-center justify-center bg-black/50 z-40'>
                <div className='w-[50rem] h-[30rem] z-10 p-4 flex flex-col justify-start items-start gap-2 rounded bg-neutral-100 border-2 border-neutral-300 relative overflow-y-auto'>
                    <button onClick={() => {setShowExtrasCard(false); setExtrasCard(null);}} className='absolute top-4 right-4'>
                        <img src={close} alt="X" />
                    </button>
                    <div className='w-full h-fit flex justify-start items-start gap-2'>
                        {(Object.keys(extras.modifiers).length === 0) ? null : (
                            <div className='w-1/2 h-fit'>
                                <h1 className='font-notoserif text-neutral-800 text-3xl cursor-default text-left'>Modifiers</h1>
                                <div className='w-full h-fit flex flex-col justify-start items-start gap-2 mb-2'>
                                    {modifierChoices?.map((modifierChoice) => (
                                        <div key={modifierChoice.id} className='w-full h-12 border-2 border-gray-200 rounded flex justify-between items-center p-2'>
                                            <h1 className='font-hedwig text-lg text-neutral-800 cursor-default'>{modifierChoice.label}</h1>
                                            <h1 className='font-hedwig text-lg text-neutral-800 cursor-default'>Rs. {modifierChoice.price}</h1>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {extras.specialInstructions === "" ? null : (
                            <div className='w-1/2 h-fit '>
                                <h1 className='font-notoserif text-neutral-800 text-3xl cursor-default text-left'>Instructions</h1>
                                <div className='w-full h-fit rounded border-2 border-gray-300 p-3'>
                                    <p className='font-poppins text-neutral-800 cursor-default text-md'>{extras.specialInstructions}</p>
                                </div>
                            </div>
                        )}
                    </div>
                    {(Object.keys(extras.modifiers).length === 0) ? null : (
                        <div className='w-full h-fit flex justify-start items-center'>
                            <h1 className='font-hedwig text-lg text-neutral-800 cursor-default'>Subtotal - Rs. {getExtrasSubtotal(extras.modifiers)}</h1>
                        </div>
                    )}
                </div>
            </div>
        );

    }

    return (
        <div className="absolute top-0 left-0 w-full h-screen flex items-center justify-center flex-col pt-12">
                {isCartEmpty ? (
                    <div className='w-full h-full flex justify-center items-center'>
                        <h1 className='text-3xl font-poppins cursor-default'>Cart is empty...</h1>
                    </div>
                ) : (
                    <>
                        {showExtrasCard && (
                            extrasCard
                        )}
                        <div className='w-full h-full grid grid-rows-6 grid-cols-6 px-5'>
                            <div className='row-start-1 row-end-7 col-start-1 col-end-5'>
                                <div className='w-full h-full overflow-hidden flex flex-col justify-start items-center'>
                                    <div className='p-6 w-full flex-1 flex flex-col justify-start items-start overflow-y-auto gap-2'>
                                        <div className='w-full h-fit flex justify-between items-center'>
                                            <h1 className='text-2xl font-notoserif text-neutral-700 w-full text-left cursor-default'>Shopping Cart</h1>
                                        </div>
                                        <table className='w-full h-fit table-auto border-collapse'>
                                            <thead className='border-b-2 border-gray-200'>
                                                <tr className='pr-2 text-neutral-700'>
                                                    <th className='w-10 h-10'></th>
                                                    <th className='w-40 h-10'></th>

                                                    <th className='font-hedwig font-normal cursor-default'>Product</th>
                                                    <th className='font-hedwig font-normal cursor-default'>Price</th>
                                                    <th className='font-hedwig font-normal cursor-default'>Quantity</th>
                                                    <th className='font-hedwig font-normal cursor-default'>Subtotal</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cartItems.map((item, index) => (
                                                    <tr key={item.id} className={`text-neutral-700 relative ${index === cartItems.length - 1 ? '' : 'border-b-2 border-gray-200'}`}>
                                                        <td className='relative mr-4'>
                                                            {!item.is_side_item && (
                                                                (Object.keys(item.modifiers).length === 0 && item.special_instructions === "") ? null : (
                                                                    <div className='absolute top-1 left-0 w-fit h-fit'>
                                                                        <h1 onClick={() => { showExtras({ modifiers: item.modifiers, specialInstructions: item.special_instructions }) }} className={`text-right font-roboto text-md border-2 border-gray-300 cursor-pointer rounded-full px-2 bg-gray-200 text-gray-500`}>Extras</h1>
                                                                    </div>
                                                                )
                                                            )}
                                                            <button onClick={() => {doCartItemAction(item, "removeItem")}}>
                                                                <img src={close} alt="X" />
                                                            </button>
                                                        </td>
                                                        <td className='w-40 h-40 flex justify-center items-center my-4'>
                                                            <img src={item.image} alt="Image not found" className='w-full h-[80%] rounded-xl object-cover'/>
                                                        </td>

                                                        <td className='font-hedwig font-normal cursor-default text-center'>{item.name}</td>
                                                        <td className='font-hedwig font-normal text-neutral-700 cursor-default text-center'>Rs. {item.price}</td>
                                                        <td className='font-hedwig font-normal text-center cursor-default'>
                                                            <div className='w-fit h-fit inline-flex justify-start items-center gap-2'>
                                                                <button onClick={() => {doCartItemAction(item, "addQuantity")}} className='w-fit h-fit rounded-2xl border-2 border-gray-300 flex justify-center items-center hover:bg-gray-100'>
                                                                    <img src={add} alt="+" className='w-full h-full' />
                                                                </button>
                                                                <p className='text-center'>{item.quantity}</p>
                                                                <button onClick={() => {doCartItemAction(item, "subtractQuantity")}} className='w-fit h-fit rounded-2xl border-2 border-gray-300 flex justify-center items-center hover:bg-gray-100'>
                                                                    <img src={remove} alt="-" className='w-full h-full' />
                                                                </button>
                                                            </div>
                                                        </td>
                                                        <td className='font-hedwig font-normal text-neutral-700 cursor-default text-center'>Rs. {item.is_side_item ? (item.price * item.quantity) : (item.price * item.quantity) + getExtrasSubtotal(item.modifiers)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className='border-l-2 border-gray-300 row-start-1 row-end-7 col-start-5 col-end-7 flex flex-col justify-start items-start p-6'>
                                <h1 className='text-2xl font-notoserif text-neutral-700 w-full text-left pb-10 cursor-default'>Cart Summary</h1>
                                <div className='w-full h-fit px-4 py-2 rounded-full border-2 border-gray-200 flex justify-between items-center mb-4'>
                                    <h1 className='text-lg font-hedwig text-neutral-700 text-left cursor-default'>Subtotal</h1>
                                    <h1 className='text-lg font-hedwig text-neutral-700 text-left cursor-default'>Rs. {subtotal}</h1>
                                </div>
                                <div className='w-full h-fit px-4 py-2 rounded-full border-2 border-gray-200 flex justify-between items-center mb-4'>
                                    <h1 className='text-lg font-hedwig text-neutral-700 text-left cursor-default'>Shipping</h1>
                                    {shippingExpense === 0 ? (
                                        <h1 className='text-lg font-hedwig text-neutral-700 text-left cursor-default'>Free Delivery! <span className='text-sm font-hedwig text-neutral-400 text-left line-through'>Rs. 100</span></h1>
                                    ) : (
                                        <h1 className='text-lg font-hedwig text-neutral-700 text-left cursor-default'>Rs. 150</h1>
                                    )}
                                </div>
                                <div className='w-full h-fit px-4 py-2 rounded-xl border-2 border-dashed border-gray-300 flex justify-between items-center mb-4'>
                                    <h1 className='text-lg font-hedwig text-neutral-700 text-left cursor-default'>Total</h1>
                                    <h1 className='text-lg font-hedwig text-neutral-700 text-left cursor-default'>Rs. {(subtotal + shippingExpense)}</h1>
                                </div>
                                <p className='font-hedwig text-neutral-600 text-sm'>Discounts to be applied at checkout</p>
                                <div className='w-full h-fit mt-10'>
                                    <button onClick={() => { navigate('/checkout') }} className='w-full h-10 bg-neutral-800 text-white p-4 whitespace-nowrap text-nowrap flex justify-center items-center font-hedwig text-md'>
                                        Proceed to Checkout
                                    </button>
                                </div>
                            </div>
                        </div>    
                    </>
                )}
        </div>
    )
}

export default CartPage
