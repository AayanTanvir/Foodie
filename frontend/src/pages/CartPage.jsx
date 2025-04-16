import React, { useContext } from 'react'
import CartContext from '../context/CartContext'
import add from '../assets/add.svg';
import remove from '../assets/remove.svg';
import close from '../assets/close.svg';


const CartPage = () => {

    let { cartItems, isCartEmpty, doCartItemAction, getSubtotal, getShipping } = useContext(CartContext);

    return (
        <div className="absolute top-0 left-0 w-full h-screen flex items-center justify-center flex-col pt-12">
            <div className='w-full h-full grid grid-rows-6 grid-cols-6 px-5'>
                <div className='row-start-1 row-end-7 col-start-1 col-end-5'>
                    {isCartEmpty ? (
                        <div className='w-full h-full flex justify-center items-center'>
                            <h1 className='text-3xl font-hedwig'>Cart is empty...</h1>
                        </div>
                    ) : (
                        <div className='w-full h-full overflow-hidden flex flex-col justify-start items-center'>
                            <div className='p-6 w-full flex-1 flex flex-col justify-start items-start overflow-y-auto gap-2'>
                                <h1 className='text-2xl font-hedwig text-neutral-700 w-full text-left'>Shopping Cart</h1>
                                <table className='w-full h-fit table-auto border-collapse'>
                                    <thead className='border-b-2 border-gray-200'>
                                        <tr className='pr-2 text-neutral-700'>
                                            <th className='w-40 h-10'></th>

                                            <th className='font-hedwig font-normal'>Product</th>
                                            <th className='font-hedwig font-normal'>Price</th>
                                            <th className='font-hedwig font-normal'>Quantity</th>
                                            <th className='font-hedwig font-normal'>Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartItems.map((item, index) => (
                                            <tr key={item.id} className={`text-neutral-700 ${index === cartItems.length - 1 ? '' : 'border-b-2 border-gray-200'}`}>
                                                <td className='w-40 h-40 flex justify-center items-center my-4'>
                                                    <img src={item.image} alt="Image not found" className='w-full h-[80%] rounded-xl object-cover'/>
                                                </td>

                                                <td className='font-hedwig font-normal'>{item.name}</td>
                                                <td className='font-hedwig font-normal text-neutral-700'>Rs. {item.price}</td>
                                                <td className='font-hedwig font-normal text-center'>
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
                                                <td className='font-hedwig font-normal text-neutral-700'>Rs. {item.price * item.quantity}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
                <div className='border-l-2 border-gray-300 row-start-1 row-end-7 col-start-5 col-end-7 flex flex-col justify-start items-start p-6'>
                    <h1 className='text-2xl font-hedwig text-neutral-700 w-full text-left pb-10'>Cart Summary</h1>
                    <div className='w-full h-fit px-4 py-2 rounded-full border-2 border-gray-200 flex justify-between items-center mb-4'>
                        <h1 className='text-lg font-hedwig text-neutral-700 text-left'>Subtotal</h1>
                        <h1 className='text-lg font-hedwig text-neutral-700 text-left'>Rs. {getSubtotal()}</h1>
                    </div>
                    <div className='w-full h-fit px-4 py-2 rounded-full border-2 border-gray-200 flex justify-between items-center mb-4'>
                        <h1 className='text-lg font-hedwig text-neutral-700 text-left'>Shipping</h1>
                        <h1 className='text-lg font-hedwig text-neutral-700 text-left'>Rs. {getShippingExpense()}</h1>
                    </div>
                    <div className='w-full h-fit px-4 py-2 rounded-xl border-2 border-gray-200 flex justify-between items-center mb-4'>
                        <h1 className='text-lg font-hedwig text-neutral-700 text-left'>Discounts</h1>
                        <div className='w-1/2 h-fit'>
                            <h1 className='text-lg font-hedwig text-neutral-700 text-right'>some1</h1>
                            <h1 className='text-lg font-hedwig text-neutral-700 text-right'>some2</h1>
                            <h1 className='text-lg font-hedwig text-neutral-700 text-right'>some3</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartPage
