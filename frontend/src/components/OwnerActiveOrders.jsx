import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiInbox } from 'react-icons/fi';
import { formatDateTime, getOrderStatus } from '../utils/Utils';
import { MdFirstPage } from "react-icons/md";
import { MdLastPage } from "react-icons/md";
import { MdNavigateNext } from "react-icons/md";
import { MdNavigateBefore } from "react-icons/md";
import { MdFilterList } from "react-icons/md";
import { GlobalContext } from '../context/GlobalContext';
import axiosClient from '../utils/axiosClient'; 
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import AuthContext from '../context/AuthContext';

const OwnerActiveOrders = () => {

    const [selectedActiveOrder, setSelectedActiveOrder] = useState("");
    const [isFilteringActiveOrders, setIsFilteringActiveOrders] = useState(false);
    const [filters, setFilters] = useState({restaurant: '', payment_method: '', status: ''});
    const [activeOrders, setActiveOrders] = useState(null);
    const [ownedRestaurants, setOwnedRestaurants] = useState(null);
	const [selectedOrderOrderItems, setSelectedOrderOrderItems] = useState([]);
    const { user } = useContext(AuthContext);
    const { setMessageAndMode } = useContext(GlobalContext);
    const navigate = useNavigate();
    const websocket = useRef(null);

    const fetchActiveOrders = async (next=null, last=false, filters={}) => {
        try {
            let url;

            if (next) {
                url = next;
            } else {
                const baseUrl = `/owner/orders/active/`;
                const params = new URLSearchParams();

                if (last && activeOrders) {
                    params.append('page', activeOrders.total_pages);
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
                setActiveOrders(res.data);
				setSelectedActiveOrder("");
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

    const fetchOwnedRestaurants = async () => {
        try {
            const res = await axiosClient.get(`/owner/restaurants/?compact=true`);

            if (res.status === 200) {
                setOwnedRestaurants(res.data);
            } else {
                setMessageAndMode("Unexpected response", "failure");
                console.error("unexpected response status: ", res.status);
                navigate("/");
            }

        } catch (err) {
            console.error("Error while fetching owned restaurants", err);
            setMessageAndMode("An error occurred", "failure");
            navigate('/');
        }
    }

    const handleSelect = (uuid=null) => {
        if (!uuid) return;

		setSelectedActiveOrder((prev) => {
			const selected = selectedActiveOrder == uuid;
			if (selected) {
				return "";
			} else {
				return uuid;
			}
		});
    }

	const getOrderItems = () => {
		const order = activeOrders.results.find(order => order.uuid === selectedActiveOrder);
		setSelectedOrderOrderItems(order.order_items);
	}

    const handleReadyDecline = async (action="ready") => {
        try {
            let requestURL = '/owner/orders/active/ready-decline/';
            const params = new URLSearchParams();
            
            if (action === "ready") {
                params.append("action", "ready");
            } 
            else if (action === "decline") {
                params.append("action", "decline");
            }

            requestURL = requestURL + (params.toString() ? `?${params.toString()}` : '');
            
            const res = await axiosClient.post(requestURL, {
                order: selectedActiveOrder
            });

            if (res.status === 200) {
                fetchActiveOrders();
            } else {
                setMessageAndMode("Unexpected response", "failure");
                console.error("unexpected response status: ", res.status);
            }

        } catch (err) {
            console.error("Error while accepting orders", err);
            setMessageAndMode("An error occurred", "failure");
        }
    }

    useEffect(() => {
        if (user) {
            fetchActiveOrders();
            fetchOwnedRestaurants();
        }
    }, [])

    useEffect(() => {
        if ((filters.restaurant !== "" || filters.payment_method !== "" || filters.status !== "") && isFilteringActiveOrders && activeOrders.results.length !== 0) {
            fetchActiveOrders(null, false, filters);
        }
    }, [filters])

    useEffect(() => {
        if (!isFilteringActiveOrders && (filters.restaurant !== "" || filters.payment_method !== "" || filters.status !== "") && user) {
            setFilters({restaurant: "", payment_method: "", status: ""});
            fetchActiveOrders();
        }
    }, [isFilteringActiveOrders])

	useEffect(() => {
		if (selectedActiveOrder !== "") {
			getOrderItems();
		}
	}, [selectedActiveOrder])

    useEffect(() => {
        if (!user) {
            navigate('/');
        }

        const wsUrl = `ws://127.0.0.1:8000/ws/orders/${user.uuid}/incoming/active/`;
        websocket.current = new WebSocket(wsUrl);

        websocket.current.onmessage = (event) => {
            const incomingOrder = JSON.parse(event.data);
            if (incomingOrder) {
                setActiveOrders(prev => {
                    if (!activeOrders || activeOrders?.results.length === 0) {
                        fetchActiveOrders();
                        return prev;
                    }
                    
                    const alreadyExists = prev.results.some(order => order.uuid === incomingOrder.uuid);
                    if (alreadyExists) return prev;

                    return { ...prev, results: [ incomingOrder, ...prev.results ] };
                });
            }
        }
        
        websocket.current.onerror = (error) => {
            console.error("Websocket connection error: ", error);
            setMessageAndMode("Failed WS connection, try again later.", "failure");
            navigate('/');
        }

        return () => {
            if (websocket.current && websocket.current.readyState === WebSocket.OPEN) {
                websocket.current.close();
            }
        };
    }, [])

    return (
        <div className='border-[1.5px] border-neutral-400 w-full h-fit rounded-md flex flex-col justify-start items-start'>
            <div className='w-full h-fit border-b-[1.5px] border-neutral-400 px-4 py-2 flex justify-between items-center'>
                <div className='w-fit h-full flex justify-between items-center gap-4'>
                    <h1 className='font-notoserif text-2xl text-neutral-700 select-none'>Active Orders</h1>
                    <div className='w-fit h-full flex justify-center items-center gap-4'>
                        {(Array.isArray(activeOrders?.results)) && (
                            <span 
                                onClick={() => {
                                    if (activeOrders.results.length !== 0) {
                                        setIsFilteringActiveOrders(!isFilteringActiveOrders); 
                                    }
                                }}
                                className={`text-2xl cursor-pointer border-[1.5px] rounded-md p-1 ${isFilteringActiveOrders ? 'text-neutral-100 bg-neutral-700' : 'text-neutral-700 border-neutral-400'}`}>
                                <MdFilterList />
                            </span>
                        )}
                        {isFilteringActiveOrders && (
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
                                        <MenuItem value="preparing">Preparing</MenuItem>
                                        <MenuItem value="ready_for_pickup">Ready For Pickup</MenuItem>
                                        <MenuItem value="out_for_delivery">Out For Delivery</MenuItem>
                                    </Select>
                                </div>
                            </>
                        )}
                    </div>
                </div>
				<div className='w-fit h-full flex justify-center items-center gap-2'>
					{selectedActiveOrder !== "" && (
						<>
							<button onClick={() => { handleReadyDecline("ready") }} className='text-emerald-500 border-emerald-400 border-2 font-roboto font-semibold px-2 py-1 text-md transition-all duration-200 ease-in-out hover:text-neutral-100 hover:bg-emerald-500 hover:scale-x-[120%] text-nowrap'>Ready</button>
							<button onClick={() => { handleReadyDecline("decline") }} className='text-rose-500 border-rose-400 border-2 font-roboto font-semibold px-2 py-1 text-md transition-all duration-200 ease-in-out hover:text-neutral-100 hover:bg-rose-500 hover:scale-x-[120%] text-nowrap'>Decline</button>
						</>
					)}
				</div>
                <div className='w-fit h-full flex justify-center items-center gap-2'>
                    {activeOrders?.total_pages > 1 && (
                        <>
                            {activeOrders.previous ? (
                                <>
                                    <button onClick={() => { fetchActiveOrders(null, false, filters) }} className='w-8 h-8 border-[1px] border-neutral-500 rounded-full flex justify-center items-center'>
                                        <span className='text-neutral-700 text-2xl'>
                                            <MdFirstPage />
                                        </span>
                                    </button>
                                    <button onClick={() => { fetchActiveOrders(activeOrders.previous) }} className='w-8 h-8 border-[1px] border-neutral-500 rounded-full flex justify-center items-center'>
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
                                {activeOrders.current_page} / {activeOrders.total_pages}
                            </p>
                            {activeOrders.next ? (
                                <>
                                    <button onClick={() => { fetchActiveOrders(activeOrders.next); }} className='w-8 h-8 border-[1px] border-neutral-500 rounded-full flex justify-center items-center'>
                                        <span className='text-neutral-700 text-2xl'>
                                            <MdNavigateNext />
                                        </span>
                                    </button>
                                    <button onClick={() => { fetchActiveOrders(null, true, filters); }} className='w-8 h-8 border-[1px] border-neutral-500 rounded-full flex justify-center items-center'>
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
            {activeOrders ? (
                Array.isArray(activeOrders.results) && activeOrders.results.length !== 0 ? (
					<div className='w-full h-fit flex justify-start items-start'>
						<table className='w-[80%] h-40 table-auto border-collapse'>
							<thead className='border-b-[1.5px] border-neutral-400'>
								<tr className='text-neutral-700 font-opensans text-md cursor-default h-12'>
									<th className='w-12 h-10 px-4'>
										{/* <div onClick={() => { handleSelect(null, true) }} className={`w-6 h-6 rounded border-[1px] flex justify-center items-center cursor-pointer hover:border-neutral-600 ${activeOrders.results.length === selectedActiveOrder.length ? 'border-neutral-600' : 'border-neutral-400'}`}>
											{activeOrders.results.length === selectedActiveOrder.length && (
												<div className='w-4 h-4 rounded-sm bg-neutral-600' />
											)}
										</div> */}
									</th>
									<th>Restaurant</th>
									<th>Total Price / Discounted Price</th>
									<th>Payment Method</th>
									<th>Status</th>
									<th>Ordered At</th>
								</tr>
							</thead>
							<tbody>
								{activeOrders.results.map((order, index) => {
									const selected = selectedActiveOrder === order.uuid;
                                    if (order.order_status === "out_for_delivery") {
                                        return (
                                            <tr
                                                key={order.uuid}
                                                className={`text-neutral-700 bg-gray-100 relative h-16 ${index === activeOrders.results.length - 1 ? '' : 'border-b-[1px] border-gray-400'} cursor-default ${selected && 'bg-neutral-100'}`}
                                            >
                                                <td className='w-12 h-10 px-4'>
                                                    <div className={`w-6 h-6 rounded-sm border-[1px] border-gray-300 flex justify-center items-center cursor-not-allowed`} />
                                                </td>
                                                <td className='text-center'>{order.restaurant_name}</td>
                                                <td className='text-center'>Rs. {order.total_price} / Rs. {order.discounted_price}</td>
                                                <td className='text-center'>{order.payment_method === "cash_on_delivery" ? "Cash" : order.payment_method === "card" && "Card"}</td>
                                                <td className='text-center'>{getOrderStatus(order.order_status)}</td>
                                                <td className='text-center'>{formatDateTime(order.created_at)}</td>
                                            </tr>
                                        )
                                    } else {
                                        return (
                                            <tr 
                                                key={order.uuid}
                                                className={`text-neutral-700 relative h-16 ${index === activeOrders.results.length - 1 ? '' : 'border-b-[1px] border-gray-400'} cursor-pointer ${selected && 'bg-neutral-100'}`}
                                                onClick={() => { handleSelect(order.uuid) }}
                                            >
                                                <td className='w-12 h-10 px-4'>
                                                    <div 
                                                        className={`w-6 h-6 rounded-sm border-[1px] cursor-pointer ${selected ? 'border-neutral-600' : 'border-neutral-400'} hover:border-neutral-600 flex justify-center items-center`} 
                                                    >
                                                        {selected && (
                                                            <div className='w-3 h-3 rounded-sm bg-neutral-600' />
                                                        )}
                                                    </div>
                                                </td>
                                                <td className='text-center'>{order.restaurant_name}</td>
                                                <td className='text-center'>Rs. {order.total_price} / Rs. {order.discounted_price}</td>
                                                <td className='text-center'>{order.payment_method === "cash_on_delivery" ? "Cash" : order.payment_method === "card" && "Card"}</td>
                                                <td className='text-center'>{getOrderStatus(order.order_status)}</td>
                                                <td className='text-center'>{formatDateTime(order.created_at)}</td>
                                            </tr>
                                        )
                                    }
								})}
							</tbody>
						</table>
						<div className='w-[20%] h-[460px] flex flex-col justify-start items-center p-4 gap-4 overflow-y-scroll border-l-[1px] border-gray-400'>
							{selectedActiveOrder !== "" ? (
								selectedOrderOrderItems.map((item) => (
									<div key={item.menu_item.uuid} className='w-full min-h-32 max-h-32 border-[1px] border-gray-500 rounded flex flex-col justify-start items-center'>
										<div className='w-full h-[70%] flex justify-center items-center'>
											<img src={item.menu_item.image} alt={item.menu_item.name} className='object-cover w-full h-full' />
										</div>
										<div className='w-full h-[30%] flex justify-between items-center px-2'>
											<h2 className='font-roboto text-neutral-700 select-none font-semibold'>{item.menu_item.name}</h2>
											<h2 className='font-roboto text-neutral-700 select-none font-semibold'>Rs. {item.menu_item.price}</h2>
										</div>
									</div>
								))
							) : (
								<div className='w-full h-full flex justify-center items-center'>
									<h1 className='text-6xl text-neutral-500'>...</h1>
								</div>
							)}
						</div>
					</div>
                ) : (
                    <div className='w-full min-h-40 flex flex-col justify-center items-center'>
                        <h1 className='text-[5rem] text-neutral-300 cursor-default'><FiInbox /></h1>
                        <h1 className='text-3xl text-neutral-700 cursor-default font-poppins'>No active orders yet..</h1>
                    </div>
                )
            ) : (
                <div className='w-full h-fit flex flex-col justify-start items-start gap-4 p-6'>
                    <div className='w-full h-20 bg-neutral-200 rounded' />
                    <div className='w-full h-20 bg-neutral-200 rounded' />
                    <div className='w-full h-20 bg-neutral-200 rounded' />
                </div>
            )}
        </div>
    )
}

export default OwnerActiveOrders
