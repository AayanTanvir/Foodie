import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/GlobalContext";
import axiosClient from "../utils/axiosClient";
import AuthContext from "../context/AuthContext";
import { FiInbox } from "react-icons/fi";
import { formatDate, getOrderPaymentMethod, getOrderStatus } from "../utils/Utils";
import { useNavigate } from "react-router-dom";
import { MdFilterList, MdFirstPage, MdLastPage, MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { MenuItem, Select } from "@mui/material";


const OwnerAllOrders = ({ ownedRestaurants }) => {
	const [orders, setOrders] = useState(null);
	const [isFilteringOrders, setIsFilteringOrders] = useState(false);
	const [filters, setFilters] = useState({restaurant: '', payment_method: '', status: ''});
	const { user } = useContext(AuthContext);
	const { setMessageAndMode } = useContext(GlobalContext);
	const navigate = useNavigate();

	const fetchOrders = async (next=null, last=false, filters={}) => {
        try {
            let url;

            if (next) {
                url = next;
            } else {
                const baseUrl = `/owner/orders/all/`;
                const params = new URLSearchParams();

                if (last && orders) {
                    params.append('page', orders.total_pages);
                }

                if (filters?.restaurant) {
                    params.append('restaurant', filters.restaurant);
                }

                if (filters?.payment_method) {
                    params.append('payment_method', filters.payment_method);
                }

                if (filters?.status) {
                    params.append('status', filters.status);
                }

                url = baseUrl + (params.toString() ? `?${params.toString()}` : '');
            }

            const res = await axiosClient.get(url);

            if (res.status === 200) {
                setOrders(res.data);
            } else {
                setMessageAndMode("Unexpected response", "failure");
                console.error("unexpected response status: ", res.status);
                navigate("/");
            }
        } catch (err) {
            console.error("Error while fetching orders", err);
            setMessageAndMode("An error occurred", "failure");
            navigate('/');
        }
    }
	
	useEffect(() => {
		if (user) {
			fetchOrders();
		}
	}, []);

	useEffect(() => {
		if ((filters.restaurant !== "" || filters.payment_method !== "" || filters.status !== "") && isFilteringOrders && orders.results.length !== 0) {
			fetchOrders(null, false, filters);
		}
	}, [filters])

	useEffect(() => {
		if (!isFilteringOrders && (filters.restaurant !== "" || filters.payment_method !== "" || filters.status !== "") && user) {
			setFilters({restaurant: "", payment_method: "", status: ""});
			fetchOrders();
		}
	}, [isFilteringOrders])

	return (
		<div className='border-[1.5px] border-neutral-400 w-full h-fit rounded-md flex flex-col justify-start items-start'>
			<div className='w-full h-fit border-b-[1.5px] border-neutral-400 px-4 py-2 flex justify-between items-center relative'>
				<div className='w-fit h-full flex justify-center items-center gap-4'>
					{(Array.isArray(orders?.results)) && (
						<span 
							onClick={() => {
								if (orders.results.length !== 0) {
									setIsFilteringOrders(!isFilteringOrders);
								}
							}}
							className={`text-2xl cursor-pointer border-[1.5px] rounded-md p-1 ${isFilteringOrders ? 'text-neutral-100 bg-neutral-700' : 'text-neutral-700 border-neutral-400'}`}>
							<MdFilterList />
						</span>
					)}
					{isFilteringOrders && (
						<>
							<div className='w-fit h-full flex justify-between items-center gap-2'>
								<span className='text-md text-neutral-700 cursor-default '>Restaurant: </span>
								<Select
									value={filters.restaurant}
									autoWidth
									onChange={e => setFilters({...filters, restaurant: e.target.value })}
									size='small'
									sx={{
										minWidth: 120,
										height: 35,
										'& .MuiOutlinedInput-notchedOutline': {
											borderColor: 'gray',
										},
										'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
											borderColor: '#262626',
										},
									}}
								>   
									{ownedRestaurants?.map(restaurant => (
										<MenuItem key={restaurant.uuid} value={restaurant.uuid}>{restaurant.restaurant}</MenuItem>
									))}
								</Select>
							</div>
							<div className='w-fit h-full flex justify-between items-center gap-2'>
								<span className='text-md text-neutral-700 cursor-default '>Payment Method: </span>
								<Select
									value={filters.payment_method}
									autoWidth
									onChange={e => setFilters({...filters, payment_method: e.target.value })}
									size='small'
									sx={{
										minWidth: 120,
										height: 35,
										'& .MuiOutlinedInput-notchedOutline': {
											borderColor: 'gray',
										},
										'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
											borderColor: '#262626',
										},
									}}
								>   
									<MenuItem value="cash_on_delivery">Cash</MenuItem>
									<MenuItem value="card">Card</MenuItem>
								</Select>
							</div>
							<div className='w-fit h-full flex justify-between items-center gap-2'>
								<span className='text-md text-neutral-700 cursor-default '>Status: </span>
								<Select
									value={filters.status}
									autoWidth
									onChange={e => setFilters({...filters, status: e.target.value })}
									
									sx={{
										minWidth: 120,
										height: 35,
										'& .MuiOutlinedInput-notchedOutline': {
											borderColor: 'gray',
										},
										'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
											borderColor: '#262626',
										},
									}}
								>   
									<MenuItem value="delivered">Delivered</MenuItem>
									<MenuItem value="declined">Declined</MenuItem>
									<MenuItem value="cancelled">Cancelled</MenuItem>
								</Select>
							</div>
						</>
					)}
				</div>

				<h1 className={`cursor-default font-notoserif text-4xl text-neutral-800 absolute ${isFilteringOrders ? 'left-[60%]' : 'left-1/2 -translate-x-1/2'}`}>Orders</h1>

				<div className='w-fit h-full flex justify-center items-center gap-2'>
					{orders?.total_pages > 1 && (
						<>
							{orders.previous ? (
								<>
									<button onClick={() => { fetchOrders(null, false, filters) }} className='w-8 h-8 border-[1px] border-neutral-500 rounded-full flex justify-center items-center'>
										<span className='text-neutral-700 text-2xl'>
											<MdFirstPage />
										</span>
									</button>
									<button onClick={() => { fetchOrders(orders.previous) }} className='w-8 h-8 border-[1px] border-neutral-500 rounded-full flex justify-center items-center'>
										<span className='text-neutral-700 text-2xl'>
											<MdNavigateBefore />
										</span>
									</button>
								</>
							) : (
								<>
									<button className='w-8 h-8 border-[1px] cursor-not-allowed border-neutral-300 rounded-full flex justify-center items-center'>
										<span className='text-neutral-400 text-2xl'>
											<MdFirstPage />
										</span>
									</button>
									<button className='w-8 h-8 border-[1px] cursor-not-allowed border-neutral-300 rounded-full flex justify-center items-center'>
										<span className='text-neutral-400 text-2xl'>
											<MdNavigateBefore />
										</span>
									</button>
								</>
							)}
							<p className='text-neutral-700 text-xl font-hedwig cursor-default'>
								{orders.current_page} / {orders.total_pages}
							</p>
							{orders.next ? (
								<>
									<button onClick={() => { fetchOrders(orders.next); }} className='w-8 h-8 border-[1px] border-neutral-500 rounded-full flex justify-center items-center'>
										<span className='text-neutral-700 text-2xl'>
											<MdNavigateNext />
										</span>
									</button>
									<button onClick={() => { fetchOrders(null, true, filters); }} className='w-8 h-8 border-[1px] border-neutral-500 rounded-full flex justify-center items-center'>
										<span className='text-neutral-700 text-2xl'>
											<MdLastPage />
										</span>
									</button>
								</>
							) : (
								<>
									<button className='w-8 h-8 border-[1px] cursor-not-allowed border-neutral-300 rounded-full flex justify-center items-center'>
										<span className='text-neutral-400 text-2xl'>
											<MdNavigateNext />
										</span>
									</button>
									<button className='w-8 h-8 border-[1px] cursor-not-allowed border-neutral-300 rounded-full flex justify-center items-center'>
										<span className='text-neutral-400 text-2xl'>
											<MdLastPage />
										</span>
									</button>
								</>
							)}
						</>
					)}
				</div>
			</div>
			{orders ? (
				Array.isArray(orders.results) && orders.results.length !== 0 ? (
					<div className="w-full h-fit grid auto-rows-auto grid-cols-3 p-6 gap-5">
						{orders.results.map((order) => (
							<div key={order.uuid} onClick={() => navigate(`/orders/${order.uuid}`)} className="w-full min-h-[150px] border-[1px] border-neutral-400 rounded flex flex-col justify-between items-start p-4 cursor-pointer transition hover:border-neutral-800 relative overflow-hidden">
								<div className="w-full flex justify-start items-center gap-2 mb-1">
									<h1 className='font-poppins text-lg text-nowrap text-neutral-700 px-3 py-1 rounded-md border-[1px] border-neutral-400 w-fit font-semibold'>Rs. {Math.round(order?.discounted_price)} {order?.discounted_price !== order?.total_price && <span className='font-poppins line-through text-sm text-neutral-500'>{Math.round(order?.total_price)}</span>}</h1>
									<h1 className={`font-poppins text-lg text-neutral-700 px-3 py-1 rounded-md border-[1px] border-neutral-400 w-fit font-semibold capitalize ${
										order.order_status === 'delivered'
                                            ? 'bg-emerald-100 text-emerald-500'
                                            : order.order_status === 'cancelled' || order.order_status === 'declined'
                                            ? 'bg-rose-100 text-rose-700'
                                            : 'bg-neutral-200 text-neutral-700'
									}`}>{getOrderStatus(order?.order_status)}</h1>
								</div>
								<div className="flex flex-col justify-center h-full">
									<h1 className='font-poppins text-2xl text-neutral-700'>{order.restaurant_name}</h1>
									<span className='font-poppins text-xs text-neutral-600'>{formatDate(order?.created_at)}</span>
									<span className='font-poppins text-xs text-neutral-600'>{getOrderPaymentMethod(order?.payment_method)}</span>
								</div>
								<div className='absolute top-4 -right-4 bg-neutral-800 w-0 md:w-[6rem] h-[20px] rotate-[40deg]' />
							</div>
						))}
					</div>
				) : (
					<div className='w-full h-40 flex flex-col justify-center items-center'>
						<h1 className='text-[5rem] text-neutral-300 cursor-default'><FiInbox /></h1>
						<h1 className='text-3xl text-neutral-600 cursor-default font-poppins'>No orders yet...</h1>
					</div>
				)
			) : (
				<div className="w-full h-40 bg-neutral-200" />
			)}
		</div>
	)
}

export default OwnerAllOrders
