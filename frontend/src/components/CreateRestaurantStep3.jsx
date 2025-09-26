import React, { useContext, useEffect, useState } from 'react';
import { CreateRestaurantContext } from '../context/CreateRestaurantContext';
import { 
  TextField,
  FormControl, 
  InputLabel, 
  OutlinedInput, 
  InputAdornment, 
  Select,
  MenuItem 
} from '@mui/material';
import { IoMdClose } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalContext';
import Info from './Info';

const CreateRestaurantStep3 = () => {

  	const { discounts, setDiscounts } = useContext(CreateRestaurantContext);
	const { setMessageAndMode } = useContext(GlobalContext);
	const navigate = useNavigate();
	const [canContinue, setCanContinue] = useState(false);

	const handleSkip = () => {
		setDiscounts([]);
		navigate('/create-restaurant?step=4');
	}

	const getOneYearLaterDate = () => {
		const now = new Date();
		const oneYearLater = new Date(now);
		oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
		return oneYearLater.toISOString().split("T")[0];
	};

	const checkValidFromTo = () => {
		for (let i = 0; i < discounts.length; i++) {
			if (discounts[i].valid_from === "" || discounts[i].valid_to === "") {
				continue;
			}

			if (discounts[i].valid_from === discounts[i].valid_to) {
				setMessageAndMode("Valid to and from cannot be same", "notice")
				setDiscounts(prev => {
					const copy = [...prev];
					copy[i].valid_from = "";
					copy[i].valid_to = "";
					return copy
				})
			} else if (discounts[i].valid_from > discounts[i].valid_to) {
				setMessageAndMode("Valid from cannot be after valid to.", "notice");
				setDiscounts(prev => {
					const copy = [...prev];
					copy[i].valid_from = "";
					copy[i].valid_to = "";
					return copy
				})
			}
		}
	}

	const checkCanContinue = () => {
		if (discounts.length < 1) {
			setCanContinue(false);
			return
		}
		
		const allValid = discounts.every(
			(discount) => discount.valid_from !== "" && discount.valid_to !== ""
		);

		setCanContinue(allValid);
	}

	useEffect(() => {
		checkCanContinue();
		checkValidFromTo();
	}, [discounts])

	return (
		<div className='w-full h-fit flex flex-col justify-center items-center gap-6 mt-5'>
			<h1 className='text-3xl font-poppins font-bold text-neutral-700'>Discounts</h1>
			<div className='w-full min-h-[5rem] rounded border-[1.5px] border-neutral-800/50 flex flex-col justify-start items-start gap-4 p-4'>
				{discounts?.map((discount, index) => (
					<div key={index} className='w-full min-h-24 rounded-sm border-[1.5px] border-neutral-800/50 flex flex-col justify-start items-start gap-4 p-4 relative'>
						<div className='w-full h-fit'>
							<h1 className='font-poppins text-lg text-neutral-700 font-semibold'>Discount {index + 1}</h1>
						</div>

						<div className='w-full flex-1 flex justify-start items-start gap-6'>
							<div className='w-fit h-full flex flex-col justify-start items-start gap-2'>
								<div className='w-fit h-fit flex justify-start items-center gap-2'>

									<FormControl required sx={{ width: '10rem' }}>
										<InputLabel htmlFor="amount" sx={{ color: '#a3a3a3', '&.Mui-focused': { color: '#737373' } }}>Amount</InputLabel>
										<OutlinedInput
											id="amount"
											type='number'
											value={discount.amount}
											onInput={(e) => {
												e.target.value = e.target.value.replace(/[^0-9]/g, "");
											}}
											onChange={(e) => {
												let newAmount = Number(e.target.value);
												if (e.target.value === "") {
													newAmount = "";
												}
												setDiscounts(prev => {
													const updated = [...prev];
													updated[index].amount = newAmount;
													return updated;
												});
											}}
											onBlur={() => {
												if (discount.amount === "" || discount.amount < 0 || discount.amount > 10000) {
													setDiscounts(prev => {
														const updated = [...prev];
														updated[index].amount = 0;
														return updated;
													});
												}
											}}
											startAdornment={<InputAdornment position="start" sx={{ color: '#404040' }}>Rs.</InputAdornment>}
											label="Amount"
											disabled={discount.discount_type === "free_delivery"}
											sx={{
												width: '10rem',
												color: '#404040',
												'&.MuiOutlinedInput-root': {
													'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
														borderColor: '#737373',
														borderWidth: 1,
													},
												},
												'&.MuiOutlinedInput-input': {
													color: '#404040',
												},
												'&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input': {
													color: '#404040',
												},
												":disabled": {
													display: 'none',
												}
											}}
										/>
									</FormControl>
									<Info info="This is the discount amount that will be cut from the customer's order. E.g. Order: Rs. 1950, Discount Amount: Rs. 500, Final Price: Rs. 1450" />
								</div>
								<div className='w-fit h-fit flex justify-start items-center gap-2'>
									<FormControl required sx={{ width: '12rem' }}>
										<InputLabel htmlFor="min_order_amount" sx={{ color: '#a3a3a3', '&.Mui-focused': { color: '#737373' } }}>Minimum Order Amount</InputLabel>
										<OutlinedInput
											id="min_order_amount"
											type='number'
											value={discount.min_order_amount}
											onInput={(e) => {
												e.target.value = e.target.value.replace(/[^0-9]/g, "");
											}}
											onChange={(e) => {
												setDiscounts(prev => {
													let newAmount = Number(e.target.value);
													if (e.target.value === "") {
														newAmount = "";
													}
													const updated = [...prev];
													updated[index].min_order_amount = newAmount;
													return updated;
												});
											}}
											onBlur={() => {
												if (discount.min_order_amount === "" || discount.min_order_amount < 100 || discount.min_order_amount > 10000) {
													setDiscounts(prev => {
														const updated = [...prev];
														updated[index].min_order_amount = 100;
														return updated;
													});
												}
											}}
											startAdornment={<InputAdornment position="start" sx={{ color: '#404040' }}>Rs.</InputAdornment>}
											label="Minimum Order Amount"
											sx={{
											width: '12rem',
											color: '#404040',
											'&.MuiOutlinedInput-root': {
												'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
												borderColor: '#737373',
												borderWidth: 1,
												},
											},
											'&.MuiOutlinedInput-input': {
												color: '#404040',
											},
											'&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input': {
												color: '#404040',
											},
											}}
										/>
									</FormControl>
									<Info info='This is the minimum amount of the order required for this discount to be applied. This value cannot be less than 100'/>
								</div>
							</div>
							<div className='w-fit h-full flex flex-col justify-start items-start gap-2'>
								<div className='w-fit h-fit flex justify-start items-center gap-2'>

									<FormControl required sx={{ width: '250px' }}>
										<InputLabel 
											id={`type-select-label-${index}`} 
											sx={{ 
											color: '#a3a3a3',
											'&.Mui-focused': {
												color: '#737373',
											}
											}}
										>
											Type
										</InputLabel>

										<Select
											labelId={`type-select-label-${index}`}
											id={`type-select-${index}`}
											value={discount.discount_type}
											label="Type *"
											onChange={(e) => {
												setDiscounts(prev => {
													const updated = [...prev];
													updated[index].discount_type = e.target.value;
													if (e.target.value === "free_delivery") {
														updated[index].amount = 0;	
													}
													return updated;
												});
											}}
											sx={{
											width: '250px',
											height: 60,
											'& .MuiOutlinedInput-notchedOutline': {
												borderColor: '#d4d4d4',
											},
											'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
												borderColor: '#737373',
												borderWidth: 1,
											},
											}}
										>
											<MenuItem value="percentage">Percentage (%)</MenuItem>
											<MenuItem value="fixed_amount">Fixed Amount (Rs.)</MenuItem>
											<MenuItem value="free_delivery">Free Delivery</MenuItem>
										</Select>
									</FormControl>
									<Info info="Percentage: Discount is the given percentage of the customer's order amount. Fixed Amount: Discount is fixed. Free Delivery: This discount does not require any amount. This discount removes any delivering charges for the customer on that order but requires a minimum order amount to be set."/>
								</div>
							</div>
							<div className='w-fit h-full flex flex-col justify-start items-start gap-2'>
								<div className='flex justify-start items-center gap-2'>
									<p className='text-lg font-poppins text-neutral-700'>Valid From</p>
									<input
										type="date"
										min={new Date().toISOString().split("T")[0]}
										max={getOneYearLaterDate()}
										value={discount.valid_from}
										className="w-[15rem] h-10 py-2 px-3 border-[1px] border-neutral-300 rounded-md transition duration-150 ease focus:outline-none focus:border-neutral-500 font-poppins text-neutral-500"
										onChange={(e) => {
											setDiscounts(prev => { 
												const copy = [...prev];
												copy[index].valid_from = e.target.value;
												return copy
											})
										}}
									/>
								</div>
								<div className='flex justify-start items-center gap-2'>
									<p className='text-lg font-poppins text-neutral-700'>Valid To</p>
									<input
										type="date"
										min={new Date().toISOString().split("T")[0]}
										max={getOneYearLaterDate()}
										value={discount.valid_to}
										className="w-[15rem] h-10 py-2 px-3 border-[1px] border-neutral-300 rounded-md transition duration-150 ease focus:outline-none focus:border-neutral-500 font-poppins text-neutral-500"
										onChange={(e) => {
											setDiscounts(prev => { 
												const copy = [...prev];
												copy[index].valid_to = e.target.value;
												return copy
											})
										}}
									/>
								</div>
							</div>
						</div>
						
						<button
							type="button"
							onClick={() => {
								setDiscounts(prev => {
									return prev.filter((d, i) => i !== index)
								})
							}}
							className='w-fit h-fit group p-1 border-[1px] border-neutral-800/50 rounded absolute right-3 top-3 flex justify-center items-center hover:bg-neutral-700 transition-colors'
						>
							<IoMdClose className='text-xl text-neutral-800 group-hover:text-white'/>
						</button>
					</div>
				))}
				
				<button
					type='button'
					onClick={() => {
						if (discounts.length === 3) {
							setMessageAndMode("You can only add 3 discounts at a time to your restaurant", "notice");
							return
						};
						setDiscounts(prev => [...prev, { amount: 1, discount_type: 'fixed_amount', min_order_amount: 100, valid_from: "", valid_to: "" }])
					}} 
					className='group w-full h-24 rounded-sm border-[1.5px] border-emerald-500/50 hover:bg-emerald-500/70 hover:text-white transition-all duration-150 ease-in-out text-3xl font-poppins font-semibold text-emerald-500 px-5 flex justify-between items-center'
				>
					<div className='w-fit h-full flex justify-center items-center gap-2'>
						<div className='h-full w-[1.2rem] bg-emerald-400 group-hover:bg-white'></div>
						<div className='h-full w-[0.4rem] bg-emerald-400 group-hover:bg-white'></div>
					</div>
					Create New
					<div className='w-fit h-full flex justify-center items-center gap-2'>
						<div className='h-full w-[0.4rem] bg-emerald-400 group-hover:bg-white'></div>
						<div className='h-full w-[1.2rem] bg-emerald-400 group-hover:bg-white'></div>
					</div>
				</button>
			</div>

			<div className='w-full h-fit flex justify-start items-center mt-10 gap-2'>
				<button type='button' onClick={() => { navigate('/create-restaurant?step=4') }} disabled={!canContinue} className='w-32 h-12 bg-neutral-800 rounded text-xl font-roboto font-semibold text-white transition hover:bg-neutral-700 disabled:bg-neutral-500 disabled:cursor-not-allowed'>Continue</button>
				<button type='button' onClick={() => { handleSkip() }} className='w-32 h-12 border-[1px] border-neutral-800/50 hover:bg-neutral-800 hover:text-white transition rounded text-xl font-roboto font-semibold text-neutral-700'>Skip</button>
			</div>

			<div className='w-full h-16'/>
		</div>
	);
};

export default CreateRestaurantStep3;