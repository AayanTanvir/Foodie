import { useState, useContext, useEffect } from "react";
import { CiCreditCard1 } from "react-icons/ci";
import { CiDiscount1 } from "react-icons/ci";
import { CartContext } from "../context/CartContext";
import AuthContext from "../context/AuthContext";
import axiosClient from "../utils/axiosClient";
import { RestaurantContext } from "../context/RestaurantContext";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";
import { PiMoneyWavyThin } from "react-icons/pi";
import { sendRequest } from "../utils/Utils";


const CheckoutPage = () => {

    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
    const [selectedDiscount, setSelectedDiscount] = useState(null);
    const [cardDetails, setCardDetails] = useState({
        cardNumber: "",
        expiryDate: "",
        cvc: "",
        cardHolderName: ""
    });
    let { cartItems, isCartEmpty, clearCart, getSubtotal, getShippingExpense, getItemSubtotal, getDiscountAmount } = useContext(CartContext);
    let { discounts } = useContext(RestaurantContext);
    let { user } = useContext(AuthContext);
    let { setMessageAndMode } = useContext(GlobalContext);
    const restaurantName = cartItems[0]?.restaurant_name;
    const restaurantUUID = cartItems[0]?.restaurant_uuid;
    const userUUID = user?.uuid;
    let navigate = useNavigate()


    useEffect(() => {
        if (isCartEmpty) {
            window.location.href = "/";
        }
    }, [])

    const getDiscountLabel = (discount) => {
        if (discount.discount_type === "percentage") {
            return `${discount.amount}% off`;
        } else if (discount.discount_type === "fixed_amount") {
            return `Rs. ${discount.amount} off`;
        } else if (discount.discount_type === "free_delivery") {
            return "Free Delivery";
        }
        return "";
    }

    const getEligibleDiscounts = () => {
        let total = getSubtotal() + getShippingExpense();
        let eligibleDiscounts = discounts.filter((discount) => discount.is_valid && discount.min_order_amount <= total);
        return eligibleDiscounts;
    }

    const getModifierChoices = (item={}) => {
        const choices = Object.keys(item.modifiers).length > 0
            ? Object.values(item.modifiers).flatMap((choicesArray) =>
                choicesArray.map((choice) => choice.label)
              )
            : [];

        return choices;
    };

    const handlePlaceOrder = async () => {

        if (deliveryAddress.trim() === "") {
            setMessageAndMode("Please enter a delivery address.", "notice");
            return;
        }

        if (paymentMethod === "card" && (cardDetails.cardNumber === "" || cardDetails.cvc === "" || cardDetails.cardHolderName === "" || cardDetails.expiryDate === "")) {
            setMessageAndMode("Please enter card details", "notice");
            return;
        }

        let payload = {
            restaurant_uuid: restaurantUUID,
            user_uuid: userUUID,
            order_items_write: cartItems.map((item) => ({
                menu_item_uuid: item.uuid,
                quantity: item.quantity,
                modifiers: item.modifiers
                    ? Object.values(item.modifiers).flatMap((choicesArray) =>
                        choicesArray.map(choice => choice.id)
                    )
                    : [],
                special_instruction: item.special_instructions,
            })),
            payment_method: paymentMethod,
            delivery_address: deliveryAddress,
        }

        if (selectedDiscount) {
            payload.discount_uuid = selectedDiscount.uuid
        }

        const res = await sendRequest({
            method: "post",
            to: "/orders/create/",
            postData: payload,
            desiredStatus: 201,
        });

        if (res.status === 201) {
            clearCart();
            navigate(`/orders/${res.data?.uuid}`);
        } else {
            setMessageAndMode("An error occurred.", "failure");
            navigate("/");
            clearCart();
        }

        // try {
        //     const res = await axiosClient.post("/orders/create/", payload);
        //     if (res.status === 201) {
        //         clearCart();
        //         navigate(`/orders/${res.data?.uuid}`);
        //     } else {
        //         console.error("Unexpected response:", res);
        //         setMessageAndMode("Unexpected response. Please try again later.", "failure");
        //         navigate("/");
        //         clearCart();
        //     }
        // } catch (error) {
        //     console.error("An error occurred while placing the order.", error);
        //     setMessageAndMode("An error occurred. Please try again later.", "failure");
        //     clearCart();
        //     navigate("/");
        // }
    }

    return (
        <div className="absolute top-0 left-0 w-full h-fit flex justify-center items-start gap-4 pt-16 mb-4">
            <div className="rounded-md border-[1.5px] border-neutral-300 w-3/5 h-fit p-4 flex flex-col justify-start items-start gap-5 bg-white">
                <div className="w-full flex flex-col justify-start items-start gap-2">
                    <h1 className="text-3xl font-notoserif text-neutral-700 text-left cursor-default">Delivery Address</h1>
                    <textarea
                        className="w-full h-24 p-3 border-[1px] border-neutral-300 resize-none rounded-md transition duration-150 ease focus:outline-none focus:border-neutral-500"
                        name="address"
                        pattern="[a-zA-Z0-9\s,.-]+"
                        placeholder="Enter Address"
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        onInput={(e) => {
                            e.target.value = e.target.value.replace(/[^a-zA-Z0-9\s,.-]/g, "");
                        }}
                        value={deliveryAddress}
                    />
                </div>
                <div className="w-full flex flex-col justify-start items-start gap-2">
                    <h1 className="text-3xl font-notoserif text-neutral-700 text-left cursor-default">Payment</h1>
                    <div className="w-full flex flex-col justify-start items-start gap-2">
                        <div onClick={() => { paymentMethod !== "cash_on_delivery" && setPaymentMethod("cash_on_delivery") }} className={`w-fit h-fit flex justify-between items-center gap-2 cursor-pointer border-[1.5px] rounded-md px-3 py-2 hover:border-neutral-600 ${paymentMethod === "cash_on_delivery" ? "border-neutral-600" : "border-neutral-300"} `}>
                            <div className={`w-4 h-4 rounded-full border-2 border-gray-600 ${paymentMethod === "cash_on_delivery" && "bg-neutral-400"}`}></div>
                            <div className="w-fit h-fit flex justify-center items-center gap-2">
                                <span className="text-neutral-800 text-2xl">
                                    <PiMoneyWavyThin />
                                </span>
                                <h1 className="text-lg font-roboto text-neutral-700 text-left">Cash On Delivery</h1>
                            </div>
                        </div>
                        {paymentMethod === "card" ? (
                            <div className="w-3/5 h-fit flex flex-col justify-start items-start gap-2 border-[1px] rounded-md px-3 py-2 border-neutral-600">
                                <div className="flex justify-start items-center gap-2 w-fit h-fit">
                                    <div className="w-4 h-4 rounded-full border-2 border-gray-600 bg-neutral-400"></div>
                                    <div className="w-fit h-fit flex justify-center items-center gap-2">
                                        <span className="text-neutral-800 text-2xl">
                                            <CiCreditCard1 />
                                        </span>
                                        <h1 className="text-lg font-roboto text-neutral-700 text-left cursor-default">Card</h1>
                                    </div>
                                </div>
                                <div className="w-full h-fit flex flex-col justify-start items-start gap-2">
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="\d{13,19}"
                                        maxLength={19}
                                        value={cardDetails.cardNumber}
                                        className="w-full h-10 p-2 pl-3 border-[1px] border-neutral-300 text-sm rounded-md transition duration-150 ease focus:outline-none focus:border-neutral-500"
                                        placeholder="Card Number"
                                        onInput={(e) => {
                                            e.target.value = e.target.value
                                                .replace(/\D/g, "")
                                                .replace(/(.{4})/g, "$1 ")
                                                .trim();
                                        }}
                                        onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                                    />
                                    <div className="w-full h-fit flex justify-between items-center gap-2">
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            pattern="^(0[1-9]|1[0-2])\/\d{2}$"
                                            maxLength={5}
                                            value={cardDetails.expiryDate}
                                            className="w-1/2 h-10 p-2 pl-3 border-[1px] tracking-widest border-neutral-300 text-sm rounded-md transition duration-150 ease focus:outline-none focus:border-neutral-500"
                                            placeholder="MM/YY"
                                            onInput={(e) => {
                                                e.target.value = e.target.value
                                                    .replace(/[^\d]/g, "")
                                                    .replace(/^(\d{2})(\d{1,2})/, "$1/$2");
                                            }}
                                            onChange={(e) => setCardDetails({ ...cardDetails, expiryDate: e.target.value })}
                                        />
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            pattern="\d{3,4}"
                                            maxLength={4}
                                            value={cardDetails.cvc}
                                            className="w-1/2 h-10 p-2 pl-3 border-[1px] border-neutral-300 text-sm rounded-md transition duration-150 ease focus:outline-none focus:border-neutral-500"
                                            placeholder="CVC/CVV"
                                            onInput={(e) => e.target.value = e.target.value.replace(/\D/g, "")}
                                            onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        className="w-full h-10 p-2 pl-3 border-[1px] border-neutral-300 text-sm rounded-md transition duration-150 ease focus:outline-none focus:border-neutral-500"
                                        placeholder="Card Holder Name"
                                        value={cardDetails.cardHolderName}
                                        onInput={(e) => e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, "")}
                                        onChange={(e) => setCardDetails({ ...cardDetails, cardHolderName: e.target.value })}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div onClick={() => { paymentMethod !== "card" && setPaymentMethod("card") }} className="w-fit h-fit flex justify-between items-center gap-2 cursor-pointer border-[1.5px] rounded-md px-3 py-2 hover:border-neutral-600">
                                <div className="w-4 h-4 rounded-full border-2 border-gray-600"></div>
                                <div className="w-fit h-fit flex justify-center items-center gap-2">
                                    <span className="text-neutral-800 text-2xl">
                                        <CiCreditCard1 />
                                    </span>
                                    <h1 className="text-lg font-roboto text-neutral-700 text-left">Card</h1>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {discounts.length !== 0 && (
                    <div className="w-full flex flex-col justify-start items-start gap-2">
                        <h1 className="text-3xl font-notoserif text-neutral-700 text-left cursor-default">Eligible Discounts</h1>
                        <div className="w-full h-fit grid auto-rows-auto grid-cols-3 gap-2">
                            {getEligibleDiscounts().map((discount) => {
                                let validTill = new Date(discount.valid_to).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
                                return (
                                    selectedDiscount?.uuid === discount.uuid ? (
                                        <div key={discount.uuid} className="w-full h-fit border-[1.5px] border-neutral-500 rounded-l-md flex justify-between items-center cursor-pointer scale-[101%]">
                                            <div className="h-full w-fit ml-2 flex justify-center items-center">
                                                <span className="text-2xl text-neutral-600">
                                                    <CiDiscount1 />            
                                                </span>
                                            </div>
                                            <div className="h-full flex-1 p-2 flex flex-col justify-start items-start">
                                                <h1 className="font-poppins font-semibold text-lg text-neutral-600">{getDiscountLabel(discount)}</h1>
                                                <p className="text-sm font-roboto text-neutral-600">Valid till <span className="tracking-wider font-hedwig">{validTill}</span></p>
                                                <p className="text-sm font-roboto text-neutral-600">{discount.min_order_amount === 0 ? "No minimum order amount" : `On orders above Rs. ${discount.min_order_amount}`}</p>
                                            </div>
                                            <div className="h-[100px] w-fit flex flex-col justify-evenly items-center mx-2 border-l-2 border-dashed pl-2 border-neutral-300">
                                                <div className="w-3 h-3 border-2 border-neutral-300 rounded-full"></div>
                                                <div className="w-3 h-3 border-2 border-neutral-300 rounded-full"></div>
                                                <div className="w-3 h-3 border-2 border-neutral-300 rounded-full"></div>
                                                <div className="w-3 h-3 border-2 border-neutral-300 rounded-full"></div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div key={discount.uuid} onClick={() => {setSelectedDiscount(discount)}} className="w-full h-fit border-[1.5px] border-neutral-300 rounded-l-md flex justify-between items-center cursor-pointer transition duration-150 ease-out hover:border-neutral-500 hover:scale-[101%]">
                                            <div className="h-full w-fit ml-2 flex justify-center items-center">
                                                <span className="text-2xl text-neutral-600">
                                                    <CiDiscount1 />
                                                </span>
                                            </div>
                                            <div className="h-full flex-1 p-2 flex flex-col justify-start items-start">
                                                <h1 className="font-poppins font-semibold text-lg text-neutral-600">{getDiscountLabel(discount)}</h1>
                                                <p className="text-sm font-roboto text-neutral-600">Valid till <span className="tracking-wider font-hedwig">{validTill}</span></p>
                                                <p className="text-sm font-roboto text-neutral-600">{discount.min_order_amount === 0 ? "No minimum order amount" : `On orders above Rs. ${discount.min_order_amount}`}</p>
                                            </div>
                                            <div className="h-[100px] w-fit flex flex-col justify-evenly items-center mx-2 border-l-2 border-dashed pl-2 border-neutral-300">
                                                <div className="w-3 h-3 border-2 border-neutral-300 rounded-full"></div>
                                                <div className="w-3 h-3 border-2 border-neutral-300 rounded-full"></div>
                                                <div className="w-3 h-3 border-2 border-neutral-300 rounded-full"></div>
                                                <div className="w-3 h-3 border-2 border-neutral-300 rounded-full"></div>
                                            </div>
                                        </div>
                                    )
                                );
                            })}
                        </div>
                    </div>

                )}
            </div>
            <div className="rounded-md border-[1.5px] border-neutral-300 w-1/3 h-fit p-4 flex flex-col justify-start items-start bg-white">
                <h1 className="text-3xl font-notoserif text-neutral-700 text-left cursor-default">Order Summary</h1>
                <h1 className="text-lg font-poppins text-neutral-700 text-left cursor-default mb-2">From {restaurantName}</h1>
                <div className="w-full h-fit flex flex-col justify-start items-start border-b-[1px] border-neutral-300 pb-2 mb-2">
                    {cartItems.map((item) => (
                        <div key={item.uuid} className="w-full h-fit flex justify-between items-start mb-2">
                            <div className="flex justify-start items-start w-fit h-fit">
                                {item.is_side_item ? (
                                    <h1 className="text-md font-poppins text-neutral-700 text-left cursor-default">{item.quantity} x {item.name}</h1>
                                ) : (
                                    <>
                                        <span className="text-md font-poppins text-neutral-700 text-left cursor-default">{item.quantity}</span>
                                        <span className="text-md font-poppins text-neutral-700 text-left cursor-default mx-1">x</span>
                                        <div className="h-fit flex flex-col justify-start items-start">
                                            <span className="text-md font-poppins text-neutral-700 text-left cursor-default">{item.name}</span>
                                            {getModifierChoices(item)?.map((modifier, index) => (
                                                <span key={index} className="text-sm font-poppins text-neutral-700 text-left cursor-default">+ {modifier}</span>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                            <h1 className="text-md font-hedwig text-neutral-700 text-left cursor-default">Rs. {getItemSubtotal(item)}</h1>
                        </div>
                    ))}
                </div>
                <div className="w-full h-fit flex flex-col justify-center items-center">
                    <div className="w-full h-fit flex justify-between items-center">
                        <h1 className="text-md font-hedwig text-neutral-600 text-left cursor-default">Subtotal</h1>
                        <h1 className="text-md font-hedwig text-neutral-600 text-left cursor-default">Rs. {getSubtotal()}</h1>
                    </div>
                    <div className="w-full h-fit flex justify-between items-center">
                        <h1 className="text-md font-hedwig text-neutral-600 text-left cursor-default">Delivery Charges</h1>
                        <h1 className="text-md font-hedwig text-neutral-600 text-left cursor-default">{getShippingExpense(selectedDiscount) === "Free" ? "Free" : `Rs. ${getShippingExpense(selectedDiscount)}`}</h1>
                    </div>
                    {(selectedDiscount && selectedDiscount?.discount_type !== "free_delivery") && (
                        <div className="w-full h-fit flex justify-between items-center">
                            <h1 className="text-md font-hedwig text-neutral-600 text-left cursor-default">Discount Amount</h1>
                            <h1 className="text-md font-hedwig text-neutral-600 text-left cursor-default">- Rs. {getDiscountAmount(selectedDiscount)}</h1>
                        </div>
                    )}
                    <div className="w-full h-fit flex justify-between items-center mt-4">
                        <h1 className="text-2xl font-poppins font-extrabold text-neutral-800 text-left cursor-default">Total</h1>
                        <h1 className="text-lg font-poppins font-extrabold text-neutral-800 text-left cursor-default">Rs. {(getSubtotal() + getShippingExpense()) - getDiscountAmount(selectedDiscount)}</h1>
                    </div>
                    {selectedDiscount && (
                        <div className="w-full h-fit flex justify-end items-center">
                            <h1 className="text-sm font-poppins text-neutral-800 line-through cursor-default">Rs. {getSubtotal() + getShippingExpense()}</h1>
                        </div>
                    )}
                    <button onClick={() => { handlePlaceOrder() }} className="w-full h-10 bg-neutral-800 text-white p-4 whitespace-nowrap text-nowrap flex justify-center items-center rounded font-hedwig text-md mt-4">
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CheckoutPage
