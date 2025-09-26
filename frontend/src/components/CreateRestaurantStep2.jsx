import React, { useContext, useEffect, useState } from 'react';
import { IoMdClose } from "react-icons/io";
import { FormControl, InputLabel, Select, MenuItem, TextField, OutlinedInput, InputAdornment, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { CiImageOn } from "react-icons/ci";
import Info from './Info';
import { GlobalContext } from "../context/GlobalContext"
import { CreateRestaurantContext } from '../context/CreateRestaurantContext';
import { useNavigate } from 'react-router-dom';

const CreateRestaurantStep2 = () => {

	const { 
		menuItems, setMenuItems,
		menuItemCategories, setMenuItemCategories, 
		menuItemModifiers, setMenuItemModifiers,
		modifierChoices, setModifierChoices
	} = useContext(CreateRestaurantContext);
	const { setMessageAndMode } = useContext(GlobalContext);
	const navigate = useNavigate();
	const [canContinue, setCanContinue] = useState(false);

	const handleAddMenuItem = () => {
		setMenuItems(prev => [...prev, { name: "", description: "", price: 1, image: null, category: "", is_side_item: false }]);
	}

	const handleRemoveMenuItem = (index) => {
		setMenuItems(prev => prev.filter((item, i) => i !== index));
	}

	const handleModifierChoiceOnBlur = (e, modifierIndex, choiceIndex) => {
		const newLabel = e.target.value.trim();
		
		setModifierChoices(prev => {
			const choicesArrCopy = [...prev[modifierIndex]];
			
			const duplicateExists = choicesArrCopy.some((choice, index) => 
				index !== choiceIndex && 
				choice.label.trim() === newLabel && 
				newLabel !== ""
			);
			
			if (duplicateExists) {
				choicesArrCopy[choiceIndex].label = "";
				setMessageAndMode("You cannot have duplicate choices", "notice");
			}
			
			return {...prev, [modifierIndex]: choicesArrCopy};
		});
	};

	const checkCanContinue = () => {
		if (menuItems.length < 1 || menuItemCategories.length < 1) {
			setCanContinue(false);
			return
		}

		if (menuItemModifiers.length >= 1) {
			
			if (Object.entries(modifierChoices).length === 0) {
				setCanContinue(false);
				return
			}
			
			const areModifiersFaulty = menuItemModifiers.some(modifier => modifier.name === "" || modifier.menu_item === "")
			let areModifierChoicesFaulty = false;
			Object.entries(modifierChoices).forEach(choice => {
				const choicesArr = choice[1];
				areModifierChoicesFaulty = choicesArr.some(choice => choice.label === "");
			})
			
			if (areModifiersFaulty || areModifierChoicesFaulty) {
				setCanContinue(false);
				return
			}
		}

		setCanContinue(true);
	}

	useEffect(() => {
		checkCanContinue();
	}, [menuItems, menuItemCategories, menuItemModifiers, modifierChoices])


	return (
		<div className='w-full h-fit flex flex-col justify-center items-center gap-4 mt-5'>
			<h1 className='text-3xl font-poppins font-bold text-neutral-700'>Menu Items *</h1>
			<div className='w-full min-h-[5rem] rounded border-[1.5px] border-neutral-800/50 flex flex-col justify-start items-start gap-4 p-4'>
				{menuItems.map((item, index) => (
					<div key={index} className='w-full min-h-24 rounded-sm border-[1.5px] border-neutral-800/50 flex flex-col justify-start items-start gap-4 p-4 relative'>
						<div className='w-full h-fit'>
							<h1 className='font-poppins text-lg text-neutral-700 font-semibold'>Menu Item {index + 1}</h1>
						</div>

						<div className='w-full flex-1 flex justify-start items-start gap-6'>
							<div className='w-fit h-full flex flex-col justify-start items-start gap-2'>
								<FormControl required sx={{ width: '20rem' }}>
									<TextField 
										label="Name *"
										variant="outlined"
										value={item.name}
										onInput={(e) => {
											e.target.value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, "");
											if (e.target.value.length > 40) {
												e.target.value = e.target.value.slice(0, 40);
											}
										}}
										onChange={(e) => { 
											const newName = e.target.value;
											setMenuItems(prev => {
												const updated = [...prev];
												updated[index].name = newName;
												return updated;
											});
										}}
										sx={{
											width: '20rem',
											color: '#737373',
											'& .MuiOutlinedInput-root': {
												'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
													borderColor: '#737373',
													borderWidth: 1,
												},
											},
											'& .MuiOutlinedInput-input': {
												color: '#404040',
											},
											'& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input': {
												color: '#404040',
											},
											'& label.Mui-focused': {
												color: '#737373',
											},
											'& label': { color: '#a3a3a3' }
										}}
									/>
								</FormControl>
								<TextField 
									label="Description"
									variant="outlined"
									multiline
									maxRows={4}
									value={item.description}
									onChange={(e) => {
										const newDescription = e.target.value;
										setMenuItems(prev => {
											const updated = [...prev];
											updated[index].description = newDescription;
											return updated;
										});
									}}
									sx={{
										width: '20rem',
										color: '#737373',
										'& .MuiOutlinedInput-root': {
											'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
												borderColor: '#737373',
												borderWidth: 1,
											},
										},
										'& .MuiOutlinedInput-input': {
											color: '#404040',
										},
										'& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input': {
											color: '#404040',
										},
										'& label.Mui-focused': {
											color: '#737373',
										},
										'& label': { color: '#a3a3a3' }
									}}
								/>
							</div>
							<div className='w-fit h-full flex flex-col justify-start items-start gap-2'>
								<FormControl required sx={{ width: '10rem' }}>
									<InputLabel htmlFor="price" sx={{ color: '#a3a3a3', '&.Mui-focused': { color: '#737373' } }}>Amount</InputLabel>
									<OutlinedInput
										id="price"
										type='number'
										value={item.price}
										onInput={(e) => {
											e.target.value = e.target.value.replace(/[^0-9]/g, "");
										}}
										onChange={(e) => {
											setMenuItems(prev => {
												let newPrice = Number(e.target.value);
												if (e.target.value === "") {
													newPrice = ""
												}
												const updated = [...prev];
												updated[index].price = newPrice;
												return updated;
											});
										}}
										onBlur={() => {
											if (item.price === "" || item.price < 1 || item.price > 10000) {
												setMenuItems(prev => {
													const updated = [...prev];
													updated[index].price = 0;
													return updated;
												});
											}
										}}
										startAdornment={<InputAdornment position="start" sx={{ color: '#404040' }}>Rs.</InputAdornment>}
										label="Amount"
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
										}}
									/>
								</FormControl>

								<FormControl required sx={{ minWidth: 120, width: '250px' }}>
									<InputLabel 
										id={`category-select-label-${index}`} 
										sx={{ 
											color: '#a3a3a3',
											'&.Mui-focused': {
												color: '#737373',
											}
										}}
									>
										Category
									</InputLabel>

									<Select
										labelId={`category-select-label-${index}`}
										id={`category-select-${index}`}
										value={item.category}
										label="Category *"
										onChange={(e) => {
											setMenuItems(prev => {
												const updated = [...prev];
												updated[index].category = e.target.value;
												return updated;
											})
										}}
										sx={{
											minWidth: 120,
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
										{menuItemCategories.map(category => (
											<MenuItem key={category} value={category}>{category}</MenuItem>
										))}
										{menuItemCategories.length === 0 && (
											<MenuItem disabled>No Categories Created.</MenuItem>
										)}
									</Select>
								</FormControl>
							</div>
							<div className='w-[15rem] px-4 relative h-full cursor-pointer rounded border-[1px] border-neutral-700 flex justify-center items-center gap-2'>
								{item.image && (
									<button
										type='button' 
										onClick={() => {
											setMenuItems(prev => {
												const updated = [...prev];
												updated[index].image = null;
												return updated;
											});
										}}
										className='p-1 rounded-full border-[1px] border-neutral-700 bg-white flex justify-center items-center absolute top-2 right-2 hover:bg-neutral-200'
										>
										<IoMdClose className='text-neutral-700'/>
									</button>
								)}
								{!item.image && <Info classes='absolute top-2 left-2 ' info="Image for your menu item. Recommended image aspect ratio is 1:1. A default image will be used if none provided."/>}
								<label htmlFor={`menu-item-image-${index}`} className="w-full h-full flex justify-center items-center gap-2 cursor-pointer">
									<input
										id={`menu-item-image-${index}`}
										type="file"
										accept="image/*"
										className='hidden'
										onChange={e => {
											setMenuItems(prev => {
												const updated = [...prev];
												updated[index].image = e.target.files[0];
												return updated;
											});
										}}
									/>
									{item.image ? <img src={URL.createObjectURL(item.image)} alt="" className='min-w-20 max-h-20 rounded'/> : <CiImageOn className='text-4xl text-neutral-700'/>}
									<h2 className='text-sm font-poppins text-neutral-700 truncate'>{item.image ? item.image.name : 'Menu Item Image *'}</h2>
								</label>
							</div>
							<div className='w-fit h-full flex justify-center items-start'>
								<div 
									onClick={() => { setMenuItems(prev => {
										const updated = [...prev];
										updated[index].is_side_item = !updated[index].is_side_item;
										return updated;
									})}}
								 	className='flex items-center gap-2'
								>
									<div className='min-h-5 min-w-5 border-[1px] border-neutral-700 rounded-full p-1 flex justify-center items-center'>
										{item.is_side_item && <div className='min-w-3 min-h-3 bg-neutral-700 rounded-full'></div>}
									</div>
									<h2 className='text-lg text-neutral-700 font-poppins select-none'>Side Item</h2>
									<Info info='Check this option if this menu item a side item. Side items are Supplements that can be ordered along with other items for example: Sauces, Beverages'/>
								</div>
							</div>
						</div>
						
						<button onClick={() => { handleRemoveMenuItem(index) }} className='w-fit h-fit group p-1 border-[1px] border-neutral-800/50 rounded absolute right-3 top-3 flex justify-center items-center hover:bg-neutral-700 transition-colors'>
							<IoMdClose className='text-xl text-neutral-800 group-hover:text-white'/>
						</button>
					</div>
				))}
				
				<button onClick={() => { handleAddMenuItem() }} className='group w-full h-24 rounded-sm border-[1.5px] border-emerald-500/50 hover:bg-emerald-500/70 hover:text-white transition-all duration-150 ease-in-out text-3xl font-poppins font-semibold text-emerald-500 px-5 flex justify-between items-center'>
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
			
			<div className='w-full h-fit flex justify-start items-start mt-12 gap-4'>
				<div className='w-[45%] min-h-[5rem] flex flex-col justify-center items-center gap-2'>
					<div className='flex justify-center items-center gap-2'>
						<h1 className='text-3xl font-poppins font-bold text-neutral-700'>Categories *</h1>
						<Info info="Create different categories to organize your menu items in! These help the customer find what they're looking for"/>
					</div>

					<div className='w-full min-h-[5rem] flex flex-col justify-start items-start gap-4'>
						{menuItemCategories.map((category, index) => (
							<div key={index} className='w-full h-fit flex flex-col justify-start items-start relative'>
								
								<FormControl required sx={{ minWidth: 120, width: '250px' }}>
									<TextField
										label="Name *"
										variant="outlined"
										value={category}
										onInput={(e) => {
											e.target.value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, "");
											if (e.target.value.length > 30) {
												e.target.value = e.target.value.slice(0, 30);
											}
										}}
										onChange={(e) => { 
											const newCategory = e.target.value;
											setMenuItemCategories(prev => {
												const updated = [...prev];
												updated[index] = newCategory;
												return updated;
											});
										}}
										sx={{
											width: '20rem',
											color: '#737373',
											'& .MuiOutlinedInput-root': {
												'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
													borderColor: '#737373',
													borderWidth: 1,
												},
											},
											'& .MuiOutlinedInput-input': {
												color: '#404040',
											},
											'& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input': {
												color: '#404040',
											},
											'& label.Mui-focused': {
												color: '#737373',
											},
											'& label': { color: '#a3a3a3' }
										}}
									/>
								</FormControl>

								<button 
									type='button' 
									onClick={() => { setMenuItemCategories(prev => {
										const updated = [...prev];
										updated.splice(index, 1);
										return updated;
									})}}
									className='w-fit h-fit group p-1 border-[1px] border-neutral-800/50 rounded absolute right-0 top-1/2 -translate-y-1/2 flex justify-center items-center hover:bg-neutral-700 transition-colors'
								>
									<IoMdClose className='text-xl text-neutral-800 group-hover:text-white'/>
								</button>
							</div>
						))}
						<button type='button' onClick={() => { setMenuItemCategories(prev => [...prev, ""]) }} className='group w-full h-24 rounded-sm border-[1.5px] border-emerald-500/50 hover:bg-emerald-500/70 hover:text-white transition-all duration-150 ease-in-out text-3xl font-poppins font-semibold text-emerald-500 px-5 flex justify-between items-center'>
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
				</div>
				
				<div className='w-full min-h-[5rem] flex flex-col justify-center items-center gap-2'>
					<div className='flex justify-center items-center gap-2'>
						<h1 className='text-3xl font-poppins font-bold text-neutral-700'>Modifiers</h1>
						<Info info='Modifiers help user customize the menu item to their liking. For example, if you have a Pizza menu item, you could create a modifier for its size so the customer can choose if they want small, medium, or large Pizza'/>
					</div>
					<div className='w-full min-h-[5rem] flex flex-col justify-start items-start gap-4'>
						
						{menuItemModifiers.map((modifier, index) => (
							<div key={index} className='w-full min-h-[8rem] rounded border-[1px] border-neutral-800/50 flex flex-col justify-start items-start gap-4 p-4 relative'>

								<div className='w-full h-fit'>
									<h1 className='font-poppins text-lg text-neutral-700 font-semibold'>Modifier {index + 1}</h1>
								</div>

								<div className='w-full h-fit flex flex-col justify-start items-start gap-2'>
									<div className='w-fit h-full flex justify-start items-center gap-6'>
										<div className='flex justify-start items-center gap-2 w-fit h-fit'>
											<FormControl required sx={{ width: '20rem' }}>
												<TextField 
													label="Name *"
													variant="outlined"
													value={modifier.name}
													onInput={(e) => {
														e.target.value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, "");
														if (e.target.value.length > 30) {
															e.target.value = e.target.value.slice(0, 30);
														}
													}}
													onChange={(e) => { 
														const newName = e.target.value;
														setMenuItemModifiers(prev => {
															const updated = [...prev];
															updated[index].name = newName;
															return updated;
														});
													}}
													sx={{
														width: '20rem',
														color: '#737373',
														'& .MuiOutlinedInput-root': {
															'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
																borderColor: '#737373',
																borderWidth: 1,
															},
														},
														'& .MuiOutlinedInput-input': {
															color: '#404040',
														},
														'& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input': {
															color: '#404040',
														},
														'& label.Mui-focused': {
															color: '#737373',
														},
														'& label': { color: '#a3a3a3' }
													}}
												/>
											</FormControl>
											<Info info='The name of the modifier should be set to the property it is effecting, e.g. A modifier name for the size of the pizza crust: Crust Size'/>
										</div>

										<div className='w-fit h-full flex justify-center items-start'>
											<div 
												onClick={() => { setMenuItemModifiers(prev => {
													const updated = [...prev];
													updated[index].is_required = !updated[index].is_required;
													return updated;
												})}}
												className='flex items-center gap-2'
											>
												<div className='min-h-5 min-w-5 border-[1px] border-neutral-700 rounded-full p-1 flex justify-center items-center'>
													{modifier.is_required && <div className='min-w-3 min-h-3 bg-neutral-700 rounded-full'></div>}
												</div>
												<h2 className='text-lg text-neutral-700 font-poppins select-none'>Required *</h2>
												<Info info='Enable this option if this modifier is mandatory and should not be skipped.'/>
											</div>
										</div>
										<div className='w-fit h-full flex justify-center items-start'>
											<div 
												onClick={() => { setMenuItemModifiers(prev => {
													const updated = [...prev];
													updated[index].is_multiselect = !updated[index].is_multiselect;
													return updated;
												})}}
												className='flex items-center gap-2'
											>
												<div className='min-h-5 min-w-5 border-[1px] border-neutral-700 rounded-full p-1 flex justify-center items-center'>
													{modifier.is_multiselect && <div className='min-w-3 min-h-3 bg-neutral-700 rounded-full'></div>}
												</div>
												<h2 className='text-lg text-neutral-700 font-poppins select-none'>Multiselect *</h2>
												<Info info='Enable this option if you want the customer to be able to select more than 1 option from this modifier.'/>
											</div>
										</div>
									</div>
									<div className='w-fit h-full flex justify-start items-center gap-6'>
										<FormControl required sx={{ width: '250px' }}>
											<InputLabel 
												id={`menu-item-select-label-${index}`}
												sx={{ 
													color: '#a3a3a3',
													'&.Mui-focused': {
														color: '#737373',
													}
												}}
											>
												Menu Item
											</InputLabel>

											<Select
												labelId={`menu-item-select-label-${index}`}
												id={`menu-item-select-${index}`}
												value={modifier.menu_item}
												label="Menu Item *"
												onChange={(e) => {
													setMenuItemModifiers(prev => {
														const copy = [...prev];
														copy[index].menu_item = e.target.value
														return copy
													})
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
												{menuItems.length === 0 ? (
													<MenuItem disabled>No Items Created.</MenuItem>
												) : 
													menuItems.map((item, index) => (
														<MenuItem key={index} value={item.name}>{item.name}</MenuItem>
													))
												}
											</Select>
										</FormControl>
									</div>
									<div className='w-full min-h-[2rem] border-[1px] border-neutral-800/50 rounded flex flex-col justify-start items-start gap-2 p-4'>
										<h2 className='text-lg text-neutral-700 font-poppins font-semibold'>Modifier Options *</h2>

										{(modifierChoices[index] ?? []).map((choice, choiceIndex) => (
											<div key={choiceIndex} className='w-full h-16 flex justify-start items-center gap-2 relative'>
												<FormControl required sx={{ width: '20rem' }}>
													<TextField 
														label="Option Label *"
														variant="outlined"
														value={choice?.label}
														onInput={(e) => {
															e.target.value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, "");
															if (e.target.value.length > 30) {
																e.target.value = e.target.value.slice(0, 30);
															}
														}}
														onChange={(e) => {
															setModifierChoices(prev => {
																const choicesArrCopy = [...prev[index]];
																choicesArrCopy[choiceIndex].label = e.target.value;
																return {...prev, [index]: choicesArrCopy};
															});
														}}
														onBlur={(e) => handleModifierChoiceOnBlur(e, index, choiceIndex)}
														sx={{
															width: '20rem',
															color: '#737373',
															'& .MuiOutlinedInput-root': {
																'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
																	borderColor: '#737373',
																	borderWidth: 1,
																},
															},
															'& .MuiOutlinedInput-input': {
																color: '#404040',
															},
															'& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input': {
																color: '#404040',
															},
															'& label.Mui-focused': {
																color: '#737373',
															},
															'& label': { color: '#a3a3a3' }
														}}
													/>
												</FormControl>
												<div className='w-fit h-fit flex justify-start items-center gap-2'>

													<FormControl required sx={{ width: '10rem' }}>
														<InputLabel htmlFor="price" sx={{ color: '#a3a3a3', '&.Mui-focused': { color: '#737373' } }}>Amount</InputLabel>
														<OutlinedInput
															id="price"
															type='number'
															value={choice.price}
															onInput={(e) => {
																e.target.value = e.target.value.replace(/[^0-9]/g, "");
															}}
															onChange={(e) => {
																let newPrice = Number(e.target.value);
																if (e.target.value === "") {
																	newPrice = "";
																}
																setModifierChoices(prev => {
																	const copy = {...prev};
																	const choicesArr = [...copy[index]];
																	choicesArr[choiceIndex].price = newPrice;
																	return {...prev, [index]: choicesArr};
																});
															}}
															onBlur={() => {
																if (choice.price === "" || choice.price < 1 || choice.price > 10000) {
																	setModifierChoices(prev => {
																		const copy = {...prev};
																		const choicesArr = [...copy[index]];
																		choicesArr[choiceIndex].price = 0;
																		return {...prev, [index]: choicesArr};
																	});
																}
															}}
															startAdornment={<InputAdornment position="start">Rs.</InputAdornment>}
															label="Amount"
															sx={{
																width: '10rem',
																color: '#737373',
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
													<Info info='This is the additional cost for this modification. The price of this modification will be added to the price of the menu item. Set to 0 if you do not want to charge any additional fees for this modification'/>
												</div>
												<button 
													type='button' 
													onClick={() => { 
														setModifierChoices(prev => {
															const copy = { ...prev };
															const choicesArr = [...copy[index]];
															choicesArr.splice(choiceIndex, 1);
															if (choicesArr.length === 0) {
																delete copy[index];
															} else {
																copy[index] = choicesArr;
															}
															return copy;
														})
													}}
													className='w-fit h-fit group p-1 border-[1px] border-neutral-800/50 rounded absolute right-2 top-1/2 -translate-y-1/2 flex justify-center items-center hover:bg-neutral-700 transition-colors'
												>
													<IoMdClose className='text-xl text-neutral-800 group-hover:text-white'/>
												</button>
											</div>
										))}

										<button
											type='button'
											onClick={() => { 
												setModifierChoices(prev => {
													const copy = {...prev};
													copy[index] = [...(copy[index] ?? []), { label: "", price: 1 }];
													return copy;
												})
											}} 
											className='w-full h-12 rounded-sm border-[1.5px] border-neutral-800/50 hover:bg-neutral-800 hover:text-white transition-all duration-150 ease-in-out text-xl font-poppins font-semibold text-neutral-700 px-5 flex justify-center items-center'
										>
											Add Choice
										</button>
									</div>
								</div>

								<button 
									type='button' 
									onClick={() => { 
										setMenuItemModifiers(prev => {
											return prev.filter(m => m !== modifier)
										})
										setModifierChoices(prev => {
											const copy = { ...prev };
											delete copy[index];
											return copy;
										})
									}}
									className='w-fit h-fit group p-1 border-[1px] border-neutral-800/50 rounded absolute right-2 top-2 flex justify-center items-center hover:bg-neutral-700 transition-colors'
								>
									<IoMdClose className='text-xl text-neutral-800 group-hover:text-white'/>
								</button>
							</div>
						))}

						<button
							type='button'
							onClick={() => { 
								setMenuItemModifiers(prev => [...prev, { name: "", is_required: false, is_multiselect: false, menu_item: "", }])
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
				</div>
			</div>

			<div className='w-full h-fit flex justify-start items-center mt-10'>
				<button type='button' onClick={() => { navigate('/create-restaurant?step=3') }} disabled={!canContinue} className='w-32 h-12 bg-neutral-800 rounded text-xl font-roboto font-semibold text-white hover:bg-neutral-700 disabled:bg-neutral-500 disabled:cursor-not-allowed'>Continue</button>
			</div>

			<div className='w-full h-16'/>
		</div>
	)
}

export default CreateRestaurantStep2
