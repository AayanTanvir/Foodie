import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalContext';
import CreateRestaurantStep1 from '../components/CreateRestaurantStep1';
import CreateRestaurantStep2 from '../components/CreateRestaurantStep2';
import CreateRestaurantStep3 from '../components/CreateRestaurantStep3';
import CreateRestaurantConfirmation from '../components/CreateRestaurantConfirmation';
import { IoMdArrowBack } from "react-icons/io";

const CreateEditRestaurantPage = ({ create=true }) => {
	
	const searchParams = useSearchParams()[0];
	const step = searchParams.get('step') || '1';
	const { user } = useContext(AuthContext);
	const { setMessageAndMode } = useContext(GlobalContext);
	const navigate = useNavigate();


	useEffect(() => {
		if (user && !user?.is_email_verified) {
			setMessageAndMode("Verify your email to create a restaurant.", "failure");
			navigate('/');
		}
	}, [])

	if (create) {
		return (
			<div className='absolute top-0 left-0 w-full h-full flex flex-col justify-start items-center mt-12 p-4 gap-10'>
				{step > 1 && (
					<button onClick={() => { navigate(`/create-restaurant?step=${step - 1}`) }} type='button' className='absolute top-8 left-5 px-2 py-1 rounded-full border-[1px] border-neutral-700 flex justify-center items-center gap-1 text-neutral-700 font-roboto text-nowrap disabled:bg-neutral-500'>
						<IoMdArrowBack className='text-neutral-700 text-lg'/>
						Back
					</button>
				)}
				<h1 className='text-3xl font-poppins font-bold text-neutral-700 mt-4'>Create Your Restaurant</h1>
				<div className='flex justify-between items-center w-[30rem] relative'>
					<div className='w-[30rem] h-[1px] z-0 border-t-[1px] border-neutral-800 absolute' />
					<div className='relative'>
						<div className={`w-9 h-9 rounded-full z-10 flex justify-center items-center border-[1px] border-neutral-800 ${step === '1' ? 'bg-neutral-800' : 'bg-white'}`}>
							<p className={`text-lg font-poppins font-semibold text-neutral-800 ${step === '1' ? 'text-white' : 'text-neutral-700'}`}>1</p>
						</div>
						<h2 className={`font-poppins text-lg font-semibold text-neutral-700 absolute -bottom-8 left-1/2 -translate-x-1/2`}>Restaurant</h2>
					</div>
					<div className='relative'>
						<div className={`w-9 h-9 rounded-full z-10 flex justify-center items-center border-[1px] border-neutral-800 ${step === '2' ? 'bg-neutral-800' : 'bg-white'}`}>
							<p className={`text-lg font-poppins font-semibold text-neutral-800 ${step === '2' ? 'text-white' : 'text-neutral-700'}`}>2</p>
						</div>
						<h2 className={`font-poppins text-lg font-semibold text-neutral-700 absolute -bottom-8 left-1/2 -translate-x-1/2`}>Menu</h2>
					</div>
					<div className='relative'>
						<div className={`w-9 h-9 rounded-full z-10 flex justify-center items-center border-[1px] border-neutral-800 ${step === '3' ? 'bg-neutral-800' : 'bg-white'}`}>
							<p className={`text-lg font-poppins font-semibold text-neutral-800 ${step === '3' ? 'text-white' : 'text-neutral-700'}`}>3</p>
						</div>
						<h2 className={`font-poppins text-lg font-semibold text-neutral-700 absolute -bottom-8 left-1/2 -translate-x-1/2`}>Discounts</h2>
					</div>
					<div className='relative'>
						<div className={`w-9 h-9 rounded-full z-10 flex justify-center items-center border-[1px] border-neutral-800 ${step === '4' ? 'bg-neutral-800' : 'bg-white'}`}>
							<p className={`text-lg font-poppins font-semibold text-neutral-800 ${step === '4' ? 'text-white' : 'text-neutral-700'}`}>4</p>
						</div>
						<h2 className={`font-poppins text-lg font-semibold text-neutral-700 absolute -bottom-8 left-1/2 -translate-x-1/2`}>Confirmation</h2>
					</div>
				</div>
				{step === '1' && <CreateRestaurantStep1 />}
				{step === '2' && <CreateRestaurantStep2 />}
				{step === '3' && <CreateRestaurantStep3 />}
				{step === '4' && <CreateRestaurantConfirmation />}
			</div>
		)
	} else {
		return (
			<div className='absolute top-0 left-0 w-full h-full flex flex-col justify-start items-center mt-12 p-4'>
				<h1 className='text-3xl font-poppins font-bold text-neutral-700 mt-4'>Edit Your Restaurant</h1>
			</div>
		)
	}
}

export default CreateEditRestaurantPage
