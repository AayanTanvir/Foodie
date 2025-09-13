import { useContext, useEffect, useRef, useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { GlobalContext } from "../context/GlobalContext";
import AuthContext from "../context/AuthContext";
import { sendRequest } from "../utils/Utils";
import { FaInbox } from "react-icons/fa";

const NotificationBell = () => {
	const { showNotifications, setShowNotifications, notifications, setNotifications, setMessageAndMode } = useContext(GlobalContext);
	const { user } = useContext(AuthContext);
	const websocket = useRef(null);

	const handleMarkAllRead = async () => {
		const res = await sendRequest({
			method: 'patch',
			to: `/notifications/${user.uuid}/mark-all-read/`,
			desiredStatus: 204
		});
		
		if (res) {
			setNotifications((prevNotifications) =>
				prevNotifications.map((notification) => ({ ...notification, is_read: true }))
			);
		} else {
			setMessageAndMode("An error occurred.", "failure");
		}
	}

	const handleClearAll = async () => {

		const res = await sendRequest({
			method: 'delete',
			to: `/notifications/${user.uuid}/clear/`,
			desiredStatus: 204
		});

		if (res) {
			setNotifications([]);
		} else {
            setMessageAndMode("An error occurred while clearing notifications", "failure");
		}
	}

	const fetchNotifications = async () => {
		const res = await sendRequest({
			method: 'get',
			to: `/notifications/${user.uuid}/`
		})

		if (res) {
			setNotifications(res.data);
		} else {
			setMessageAndMode("Failed to fetch notifications", "failure")
		}
	}
	
	useEffect(() => {
		if (user) {
			fetchNotifications();
		}
	}, [])

	useEffect(() => {
		if (!user) {
			setMessageAndMode("User not authenticated", "error");
		};
		const wsBaseUrl = import.meta.env.VITE_WS_URL;
		websocket.current = new WebSocket(`${wsBaseUrl}/notifications/${user.uuid}/`);

		websocket.current.onopen = () => {
			console.log("WebSocket connected");
		}
		
		websocket.current.onclose = () => {
			console.log("WebSocket disconnected");
		}

		websocket.current.onerror = (error) => {
            console.error("Websocket connection error: ", error);
        }

		websocket.current.onmessage = (event) => {
			const data = JSON.parse(event.data);
			setNotifications((prevNotifications) => [data, ...prevNotifications]);
		};

		return () => {
			websocket.current.close();
		};
	}, []);


	return (
		<div className="w-fit h-fit relative">
			<div onClick={() => { setShowNotifications(!showNotifications) }} className="w-fit h-full flex justify-center items-center p-1 cursor-pointer relative select-none">
				<IoMdNotificationsOutline className="text-neutral-600 text-2xl" />
				{(notifications.length > 0 && notifications.some((n) => !n.is_read)) && (
					<div className="w-3 h-3 absolute top-[15%] left-[55%] rounded-full bg-rose-600 border-[1px] border-neutral-600 flex justify-center items-center">
						<div className="w-1.5 h-1.5 rounded-full bg-white" />
					</div>
				)}
			</div>

			{showNotifications && (
				<div onMouseLeave={() => { setShowNotifications(false); }} className="w-[20rem] min-h-[15rem] bg-white border-[1px] border-neutral-800/50 rounded-r-lg rounded-bl-lg shadow-lg absolute top-[100%] left-[50%] flex flex-col justify-between items-start">
					{(Array.isArray(notifications) && notifications.length !== 0) ? (
						<>
							<div className="w-full flex-1">
								{notifications.map((notification, index) => (
									<div key={notification.uuid} className={`group w-full min-h-[3rem] border-neutral-800/50 ${notification.is_read ? 'bg-neutral-100' : ''} flex justify-normally items-center cursor-default ${index === notifications.length -1 ? '' : 'border-b-[1px]'} overflow-x-hidden`}>
										{!notification.is_read && (
											<div className="w-2 h-[3rem] bg-neutral-800 group-hover:w-4 transition-all duration-150 ease-in-out" />
										)}
										<p className="text-[0.8rem] font-opensans text-neutral-700 select-none text-wrap whitespace-break-spaces ml-2">{notification.content}</p>
									</div>
								))}
							</div>
							<div className="w-full h-[2rem] border-t-[1px] border-neutral-800/50 flex justify-center items-center">
								<button onClick={() => { handleMarkAllRead(); }} className="text-neutral-800 text-sm px-3 py-1 h-full border-l-[1px] border-neutral-800/60 hover:bg-neutral-100 transition-all duration-150 select-none">
									Mark All Read
								</button>
								<button onClick={() => { handleClearAll(); }} className="text-neutral-800 text-sm px-3 py-1 h-full border-x-[1px] border-neutral-800/60 hover:bg-neutral-100 transition-all duration-150 select-none">
									Clear All
								</button>
							</div>
						</>
					) : (
						<div className="w-full h-[15rem] flex flex-col justify-center items-center">
							<FaInbox className="text-6xl text-neutral-700"/>
							<p className="text-[1.2rem] font-opensans text-neutral-700">No notifications</p>
						</div>
					)}
				</div>
			)}
		</div>
	)
}

export default NotificationBell
