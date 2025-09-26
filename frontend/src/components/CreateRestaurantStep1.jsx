import React, { useContext, useEffect, useState } from 'react';
import Info from './Info';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { GlobalContext } from '../context/GlobalContext';
import { sendRequest } from '../utils/Utils';
import { CreateRestaurantContext } from '../context/CreateRestaurantContext';


const CreateRestaurantStep1 = () => {
	
	const { user } = useContext(AuthContext);
	const { setMessageAndMode } = useContext(GlobalContext);
	const { restaurantInfo, setRestaurantInfo } = useContext(CreateRestaurantContext);
	const [categories, setCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [canContinue, setCanContinue] = useState(false);
	const navigate = useNavigate();

	const handleCategorySelect = (category) => {

		const alreadySelected = selectedCategory && selectedCategory.value === category.value;
		if (alreadySelected) {
			setSelectedCategory(null);
			setRestaurantInfo({...restaurantInfo, category: ""});
			return;
		}

		setSelectedCategory(category);
		setRestaurantInfo({...restaurantInfo, category: category.value});
	}

	const handleContinue = () => {
		if (!restaurantInfo.name || !restaurantInfo.category || !restaurantInfo.address || !restaurantInfo.phone || !restaurantInfo.opening_time || !restaurantInfo.closing_time || !restaurantInfo.image) {
			setMessageAndMode("Please fill all the fields", "failure");
			return;
		}

		navigate(`/create-restaurant?step=2`);
	}

	const fetchCategories = async () => {
		const res = await sendRequest({
			method: "get",
			to: "/restaurants/categories/"
		});

		if (res) {
			setCategories(res.data);
		} else {
			setMessageAndMode("An error occurred", "failure");
			navigate('/');
		}
	}

	const checkCanContinue = () => {
		if (!restaurantInfo.name || !restaurantInfo.category || !restaurantInfo.address || !restaurantInfo.phone || !restaurantInfo.opening_time || !restaurantInfo.closing_time || !restaurantInfo.image) {
			setCanContinue(false);
		} else {
			setCanContinue(true);
		}
	}

	useEffect(() => {
		if (user) {
			fetchCategories();
		}
	}, [])

	useEffect(() => {
		checkCanContinue();
	}, [restaurantInfo])

	return (
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
					className="w-[15rem] h-10 py-4 px-3 border-[1px] border-neutral-300 text-lg rounded-md transition duration-150 ease focus:outline-none focus:border-neutral-500 font-semibold font-poppins text-neutral-700"
					onInput={(e) => {
						e.target.value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, "");
					}}
					onChange={(e) => { setRestaurantInfo({...restaurantInfo, name: e.target.value}) }}
				/>
			</div>
			<div className='w-fit h-fit flex flex-col justify-start items-start gap-2'>
				<div className='flex justify-start items-center gap-2'>
					<h2 className='text-xl font-poppins font-bold text-neutral-700'>Category</h2>
					<Info info="Your restaurant's category helps customers find it easily. If your desired category isn't listed, please select the closest one." />
				</div>
				<div className='w-1/2 h-fit flex flex-wrap justify-start items-center gap-2'>
					{categories.map((category, index) => {
						const selected = selectedCategory && selectedCategory.value === category.value;

						return (
							<div key={index} onClick={() => { handleCategorySelect(category) }} className={`w-fit h-[2rem] px-3 font-poppins border-[1px] border-neutral-500 rounded flex justify-center items-center cursor-pointer transition select-none ${selected ? 'bg-neutral-700 text-white' : 'text-neutral-700'}`}>
								{category.label}
							</div>
						)
					})}
				</div>
			</div>
			<div className='w-fit h-fit flex flex-col justify-start items-start gap-2'>
				<div className='flex justify-start items-center gap-2'>
					<h2 className='text-xl font-poppins font-bold text-neutral-700'>Info</h2>
					<Info info="Provide additional information about your restaurant, such as phone number, address, etc." />
				</div>
				<input
					value={restaurantInfo.address}
					type="text"
					maxLength={30}
					className="w-[15rem] h-10 py-4 px-3 border-[1px] border-neutral-300 rounded-md transition duration-150 ease focus:outline-none focus:border-neutral-500 font-poppins text-neutral-700"
					placeholder='Address'
					onInput={(e) => {
						e.target.value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, "");
					}}
					onChange={(e) => { setRestaurantInfo({...restaurantInfo, address: e.target.value}) }}
				/>
				<input
					value={restaurantInfo.phone}
					type="text"
					maxLength={11}
					className="w-[15rem] h-10 py-4 px-3 border-[1px] border-neutral-300 rounded-md transition duration-150 ease focus:outline-none focus:border-neutral-500 font-poppins text-neutral-700"
					placeholder='Phone'
					onInput={(e) => {
						e.target.value = e.target.value.replace(/[^0-9]/g, "");
					}}
					onChange={(e) => { setRestaurantInfo({...restaurantInfo, phone: e.target.value}) }}
				/>
			</div>
			<div className='w-fit h-fit flex flex-col justify-start items-start gap-2'>
				<div className='flex justify-start items-center gap-2'>
					<h2 className='text-xl font-poppins font-bold text-neutral-700'>Timings</h2>
					<Info info="This is the opening and closing times of your restaurant so that you do not get orders while your restaurant is closed." />
				</div>
				<div className='flex justify-start items-center gap-2'>
					<p className='text-lg font-poppins text-neutral-700'>Open</p>
					<input
						type="time"
						value={restaurantInfo.opening_time}
						className="w-[8rem] h-10 py-2 px-3 border-[1px] border-neutral-300 rounded-md transition duration-150 ease focus:outline-none focus:border-neutral-500 font-poppins text-neutral-500"
						onChange={e => {
							if (e.target.value === restaurantInfo.closing_time && restaurantInfo.closing_time !== "") {
								setRestaurantInfo(prev => ({...prev, opening_time: "", closing_time: "" }));
								setMessageAndMode("Opening & Closing time cannot be the same.", "notice");
							} else {
								setRestaurantInfo({ ...restaurantInfo, opening_time: e.target.value })
							}
						}}
					/>
				</div>
				<div className='flex justify-start items-center gap-2'>
					<p className='text-lg font-poppins text-neutral-700'>Close</p>
					<input
						type="time"
						value={restaurantInfo.closing_time}
						className="w-[8rem] h-10 py-2 px-3 border-[1px] border-neutral-300 rounded-md transition duration-150 ease focus:outline-none focus:border-neutral-500 font-poppins text-neutral-500"
						onChange={e => {
							if (restaurantInfo.opening_time === e.target.value && restaurantInfo.opening_time !== "") {
								setRestaurantInfo(prev => ({...prev, opening_time: "", closing_time: "" }));
								setMessageAndMode("Opening & Closing time cannot be the same.", "notice");
							} else {
								setRestaurantInfo({ ...restaurantInfo, closing_time: e.target.value })
							}
						}}
					/>
				</div>
			</div>
			<div className='w-fit h-fit flex flex-col justify-start items-start gap-2'>
				<div className='flex justify-start items-center gap-2'>
					<h2 className='text-xl font-poppins font-bold text-neutral-700'>Image</h2>
					<Info info="Upload an image of your restaurant. 16:9 aspect ratio recommended." />
				</div>
				<div className='flex justify-start items-center gap-2'>
					<label htmlFor="restaurant-image-upload" className="bg-neutral-800 text-white px-3 py-2 rounded cursor-pointer text-sm font-poppins">
						Upload Image
					</label>
					<input
						id="restaurant-image-upload"
						type="file"
						accept="image/*"
						className='hidden'
						onChange={e => {
							setRestaurantInfo({
								...restaurantInfo,
								image: e.target.files[0]
							});
						}}
					/>
					{restaurantInfo.image && (
						<span className="ml-2 text-sm text-neutral-700">{restaurantInfo.image.name}</span>
					)}
				</div>
			</div>
			<button onClick={() => { handleContinue() }} disabled={!canContinue} className={`w-32 h-12 bg-neutral-800 rounded text-xl font-roboto font-semibold text-white hover:bg-neutral-700 transition disabled:bg-neutral-500 disabled:cursor-not-allowed`}>
				Continue
			</button>
			<div className='w-full h-[10rem]'/>
		</div>
	)
}

export default CreateRestaurantStep1;
