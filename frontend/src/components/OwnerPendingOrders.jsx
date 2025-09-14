import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiInbox } from 'react-icons/fi';
import { formatDateTime, getOrderStatus, sendRequest } from '../utils/Utils';
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

const OwnerPendingOrders = ({ ownedRestaurants }) => {

    const [selectedPendingOrders, setSelectedPendingOrders] = useState([]);
    const [isFilteringPendingOrders, setIsFilteringPendingOrders] = useState(false);
    const [filters, setFilters] = useState({restaurant: '', payment_method: ''});
    const [pendingOrders, setPendingOrders] = useState(null);
	const [selectedOrderOrderItems, setSelectedOrderOrderItems] = useState([]);
    const { user } = useContext(AuthContext);
    const { setMessageAndMode } = useContext(GlobalContext);
    const navigate = useNavigate();
    const websocket = useRef(null);

    const fetchPendingOrders = async (next=null, last=false, filters={}) => {
        let url;

        if (next) {
            url = next;
        } else {
            const baseUrl = `/owner/orders/pending/`;
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

        
        const res = await sendRequest({
            method: "get",
            to: url
        });

        if (res) {
            setPendingOrders(res.data);
            setSelectedOrderOrderItems([]);
        } else {
            setMessageAndMode("An error occurred.", "failure");
            navigate('/');
        }
    }


    const handleSelect = (uuid=null, all=false) => {
        if ((!uuid && all === false) || (all === true && !pendingOrders)) return;
        if (all) {
            const allSelected = pendingOrders.results.length === selectedPendingOrders.length;
            if (allSelected) {
                setSelectedPendingOrders([]);
            } else {
                let allOrders = [];
                pendingOrders.results.forEach(order => {
                    allOrders.push(order.uuid);
                });
                setSelectedPendingOrders(allOrders);
            }
        } else {
            setSelectedPendingOrders((prev) => {
                const selected = selectedPendingOrders.includes(uuid);
                if (selected) {
                    return selectedPendingOrders.filter(item => item !== uuid);
                } else {
                    return [...prev, uuid];
                }
            });
        }
    }

	const getOrderItems = () => {
		const order = pendingOrders.results.find(order => order.uuid === selectedPendingOrders.at(0));
		setSelectedOrderOrderItems(order.order_items);
	}

	const handleAcceptDecline = async (accept=true) => {
		try {
            let requestURL = '/owner/orders/pending/accept-decline/';
            const params = new URLSearchParams();
            
            if (accept) {
                params.append("accept", "True");
            } else {
                params.append("accept", "False");
            }
            requestURL = requestURL + (params.toString() ? `?${params.toString()}` : '');
            
            const res = await axiosClient.post(requestURL, {
				orders: selectedPendingOrders
			});

            if (res.status === 200) {
                setMessageAndMode("Order(s) Accepted", "success");
                fetchPendingOrders();
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
            fetchPendingOrders();
        }
    }, [])

    useEffect(() => {
        if (pendingOrders) {
            setSelectedPendingOrders([]);
        }
    }, [pendingOrders])

    useEffect(() => {
        if ((filters.restaurant !== "" || filters.payment_method !== "") && isFilteringPendingOrders && pendingOrders.results.length !== 0) {
            fetchPendingOrders(null, false, filters);
        }
    }, [filters])

    useEffect(() => {
        if (!isFilteringPendingOrders && (filters.restaurant !== '' || filters.payment_method !== '') && user) {
            setFilters({restaurant: '', payment_method: ''});
            fetchPendingOrders();
        }
    }, [isFilteringPendingOrders])

	useEffect(() => {
		if (selectedPendingOrders.length === 1) {
			getOrderItems()
		} else {
			setSelectedOrderOrderItems([]);
		}
	}, [selectedPendingOrders])

    useEffect(() => {
        if (!user) {
            navigate('/');
        }

        const baseWsUrl = import.meta.env.VITE_WS_URL;
        websocket.current = new WebSocket(`${baseWsUrl}/orders/${user.uuid}/incoming/pending/`);

        websocket.current.onmessage = (event) => {
            const incomingOrder = JSON.parse(event.data);
            if (incomingOrder) {
                setPendingOrders(prev => {
                    if (!pendingOrders || pendingOrders?.results.length === 0) {
                        fetchPendingOrders();
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
                    <h1 className='font-notoserif text-2xl text-neutral-700 select-none'>Pending Approvals</h1>
                    <div className='w-fit h-full flex justify-center items-center gap-4'>
                        {(Array.isArray(pendingOrders?.results)) && (
                            <span 
                                onClick={() => { 
                                    if (pendingOrders.results.length !== 0) {
                                        setIsFilteringPendingOrders(!isFilteringPendingOrders);
                                    }
                                }} 
                                className={`text-2xl cursor-pointer border-[1.5px] rounded-md p-1 ${isFilteringPendingOrders ? 'text-neutral-100 bg-neutral-700' : 'text-neutral-700 border-neutral-400'}`}>
                                <MdFilterList />
                            </span>
                        )}
                        {isFilteringPendingOrders && (
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
                            </>
                        )}
                    </div>
                </div>
				<div className='w-fit h-full flex justify-center items-center gap-2'>
					{selectedPendingOrders.length !== 0 && (
						<>
							<button onClick={() => { handleAcceptDecline(true) }} className='text-emerald-500 border-emerald-400 border-2 font-roboto font-semibold px-2 py-1 text-md transition-all duration-200 ease-in-out hover:text-neutral-100 hover:bg-emerald-500 hover:scale-x-[120%] text-nowrap'>Accept</button>
							<button onClick={() => { handleAcceptDecline(false) }} className='text-rose-500 border-rose-400 border-2 font-roboto font-semibold px-2 py-1 text-md transition-all duration-200 ease-in-out hover:text-neutral-100 hover:bg-rose-500 hover:scale-x-[120%] text-nowrap'>Decline</button>
						</>
					)}
				</div>
                <div className='w-fit h-full flex justify-center items-center gap-2'>
                    {pendingOrders?.total_pages > 1 && (
                        <>
                            {pendingOrders.previous ? (
                                <>
                                    <button onClick={() => { fetchPendingOrders(null, false, filters) }} className='w-8 h-8 border-[1px] border-neutral-500 rounded-full flex justify-center items-center'>
                                        <span className='text-neutral-700 text-2xl'>
                                            <MdFirstPage />
                                        </span>
                                    </button>
                                    <button onClick={() => { fetchPendingOrders(pendingOrders.previous) }} className='w-8 h-8 border-[1px] border-neutral-500 rounded-full flex justify-center items-center'>
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
                                {pendingOrders.current_page} / {pendingOrders.total_pages}
                            </p>
                            {pendingOrders.next ? (
                                <>
                                    <button onClick={() => { fetchPendingOrders(pendingOrders.next); }} className='w-8 h-8 border-[1px] border-neutral-500 rounded-full flex justify-center items-center'>
                                        <span className='text-neutral-700 text-2xl'>
                                            <MdNavigateNext />
                                        </span>
                                    </button>
                                    <button onClick={() => { fetchPendingOrders(null, true, filters); }} className='w-8 h-8 border-[1px] border-neutral-500 rounded-full flex justify-center items-center'>
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
            {pendingOrders ? (
                Array.isArray(pendingOrders.results) && pendingOrders.results.length !== 0 ? (
					<div className='w-full h-fit flex justify-start items-start'>
						<table className='w-[80%] h-40 table-auto border-collapse'>
							<thead className='border-b-[1.5px] border-neutral-400'>
								<tr className='text-neutral-700 font-opensans text-md cursor-default h-12'>
									<th className='w-12 h-10 px-4'>
										<div onClick={() => { handleSelect(null, true) }} className={`w-6 h-6 rounded border-[1px] flex justify-center items-center cursor-pointer hover:border-neutral-600 ${pendingOrders.results.length === selectedPendingOrders.length ? 'border-neutral-600' : 'border-neutral-400'}`}>
											{pendingOrders.results.length === selectedPendingOrders.length && (
												<div className='w-4 h-4 rounded-sm bg-neutral-600' />
											)}
										</div>
									</th>
									<th>Restaurant</th>
									<th>Total Price / Discounted Price</th>
									<th>Payment Method</th>
									{/* <th>Status</th> */}
									<th>Ordered At</th>
								</tr>
							</thead>
							<tbody>
								{pendingOrders.results.map((order, index) => {
									const selected = selectedPendingOrders.includes(order.uuid);
									return (
										<tr 
											key={order.uuid}
											className={`text-neutral-700 relative h-16 ${index === pendingOrders.results.length - 1 ? '' : 'border-b-[1px] border-gray-400'} cursor-pointer ${selected && 'bg-neutral-100'}`}
											onClick={() => { handleSelect(order.uuid) }}
										>
											<td className='w-12 h-10 px-4'>
												<div 
													className={`w-6 h-6 rounded-full border-[1px] cursor-pointer ${selected ? 'border-neutral-600' : 'border-neutral-400'} hover:border-neutral-600 flex justify-center items-center`} 
												>
													{selected && (
														<div className='w-3 h-3 rounded-full bg-neutral-600' />
													)}
												</div>
											</td>
											<td className='text-center'>{order.restaurant_name}</td>
											<td className='text-center'>Rs. {order.total_price} / Rs. {order.discounted_price}</td>
											<td className='text-center'>{order.payment_method === "cash_on_delivery" ? "Cash" : order.payment_method === "card" && "Card"}</td>
											{/* <td className='text-center'>{getOrderStatus(order.order_status)}</td> */}
											<td className='text-center'>{formatDateTime(order.created_at)}</td>
										</tr>
									)
								})}
							</tbody>
						</table>
						<div className='w-[20%] h-[460px] flex flex-col justify-start items-center p-4 gap-4 overflow-y-scroll border-l-[1px] border-gray-400'>
							{selectedPendingOrders.length === 1 ? (
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
                        <h1 className='text-3xl text-neutral-700 cursor-default font-poppins'>No incoming orders yet..</h1>
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

export default OwnerPendingOrders
