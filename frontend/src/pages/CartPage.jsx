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
                        <div className='w-full h-full flex justify-center items-center'>
                            <h1 className='text-3xl font-roboto font-semibold'>Cart is empty...</h1>
                        </div>
                    ) : (
                        <div className='w-full h-full overflow-hidden flex flex-col justify-start items-center'>
                            <div className='p-6 w-full flex-1 flex flex-col justify-start items-start overflow-y-auto gap-2'>
                                <h1 className='text-2xl font-hedwig text-neutral-700 w-full text-left'>Shopping Cart</h1>
                                <table className='w-full h-full table-auto border-collapse'>
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
                                                <td className='font-hedwig font-normal text-green-600'>Rs. {item.price}</td>
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
                                                <td className='font-hedwig font-normal text-green-600'>Rs. {item.price * item.quantity}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                    {/* <div className='w-4/5 h-fit text-left overflow-hidden relative'>
                                        <h1 className='text-lg font-roboto truncate'>{item.name}</h1>
                                        <p className='text-md font-roboto text-green-500'>Rs. {item.price * item.quantity}</p>
                                        <div className='w-fit h-fit flex justify-start items-center gap-2'>
                                            <button onClick={() => {doCartItemAction(item, "addQuantity")}} className='w-fit h-fit rounded-2xl border-2 border-gray-300 flex justify-center items-center hover:bg-gray-100'>
                                                <img src={add} alt="+" className='w-full h-full' />
                                            </button>
                                            <p className='text-center'>{item.quantity}</p>
                                            <button onClick={() => {doCartItemAction(item, "subtractQuantity")}} className='w-fit h-fit rounded-2xl border-2 border-gray-300 flex justify-center items-center hover:bg-gray-100'>
                                                <img src={remove} alt="-" className='w-full h-full' />
                                            </button>
                                        </div>
                                    </div>
                                    <div className='w-[5rem] h-[3rem] flex justify-center items-center'>
                                        <img src={item.image} alt="Image not found" className='w-full h-full rounded-xl object-cover' />
                                    </div>
                                    <button onClick={() => doCartItemAction(item, "removeItem")} className='w-fit h-fit absolute top-1 right-1'>
                                        <img src={close} alt="X" className='w-5 h-5'/>
                                    </button> */}
                            </div>
                            <div className='w-full h-[6rem] border-t-2 border-gray-200'>

                            </div>
                        </div>
                    )}
                </div>
                <div className='border-l-2 border-gray-300 row-start-1 row-end-7 col-start-5 col-end-7 flex flex-col justify-start items-start p-4'>
                    
                </div>
            </div>
        </div>
    )
}

export default CartPage
