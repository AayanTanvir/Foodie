import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../context/AuthContext';
import { SlInfo } from "react-icons/sl";
import Info from '../components/Info';

const CreateEditRestaurantPage = ({ create=true }) => {
	
	const { user } = useContext(AuthContext);
	const [restaurantInfo, setRestaurantInfo] = useState({ name: "", category: "", address: "", phone: "", opening_time: "", closing_time: "" });


	useEffect(() => {
		if (!user?.is_email_verified) {
			setMessageAndMode("Verify your email to create a restaurant.", "failure");
			navigate('/');
		}
	}, [])

	if (create) {
		return (
			<div className='absolute top-0 left-0 w-full h-full flex flex-col justify-start items-center mt-12 p-4 gap-10'>
				<h1 className='text-3xl font-poppins font-bold text-neutral-700 mt-4'>Create Your Restaurant</h1>
				<div className='w-full h-fit flex flex-col justify-start items-start gap-6'>
					<div className='w-fit h-fit flex flex-col justify-start items-start gap-2'>
						<div className='flex justify-start items-center gap-2'>
							<h2 className='text-xl font-poppins font-bold text-neutral-700'>Restaurant Name</h2>
							<Info info="This is the official name of your restaurant which will be displayed to the customers" />
						</div>
						<input
							value={restaurantInfo.name}
							type="text"
							maxLength={20}
							className="w-[15rem] h-10 py-4 pl-3 border-[1px] border-neutral-300 text-lg rounded-md transition duration-150 ease focus:outline-none focus:border-neutral-500 font-semibold font-poppins text-neutral-700"
							onInput={(e) => {
								e.target.value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, "");
							}}
							onChange={(e) => { setRestaurantInfo({...restaurantInfo, name: e.target.value}) }}
						/>
					</div>
					<div className='w-fit h-fit flex flex-col justify-start items-start gap-2'>
						<div className='flex justify-start items-center gap-2'>
							<h2 className='text-xl font-poppins font-bold text-neutral-700'>Category</h2>
							<Info info="Your restaurant's category helps customers find it easily." />
						</div>
						<div className='w-1/2 h-fit flex flex-wrap justify-start items-center gap-2'>
							<div className='w-fit h-[2rem] px-2 border-[1px] border-neutral-500 rounded flex justify-center items-center'>
								Some
							</div>
							<div className='w-fit h-[2rem] px-2 border-[1px] border-neutral-500 rounded flex justify-center items-center'>
								Sharwarm
							</div>
							<div className='w-fit h-[2rem] px-2 border-[1px] border-neutral-500 rounded flex justify-center items-center'>
								Category
							</div>
							<div className='w-fit h-[2rem] px-2 border-[1px] border-neutral-500 rounded flex justify-center items-center'>
								Yes
							</div>
							<div className='w-fit h-[2rem] px-2 border-[1px] border-neutral-500 rounded flex justify-center items-center'>
								Category
							</div>
							<div className='w-fit h-[2rem] px-2 border-[1px] border-neutral-500 rounded flex justify-center items-center'>
								Category
							</div>
							<div className='w-fit h-[2rem] px-2 border-[1px] border-neutral-500 rounded flex justify-center items-center'>
								Category
							</div>
							<div className='w-fit h-[2rem] px-2 border-[1px] border-neutral-500 rounded flex justify-center items-center'>
								Category
							</div>
							<div className='w-fit h-[2rem] px-2 border-[1px] border-neutral-500 rounded flex justify-center items-center'>
								Category
							</div>
							<div className='w-fit h-[2rem] px-2 border-[1px] border-neutral-500 rounded flex justify-center items-center'>
								Category
							</div>
							<div className='w-fit h-[2rem] px-2 border-[1px] border-neutral-500 rounded flex justify-center items-center'>
								Category
							</div>
							<div className='w-fit h-[2rem] px-2 border-[1px] border-neutral-500 rounded flex justify-center items-center'>
								Category
							</div>
							<div className='w-fit h-[2rem] px-2 border-[1px] border-neutral-500 rounded flex justify-center items-center'>
								Category
							</div>
							<div className='w-fit h-[2rem] px-2 border-[1px] border-neutral-500 rounded flex justify-center items-center'>
								Category
							</div>
						</div>
					</div>
				</div>
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
