import { useState, useContext, useEffect } from 'react';
import card from '../assets/card.svg';
import cash from '../assets/cash.svg';
import { CartContext } from '../context/CartContext';
import axiosClient from '../utils/axiosClient';
import discount_svg from '../assets/discount.svg';


const CheckoutPage = () => {

    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [discounts, setDiscounts] = useState([]);
    const [selectedDiscount, setSelectedDiscount] = useState(null);
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        expiryDate: '',
        cvc: '',
        cardHolderName: ''
    });
    let { cartItems, getSubtotal, getShippingExpense, getItemSubtotal, getDiscountAmount } = useContext(CartContext);
    const restaurantName = cartItems[0]?.restaurant_name;

    const getDiscountLabel = (discount) => {
        if (discount.discount_type === 'percentage') {
            return `${discount.amount}% off`;
        } else if (discount.discount_type === 'fixed_amount') {
            return `Rs. ${discount.amount} off`;
        } else if (discount.discount_type === 'free_delivery') {
            return 'Free Delivery';
        }
        return '';
    }

    const getEligibleDiscounts = () => {
        let total = getSubtotal() + getShippingExpense();
        let eligibleDiscounts = discounts.filter((discount) => discount.is_valid && discount.min_order_amount <= total);
        return eligibleDiscounts;
    }

    const getModifierChoices = (item) => {
        const choices = Object.keys(item.modifiers).length > 0
            ? Object.values(item.modifiers).flatMap((choicesArray) =>
                choicesArray.map((choice) => choice.label)
              )
            : [];

        return choices;
    };

    const getSideItems = (item) => {
        const sideItems = item.side_items.map((sideItem) => (sideItem.quantity > 1 ? `${sideItem.quantity} x ` : '') + sideItem.name);
        return sideItems;   
    }

    useEffect(() => {
        if (!cartItems.length) return;
        
        const restaurant_uuid = cartItems[0].restaurant_uuid;
        
        const getDiscounts = async () => {
            try {
                const response = await axiosClient.get(`/restaurants/${restaurant_uuid}/discounts`);
                const data = response.data;
                setDiscounts(data);
            } catch (err) {
                console.error("Failed to fetch discounts", err);
            }
        };
        
        if (restaurant_uuid) {
            getDiscounts();
        }
    }, []);

    return (
        <div className='absolute top-0 left-0 w-full h-fit flex justify-center items-start gap-4 pt-16 mb-4'>
            <div className='rounded-md border-[1.5px] border-neutral-300 w-3/5 h-fit p-4 flex flex-col justify-start items-start gap-5 bg-white'>
                <div className='w-full flex flex-col justify-start items-start gap-2'>
                    <h1 className='text-3xl font-notoserif text-neutral-700 text-left cursor-default'>Delivery Address</h1>
                    <textarea
                        className='w-full h-24 p-3 border-[1px] border-neutral-300 resize-none rounded-md transition duration-150 ease focus:outline-none focus:border-neutral-500'
                        name='address'
                        pattern='[a-zA-Z0-9\s,.-]+'
                        placeholder='Enter Address'
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        onInput={(e) => {
                            e.target.value = e.target.value.replace(/[^a-zA-Z0-9\s,.-]/g, '');
                        }}
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
                                        <h1 className='text-lg font-roboto text-neutral-700 text-left cursor-default'>Card</h1>
                                    </div>
                                </div>
                                <div className='w-full h-fit flex flex-col justify-start items-start gap-2'>
                                    <input
                                        type='text'
                                        inputMode='numeric'
                                        pattern='\d{13,19}'
                                        maxLength={19}
                                        value={cardDetails.cardNumber}
                                        className='w-full h-10 p-2 pl-3 border-[1px] border-neutral-300 text-sm rounded-md transition duration-150 ease focus:outline-none focus:border-neutral-500'
                                        placeholder='Card Number'
                                        onInput={(e) => {
                                            e.target.value = e.target.value
                                                .replace(/\D/g, '')
                                                .replace(/(.{4})/g, '$1 ')
                                                .trim();
                                        }}
                                        onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                                    />
                                    <div className='w-full h-fit flex justify-between items-center gap-2'>
                                        <input
                                            type='text'
                                            inputMode='numeric'
                                            pattern="^(0[1-9]|1[0-2])\/\d{2}$"
                                            maxLength={5}
                                            value={cardDetails.expiryDate}
                                            className='w-1/2 h-10 p-2 pl-3 border-[1px] tracking-widest border-neutral-300 text-sm rounded-md transition duration-150 ease focus:outline-none focus:border-neutral-500'
                                            placeholder='MM/YY'
                                            onInput={(e) => {
                                                e.target.value = e.target.value
                                                    .replace(/[^\d]/g, '')
                                                    .replace(/^(\d{2})(\d{1,2})/, '$1/$2');
                                            }}
                                            onChange={(e) => setCardDetails({ ...cardDetails, expiryDate: e.target.value })}
                                        />
                                        <input
                                            type='text'
                                            inputMode='numeric'
                                            pattern='\d{3,4}'
                                            maxLength={4}
                                            value={cardDetails.cvc}
                                            className='w-1/2 h-10 p-2 pl-3 border-[1px] border-neutral-300 text-sm rounded-md transition duration-150 ease focus:outline-none focus:border-neutral-500'
                                            placeholder='CVC/CVV'
                                            onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
                                            onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                                        />
                                    </div>
                                    <input
                                        type='text'
                                        className='w-full h-10 p-2 pl-3 border-[1px] border-neutral-300 text-sm rounded-md transition duration-150 ease focus:outline-none focus:border-neutral-500'
                                        placeholder='Card Holder Name'
                                        value={cardDetails.cardHolderName}
                                        onInput={(e) => e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '')}
                                        onChange={(e) => setCardDetails({ ...cardDetails, cardHolderName: e.target.value })}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div onClick={() => { paymentMethod !== "card" && setPaymentMethod("card") }} className='w-fit h-fit flex justify-between items-center gap-2 cursor-pointer border-[1.5px] rounded-md px-3 py-2 hover:border-neutral-600'>
                                <div className='w-4 h-4 rounded-full border-2 border-gray-600'></div>
                                <div className='w-fit h-fit flex justify-center items-center gap-2'>
                                    <img src={card} alt='' className='w-6 h-6' />
                                    <h1 className='text-lg font-roboto text-neutral-700 text-left'>Card</h1>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className='w-full flex flex-col justify-start items-start gap-2'>
                    <h1 className='text-3xl font-notoserif text-neutral-700 text-left cursor-default'>Eligible Discounts</h1>
                    <div className='w-full h-fit grid auto-rows-auto grid-cols-3 gap-2'>
                        {getEligibleDiscounts().map((discount) => {
                            let validTill = new Date(discount.valid_to).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
                            return (
                                selectedDiscount?.id === discount.id ? (
                                    <div key={discount.id} className='w-full h-fit border-[1.5px] border-neutral-500 rounded-l-md flex justify-between items-center cursor-pointer scale-[101%]'>
                                        <div className='h-full w-fit ml-2 flex justify-center items-center'>
                                            <img src={discount_svg} alt='' className='w-5 h-5' />
                                        </div>
                                        <div className='h-full flex-1 p-2 flex flex-col justify-start items-start'>
                                            <h1 className='font-poppins font-semibold text-lg text-neutral-600'>{getDiscountLabel(discount)}</h1>
                                            <p className='text-sm font-roboto text-neutral-600'>Valid till <span className='tracking-wider font-hedwig'>{validTill}</span></p>
                                            <p className='text-sm font-roboto text-neutral-600'>{discount.min_order_amount === 0 ? "No minimum order amount" : `On orders above Rs. ${discount.min_order_amount}`}</p>
                                        </div>
                                        <div className='h-[100px] w-fit flex flex-col justify-evenly items-center mx-2 border-l-2 border-dashed pl-2 border-neutral-300'>
                                            <div className='w-3 h-3 border-2 border-neutral-300 rounded-full'></div>
                                            <div className='w-3 h-3 border-2 border-neutral-300 rounded-full'></div>
                                            <div className='w-3 h-3 border-2 border-neutral-300 rounded-full'></div>
                                            <div className='w-3 h-3 border-2 border-neutral-300 rounded-full'></div>
                                        </div>
                                    </div>
                                ) : (
                                    <div key={discount.id} onClick={() => {setSelectedDiscount(discount)}} className='w-full h-fit border-[1.5px] border-neutral-300 rounded-l-md flex justify-between items-center cursor-pointer transition duration-150 ease-out hover:border-neutral-500 hover:scale-[101%]'>
                                        <div className='h-full w-fit ml-2 flex justify-center items-center'>
                                                <img src={discount_svg} alt='' className='w-5 h-5' />
                                        </div>
                                        <div className='h-full flex-1 p-2 flex flex-col justify-start items-start'>
                                            <h1 className='font-poppins font-semibold text-lg text-neutral-600'>{getDiscountLabel(discount)}</h1>
                                            <p className='text-sm font-roboto text-neutral-600'>Valid till <span className='tracking-wider font-hedwig'>{validTill}</span></p>
                                            <p className='text-sm font-roboto text-neutral-600'>{discount.min_order_amount === 0 ? "No minimum order amount" : `On orders above Rs. ${discount.min_order_amount}`}</p>
                                        </div>
                                        <div className='h-[100px] w-fit flex flex-col justify-evenly items-center mx-2 border-l-2 border-dashed pl-2 border-neutral-300'>
                                            <div className='w-3 h-3 border-2 border-neutral-300 rounded-full'></div>
                                            <div className='w-3 h-3 border-2 border-neutral-300 rounded-full'></div>
                                            <div className='w-3 h-3 border-2 border-neutral-300 rounded-full'></div>
                                            <div className='w-3 h-3 border-2 border-neutral-300 rounded-full'></div>
                                        </div>
                                    </div>
                                )
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className='rounded-md border-[1.5px] border-neutral-300 w-1/3 h-fit p-4 flex flex-col justify-start items-start bg-white'>
                <h1 className='text-3xl font-notoserif text-neutral-700 text-left cursor-default'>Order Summary</h1>
                <h1 className='text-lg font-poppins font-bold text-neutral-800 text-left cursor-default mb-2'>{restaurantName}</h1>
                <div className='w-full h-fit flex flex-col justify-start items-start border-b-[1px] border-neutral-300 pb-2 mb-2'>
                    {cartItems.map((item) => (
                        <div key={item.id} className='w-full h-fit flex justify-between items-start py-2'>
                            <div className='flex justify-start items-start w-fit h-fit'>
                                <span className='text-md font-poppins text-neutral-700 text-left cursor-default'>{item.quantity}</span>
                                <span className='text-md font-poppins text-neutral-700 text-left cursor-default mx-1'>x</span>
                                <div className='h-fit flex flex-col justify-start items-start'>
                                    <span className='text-md font-poppins text-neutral-700 text-left cursor-default'>{item.name}</span>
                                    {getModifierChoices(item)?.map((modifier, index) => (
                                        <span key={index} className='text-sm font-poppins text-neutral-700 text-left cursor-default'>+ {modifier}</span>
                                    ))}
                                    {getSideItems(item)?.map((sideItem, index) => (
                                        <span key={index} className='text-sm font-poppins text-neutral-700 text-left cursor-default'>{sideItem}</span>
                                    ))}
                                </div>
                            </div>
                            <h1 className='text-md font-hedwig text-neutral-700 text-left cursor-default'>Rs. {getItemSubtotal(item)}</h1>
                        </div>
                    ))}
                </div>
                <div className='w-full h-fit flex flex-col justify-center items-center'>
                    <div className='w-full h-fit flex justify-between items-center'>
                        <h1 className='text-md font-hedwig text-neutral-600 text-left cursor-default'>Subtotal</h1>
                        <h1 className='text-md font-hedwig text-neutral-600 text-left cursor-default'>Rs. {getSubtotal()}</h1>
                    </div>
                    <div className='w-full h-fit flex justify-between items-center'>
                        <h1 className='text-md font-hedwig text-neutral-600 text-left cursor-default'>Delivery Charges</h1>
                        <h1 className='text-md font-hedwig text-neutral-600 text-left cursor-default'>{getShippingExpense(selectedDiscount) === "Free" ? "Free" : `Rs. ${getShippingExpense(selectedDiscount)}`}</h1>
                    </div>
                    {(selectedDiscount && selectedDiscount?.discount_type !== "free_delivery") && (
                        <div className='w-full h-fit flex justify-between items-center'>
                            <h1 className='text-md font-hedwig text-neutral-600 text-left cursor-default'>Discount Amount</h1>
                            <h1 className='text-md font-hedwig text-neutral-600 text-left cursor-default'>- Rs. {getDiscountAmount(selectedDiscount)}</h1>
                        </div>
                    )}
                    <div className='w-full h-fit flex justify-between items-center mt-4'>
                        <h1 className='text-2xl font-poppins font-extrabold text-neutral-800 text-left cursor-default'>Total</h1>
                        <h1 className='text-lg font-poppins font-extrabold text-neutral-800 text-left cursor-default'>Rs. {(getSubtotal() + getShippingExpense()) - getDiscountAmount(selectedDiscount)}</h1>
                    </div>
                    {selectedDiscount && (
                        <div className='w-full h-fit flex justify-end items-center'>
                            <h1 className='text-sm font-poppins text-neutral-800 line-through cursor-default'>Rs. {getSubtotal() + getShippingExpense()}</h1>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CheckoutPage
