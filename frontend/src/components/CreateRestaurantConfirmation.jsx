import React, { useContext, useEffect } from 'react'
import { BsShop } from "react-icons/bs";
import { CreateRestaurantContext } from '../context/CreateRestaurantContext';
import { GlobalContext } from '../context/GlobalContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { sendRequest } from '../utils/Utils';

const CreateRestaurantConfirmation = () => {

	const { 
		restaurantInfo, setRestaurantInfo,
		menuItems, setMenuItems,
		menuItemCategories, setMenuItemCategories,
		menuItemModifiers, setMenuItemModifiers,
		modifierChoices, setModifierChoices,
        discounts, setDiscounts,
	} = useContext(CreateRestaurantContext);
	const { setMessageAndMode } = useContext(GlobalContext);
	const { user } = useContext(AuthContext);
	const navigate = useNavigate();
	const searchParams = useSearchParams()[0];
	const step = searchParams.get('step') || '1';

	const validateRestaurantData = () => {
		// Restaurant Info
		const restaurantInfoHasFaulty = Object.entries(restaurantInfo).some(([key, value]) => value === null || value === "")

		if (restaurantInfoHasFaulty) {
			setMessageAndMode("Required fields are empty, please try again.", "failure");
			navigate('/create-restaurant');
			return
		}
	
		// Menu
		if (menuItems.length < 1 || menuItemCategories.length < 1) {
			setMessageAndMode("Menu is incomplete, please try again.", "failure");
			navigate('/create-restaurant?step=2');
			return
		} else {
			const hasFaulty = menuItems.some(menuItem =>
				Object.entries(menuItem).some(([key, value]) => {
					if (key === "is_side_item" || key === "description") return false;

					return value == null || value === "" || (typeof value === "number" && value < 1);
				})
			);

			if (hasFaulty) {
				setMessageAndMode("Menu is incomplete or faulty, please try again.", "failure");
				navigate('/create-restaurant?step=2');
				return
			}
		}

		if (menuItemModifiers.length >= 1) {
			
			if (Object.entries(modifierChoices).length === 0) {
				setMessageAndMode("Menu is incomplete or faulty, please try again.", "failure");
				navigate('/create-restaurant?step=2');
				return
			}
			
			const areModifiersFaulty = menuItemModifiers.some(modifier => modifier.name === "" || modifier.menu_item === "")
			let areModifierChoicesFaulty = false;
			Object.entries(modifierChoices).forEach(choice => {
				const choicesArr = choice[1];
				areModifierChoicesFaulty = choicesArr.some(choice => choice.label === "");
			})
			
			if (areModifiersFaulty || areModifierChoicesFaulty) {
				setMessageAndMode("Menu is incomplete or faulty, please try again.", "failure");
				navigate('/create-restaurant?step=2');
				return
			}
		}

		// Discounts
		if (discounts.length > 1) {
			const allValid = discounts.every(
				(discount) => discount.valid_from !== "" && discount.valid_to !== ""
			);

			if (!allValid) {
				setMessageAndMode("Discount(s) are incomplete or faulty, please try again.", "failure");
				navigate('/create-restaurant?step=3');
				return
			}
		}
	}

	const clearData = () => {
		setRestaurantInfo({});
		setMenuItems([]);
		setMenuItemCategories([]);
		setMenuItemModifiers([]);
		setModifierChoices({});
		setDiscounts([]);
	}

	const getCategoryUUIDFromName = (createdCategories, categoryName) => {
		category = createdCategories.find(c => c.name === categoryName);
		return category.uuid;
	} 

	const createRestaurant = async () => {
		const restaurantData = new FormData();

		restaurantData.append("name", restaurantInfo.name);
		restaurantData.append("owner_uuid", user.uuid);
		restaurantData.append("address", restaurantInfo.address);
		restaurantData.append("phone", restaurantInfo.phone);
		restaurantData.append("category", restaurantInfo.category);
		restaurantData.append("opening_time", restaurantInfo.opening_time);
		restaurantData.append("closing_time", restaurantInfo.closing_time);
		restaurantData.append("image", restaurantInfo.image);

		const restaurantResponse = await sendRequest({
			method: "post",
			to: "/restaurants/create/",
			postData: restaurantData,
			desiredStatus: 201,
		});

		if (restaurantResponse.status !== 201) {
			setMessageAndMode("An error occurred.", "failure");
			clearData();
			navigate("/");
		}
			
		const restaurantUUID = restaurantResponse.data?.uuid;
		return restaurantUUID;
	}

	const createMenuCategories = async (restaurantUUID) => {
		const menuItemCategoriesData = menuItemCategories.map(category => ({ name: category }));

		const menuCategoriesResponse = await sendRequest({
			method: 'post',
			to: `/restaurants/${restaurantUUID}/menu_item_categories/create/`,
			postData: menuItemCategoriesData,
			desiredStatus: 201
		});

		if (menuCategoriesResponse.status !== 201) {
			setMessageAndMode("An error occurred.", "failure");
			clearData();
			navigate("/");
		}

		const menuCategories = menuCategoriesResponse.data;
		return menuCategories;
	}

	const createMenuItems = async (menuCategories, restaurantUUID) => {
		const menuItemsData = new FormData();

		const itemsPayload = menuItems.map((item, i) => {
			const { image, category, ...rest } = item;
			const menu_category = menuCategories.find(c => c.name === category);
			return { ...rest, 'category_uuid': menu_category.uuid, '_image_key': `image_${i}` };
		});

		menuItemsData.append('items', JSON.stringify(itemsPayload));

		menuItems.forEach((item, i) => {
			menuItemsData.append(`image_${i}`, item.image);
		})

		const menuItemsResponse = await sendRequest({
			method: 'post',
			to: `/restaurants/${restaurantUUID}/menu_items/create/`,
			postData: menuItemsData,
			desiredStatus: 201
		});

		if (menuItemsResponse.status === 201) {
			setMessageAndMode("SUCCESS OMGGG", "success");
		} else {
			setMessageAndMode("An error occurred.", "failure");
			clearData();
			navigate("/");
		}
	}

	const handleCancel = () => {
		clearData();
		setMessageAndMode("Successfully cancelled restaurant creation", "success");
		navigate("/");
	}
	
	const handleOpen = async () => {
		try {
			const restaurantUUID = await createRestaurant();
			const menuCategories = await createMenuCategories(restaurantUUID);
			await createMenuItems(menuCategories, restaurantUUID);

		} catch (err) {
			console.error(err || "An error occurred.")
			setMessageAndMode("An error occurred.", "failure");
		}
	}

	useEffect(() => {
		if (!user) {
			navigate('/');
		}
		validateRestaurantData();
	}, [step])

	return (
		<div className='w-full flex-1 flex flex-col justify-start items-center gap-6 pt-6'>
			<BsShop className='text-[10rem] text-neutral-600'/>
			<h2 className='font-poppins text-4xl font-semibold text-neutral-700'>Your almost done! Thanks for choosing Foodie.</h2>
			<div className='w-fit h-fit flex justify-normal items-center gap-4'>
				<button onClick={() => { handleOpen() }} className={`w-fit px-4 h-12 bg-neutral-800 rounded text-xl font-roboto font-semibold text-white hover:bg-neutral-700 transition disabled:bg-neutral-500 disabled:cursor-not-allowed text-nowrap`}>
					Open Restaurant
				</button>
				<button type='button' onClick={() => { handleCancel() }} className='w-32 h-12 border-[1px] border-neutral-800/50 hover:bg-rose-500 hover:text-white transition rounded text-xl font-roboto font-semibold text-neutral-700'>
					Cancel
				</button>
			</div>
		</div>
	)
}

export default CreateRestaurantConfirmation
