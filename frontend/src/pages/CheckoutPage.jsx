import { useRef, useState } from 'react';
import card from '../assets/card.svg';
import cash from '../assets/cash.svg';


const CheckoutPage = () => {

    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState('cash');

    return (
        <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center gap-4 bg-gray-100'>
            <div className='rounded-md border-2 border-neutral-300 w-3/5 h-fit p-4 flex flex-col justify-start items-start gap-5 bg-white'>
                <div className='w-full flex flex-col justify-start items-start gap-2'>
                    <h1 className='text-3xl font-notoserif text-neutral-700 text-left cursor-default'>Delivery Address</h1>
                    <textarea
                        className='w-full h-24 p-2 border-2 border-neutral-300 resize-none rounded-md focus:outline-none focus:border-neutral-500'
                        name='address'
                        placeholder=' '
                        rows={3}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        value={deliveryAddress}
                        required
                    />
                </div>
                <div className='w-full flex flex-col justify-start items-start gap-2'>
                    <h1 className='text-3xl font-notoserif text-neutral-700 text-left cursor-default'>Payment</h1>
                    <div className='w-full flex flex-col justify-start items-start gap-2'>
                        <div onClick={() => { paymentMethod !== "cash" && setPaymentMethod("cash") }} className={`w-fit h-fit flex justify-between items-center gap-2 cursor-pointer border-[1.5px] rounded-md px-3 py-2 hover:border-neutral-600 ${paymentMethod === "cash" ? 'border-neutral-600' : 'border-neutral-300'} `}>
                            <div className={`w-4 h-4 rounded-full border-2 border-gray-600 ${paymentMethod === 'cash' && 'bg-neutral-400'}`}></div>
                            <div className='w-fit h-fit flex justify-center items-center gap-2'>
                                <img src={cash} alt='' className='w-6 h-6' />
                                <h1 className='text-lg font-roboto text-neutral-700 text-left'>Cash On Delivery</h1>
                            </div>
                        </div>
                        {paymentMethod === "card" ? (
                            <div className='w-3/5 h-fit flex flex-col justify-start items-start gap-2 border-[1px] rounded-md px-3 py-2 border-neutral-600'>
                                <div className='flex justify-start items-center gap-2 w-fit h-fit'>
                                    <div className='w-4 h-4 rounded-full border-2 border-gray-600 bg-neutral-400'></div>
                                    <div className='w-fit h-fit flex justify-center items-center gap-2'>
                                        <img src={card} alt='' className='w-6 h-6' />
                                        <h1 className='text-lg font-roboto text-neutral-700 text-left cursor-default'>Credit or Debit Card</h1>
                                    </div>
                                </div>
                                <div className='w-full h-fit flex flex-col justify-start items-start gap-2'>
                                    <input
                                        type='text'
                                        inputMode='numeric'
                                        pattern='\d{13,19}'
                                        maxLength={19}
                                        className='w-full h-10 p-2 pl-3 border-[1px] border-neutral-300 text-sm rounded-md transition duration-150 ease focus:outline-none focus:border-neutral-500'
                                        placeholder='Card Number'
                                        onInput={(e) => {
                                            e.target.value = e.target.value
                                                .replace(/\D/g, '')
                                                .replace(/(.{4})/g, '$1 ')
                                                .trim();
                                        }}
                                    />
                                    <div className='w-full h-fit flex justify-between items-center gap-2'>
                                        <input
                                            type='text'
                                            inputMode='numeric'
                                            pattern="^(0[1-9]|1[0-2])\/\d{2}$"
                                            maxLength={5}
                                            className='w-1/2 h-10 p-2 pl-3 border-[1px] tracking-widest border-neutral-300 text-sm rounded-md transition duration-150 ease focus:outline-none focus:border-neutral-500'
                                            placeholder='MM/YY'
                                            onInput={(e) => {
                                                e.target.value = e.target.value
                                                    .replace(/[^\d]/g, '')
                                                    .replace(/^(\d{2})(\d{1,2})/, '$1/$2');
                                            }}
                                        />
                                        <input
                                            type='text'
                                            inputMode='numeric'
                                            pattern='\d{3,4}'
                                            maxLength={4}
                                            className='w-1/2 h-10 p-2 pl-3 border-[1px] border-neutral-300 text-sm rounded-md transition duration-150 ease focus:outline-none focus:border-neutral-500'
                                            placeholder='CVC/CVV'
                                            onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
                                        />
                                    </div>
                                    <input
                                        type='text'
                                        className='w-full h-10 p-2 pl-3 border-[1px] border-neutral-300 text-sm rounded-md transition duration-150 ease focus:outline-none focus:border-neutral-500'
                                        placeholder='Card Holder Name'
                                        onInput={(e) => e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '')}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div onClick={() => { paymentMethod !== "card" && setPaymentMethod("card") }} className='w-fit h-fit flex justify-between items-center gap-2 cursor-pointer border-[1.5px] rounded-md px-3 py-2 hover:border-neutral-600'>
                                <div className='w-4 h-4 rounded-full border-2 border-gray-600'></div>
                                <div className='w-fit h-fit flex justify-center items-center gap-2'>
                                    <img src={card} alt='' className='w-6 h-6' />
                                    <h1 className='text-lg font-roboto text-neutral-700 text-left'>Credit or Debit Card</h1>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className='rounded-md border-2 border-neutral-300 w-1/3 h-fit p-4 flex flex-col justify-start items-start gap-2 bg-white'>
                <h1 className='text-2xl font-notoserif text-neutral-700 text-left cursor-default'>Order Summary</h1>
            </div>
        </div>
    )
}

export default CheckoutPage
